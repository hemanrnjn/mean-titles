chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  changeSubtitlesStyle(message.vPos, message.fSize, message.fColor);
});

changeSubtitlesStyle = (vPos, fSize, fColor) => {
  console.log("%cnetflix-subtitles-styler : observer is working... ", "color: red;");
  var val = ""
  callback = () => {
    // .player-timedText
    const subtitles = document.querySelector(".player-timedtext");
    if (subtitles) {
      subtitles.style.bottom = vPos + "px";

      // .player-timedtext > .player-timedtext-container [0]
      const firstChildContainer = subtitles.firstChild;
      if (subtitles.firstChild != null && val == "") {
        console.log("mila", subtitles.firstChild.innerText)
          val = subtitles.firstChild.innerText
          console.log(val)
          var request = new XMLHttpRequest();
          request.open('GET', "https://owlbot.info/api/v4/dictionary/" + val.split(" ")[0], true);
          request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
          request.setRequestHeader('Authorization', 'Token 23db56a1aace2a60d425f5456265e8d988819728');
          request.setRequestHeader('Accept', 'application/json');
          request.setRequestHeader('Access-Control-Allow-Origin', '*');
          request.setRequestHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS, PUT, DELETE');
          request.send();

          request.onreadystatechange = function () {
              if (request.readyState === 4) {
                console.log(request.responseText);
              }
          };
        }
      }
  };

  const observer = new MutationObserver(callback);
  observer.observe(document.body, {
    subtree: true,
    attributes: false,
    childList: true
  });
};
