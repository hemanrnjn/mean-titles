// chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
//     if (changeInfo.status === 'complete' && tab.active) {
//         console.log("loaded");
//         chrome.tabs.executeScript(tabId, {file: "script.js"});
//     }
// });
//
// chrome.runtime.onInstalled.addListener(function callback) {
//
// }
//
// // chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
// //     let url = "";
// //     chrome.tabs.getCurrent(function(tab){
// //         url = tab.url;
// //     });
// //
// //     if (changeInfo.status === 'complete') {
// //         chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// //             chrome.tabs.sendMessage(tabs[0].id, {url: url}, function(response) {
// //                 console.log(response.message);
// //             });
// //         });
// //     }
// // });
//
//
//
