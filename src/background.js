var news_page = [
    "news.antiwar.com",
    "europe.chinadaily.com.cn",
    "truth-out.org"
]

var fake_database = {
    "http://news.antiwar.com/2013/10/23/iran-halts-20-percent-uranium-enrichment/": [
        {"name": "China Daily new", "url": "http://europe.chinadaily.com.cn/china/2013-10/17/content_17041193.htm"},
        {"name": "Truth Out", "url": "http://truth-out.org/news/item/15420-pressing-ahead-with-iran-pipeline-pakistan-calls-washingtons-bluff"}
    ]
}

function checkForValidUrl(tabId, changeInfo, tab) {
    var domain = tab.url.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1];
    console.log(domain);
    console.log(tab.url);
    if (news_page.indexOf(domain) > -1) {
        chrome.pageAction.show(tabId);
        chrome.storage.local.set({"last_url": tab.url});
        chrome.storage.local.set({"last_title": tab.title});
    }
};
chrome.tabs.onUpdated.addListener(checkForValidUrl);
