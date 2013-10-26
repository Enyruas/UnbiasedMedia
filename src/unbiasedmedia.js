$(document).ready(function() {
    chrome.storage.local.get("last_url", function(items) {
        var url = items["last_url"];
        chrome.storage.local.get("last_title", function(items) {
            var title = items["last_title"];
            $.get("http://localhost/query", {q: title, url: url}, function(data) {
                console.log(data);
                for (var i in data.results) {
                    var item = data.results[i];
                    console.log(item);
                    $("#related-news").append(
                        '<p><a target="_blank" href="' + item["url"] + '">' + item["title"] + '</a></p>'
                    );
                }
            });
        });
    });
});
