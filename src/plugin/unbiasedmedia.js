var title;
var url;

$(document).ready(function() {
    chrome.storage.local.get("last_url", function(items) {
        url = items["last_url"];
        chrome.storage.local.get("last_title", function(items) {
            title = items["last_title"];
            $.get("http://10.21.106.44/query", {q: title, url: url}, function(data) {
                console.log(data);
                for (var i in data.results) {
                    var item = data.results[i];
                    console.log(item);
                    $("#related-news").append(
                        '<div class="newsentry" data-area="'
                            + item["area"] +
                        '"><span class="label label-default">'
                            + item["area"] +
                        '</span> <a class="opinionLink" target="_blank" href="'
                            + item["url"] +
                        '">'
                            + item["display"] +
                        '</a><button class="btn btn-danger btn-xs btn-discard"><span class="glyphicon glyphicon-minus-sign"></span></button></div>'
                    );
                }
                if (!data.results.length) {
                    $("#related-news").append(
                        '<div class="noentries">No other opinions. Add yours now!</div>'
                    );
                }
            });
        });
    });
});


$(document).on("click", ".btn-discard", function() {
    $(this).parent().hide();
});
