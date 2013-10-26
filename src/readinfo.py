import requests
from redis import Redis
import json
from flask import Flask, request, jsonify, make_response, current_app
from datetime import timedelta
from functools import update_wrapper


app = Flask(__name__)
app.config['DEBUG'] = True

redis = Redis()

GoogleUrlPrefix = 'https://www.googleapis.com/customsearch/v1?'
GoogleUrlForm = {
    'key': 'AIzaSyDmMN9iB9u-z3AC7_ZXNceoX9D9BwePgIU',
    'cx': '018046081118850151085:cbm9iuhwzdw',
    'q': 'nuclear',
}


def googleRequest(keyword):
    GoogleUrlForm['q'] = keyword
    url = GoogleUrlPrefix + '&'.join(["%s=%s" % (k, v) for k, v in GoogleUrlForm.items()])
    return url


def query_google(keyword):
    url = googleRequest(keyword)
    res = requests.get(url)
    text = res.json()
    return text


def add_related_media(keyword, media_title, media_url):
    redis.zadd(
        keyword,
        json.dumps({"url": media_url, "title": media_title}),
        0
    )
    redis.hset(
        "url_keyword_map",
        media_url,
        keyword
    )


def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator


def clean_title(q):
    # Kick out all domains
    words = q.split()
    remaining_words = []
    for word in words:
        if "." not in word:
            remaining_words.append(word)

    # Take the first 7 words
    return " ".join(remaining_words[:7])


@app.route('/query')
@crossdomain(origin='*')
def query():
    """ Query the google custom search APIs to get different default other opinions

    Params:
        q: (str) The search string to use for the different custom APIs
        url: (str) URL of the page where the user is right now

    Returns:
        [list of {title: str, url: str}] A ranked list of related URLs
    """
    q = request.args["q"]
    q = clean_title(q)
    print "q: %s" % q
    url = request.args["url"]
    print "url: %s" % url
    keyword = redis.hget("url_keyword_map", url)
    if not keyword:
        keyword = q
        print "querying google"
        google_results = query_google(keyword)
        redis.hset("url_keyword_map", url, keyword)
        for item in google_results["items"]:
            add_related_media(keyword, item["title"], item["link"])

    all_items = redis.zrevrangebyscore(keyword, "+inf", "-inf")
    return jsonify(results=[json.loads(s) for s in all_items])


if __name__ == '__main__':
    app.run(port=80)
