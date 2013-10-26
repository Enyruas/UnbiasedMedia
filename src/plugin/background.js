var news_page = [
"www.foxnews.com",
"www.cnn.com",
"www.democracynow.org",
"www.bbc.com",
"www.theguardian.com",
"www.telegraph.co.uk",
"www.nzherald.co.nz",
"www.news.com.au",
"www.theaustralian.com.au",
"www.crikey.com.au",
"www.heraldsun.com.au",
"globalresearch.ca",
"www.france24.com",
"www.thelocal.de",
"www.spiegel.de",
"www.jpost.com",
"www.dailystar.com.lb",
"www.aljazeera.com",
"www.egyptdailynews.com",
"www.xinhuanet.com",
"www.taipeitimes.com",
"www.chinadaily.com.cn",
"english.pravda.ru",
"www.themoscowtimes.com",
"www.antiwar.com",
"therealnews.com",
"news.antiwar.com",
"europe.chinadaily.com.cn",
"truth-out.org",
"www.theguardian.com",
"www.telegraph.co.uk",
]

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
