$(document).ready(function() {
    var related_news = chrome.storage.local.get("related_news", function(items) {
        for (var i in items["related_news"]) {
            console.log(items["related_news"][i]);
            var item = items["related_news"][i];
            $("#related-news").append('<p><a target="_blank" href="' + item["url"] + '">' + item["name"] + '</a></p>');
        }
    });
});
