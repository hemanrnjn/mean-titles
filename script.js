chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  changeSubtitlesStyle(message.vPos, message.fSize, message.fColor);
});

function getMeaning(video, vPos) {
    let val = "";
    const subtitles = document.querySelector(".player-timedtext");
    if (subtitles && video && video.paused) {
        subtitles.style.bottom = vPos + "px";

        // .player-timedtext > .player-timedtext-container [0]
        const firstChildContainer = subtitles.firstChild;
        if (subtitles.firstChild != null && val === "") {
            // console.log("mila", subtitles.firstChild.innerText)
            val = subtitles.firstChild.innerText;
            // console.log(val);
            var request = new XMLHttpRequest();
            request.open('GET', "http://localhost:8000/api/meaning/" + val.split(" ")[0], true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.setRequestHeader('Accept', 'application/json');
            request.send();

            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    let resp = JSON.parse(request.responseText);
                    if (resp.includes("Error 404")) {
                        console.log("Invalid Word")
                    } else {
                        let obj = JSON.parse(resp);
                        console.log(obj.definitions[0].definition);
                    }
                }
            };
        }
    }
}

changeSubtitlesStyle = (vPos, fSize, fColor) => {
  console.log("%cnetflix-subtitles-styler : observer is working... ", "color: red;");
  let callback = () => {
      const video = document.querySelector("video:first-of-type");
      // .player-timedText
      getMeaning(video, vPos);
      if (video) {
          video.addEventListener("onpause", function(e) {
              console.log(e);
              getMeaning(video, vPos)
          });
      }
  };



  const observer = new MutationObserver(callback);
  observer.observe(document.body, {
      subtree: true,
      attributes: false,
      childList: true
  });
};
