var database = {
    "http://news.antiwar.com/2013/10/23/iran-halts-20-percent-uranium-enrichment/": [
        {"name": "China Daily", "url": "http://europe.chinadaily.com.cn/china/2013-10/17/content_17041193.htm"},
        {"name": "Truth Out", "url": "http://truth-out.org/news/item/15420-pressing-ahead-with-iran-pipeline-pakistan-calls-washingtons-bluff"}
    ]
}

function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url in database) {
    chrome.pageAction.show(tabId);

    chrome.storage.local.set({"related_news": database[tab.url]});
  }
};
chrome.tabs.onUpdated.addListener(checkForValidUrl);
