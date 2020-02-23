var initialised = false;
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "sent") {
        sendResponse({message: "received"});
        initialised = false;
        startListener();
    }
});

function getMeaning(video) {
    let val = [];
    const subtitles = document.querySelector(".player-timedtext");
    if (subtitles && video.paused) {
        // .player-timedtext > .player-timedtext-container [0]
        const firstChildContainer = subtitles.firstChild;
        if (subtitles.firstChild != null && val.length === 0) {
            let children = subtitles.children;
            for (let i = 0; i < children.length; i++) {
                let x = children[i].innerText.split(" ");
                x.forEach((e) => {
                    let y = e.replace(/[^\w\s]/gi, '');
                    val.push(y)
                });
            }
            // document.getElementById('mean-title-list').innerHTML = str;
            // let mapObj = [];
            let count = 0;
            let listHtml = '<ul class="list-group">';
            val.forEach((v) => {
                let request = new XMLHttpRequest();
                request.open('GET', "http://localhost:8000/api/meaning/" + v, true);
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
                            console.log(obj);
                            if (obj.hasOwnProperty('definitions')) {
                                // mapObj.push({word: v, meaning: obj.definitions[0].definition})
                                listHtml += '<li class="list-group-item">' + v + ": " + obj.definitions[0].definition + '</li>';
                            } else {
                                // mapObj.push({word: v, meaning: "No meaning"})
                                listHtml += '<li class="list-group-item">' + v + ': No meaning</li>';
                            }
                            // listHtml += '<li class="list-group-item">' + o.word + ": " + o.meaning + '</li>';
                        }
                        count++
                    }
                };
            });
            // console.log(mapObj);
            // mapObj.forEach((o) => {
            //     listHtml += '<li class="list-group-item">' + o.word + ": " + o.meaning + '</li>';
            // });
            listHtml += '</ul>';
            let intervalId = setInterval(() => {
                if (count === val.length) {
                    Swal.fire({
                        position: 'top-end',
                        title: 'Word List',
                        html: listHtml,
                        showCloseButton: true,
                    });
                    clearInterval(intervalId);
                }
            }, 1000);
        }
    }
}


function startListener() {
    console.log("%cMean-titles : Listener is working... ", "color: red;");
    let callback = () => {
        const video = document.querySelector("video:first-of-type");
        // .player-timedText
        if (video && !initialised) {
            initialised = true;
            video.onpause = function (e) {
                getMeaning(video)
            }
        }
    };



    const observer = new MutationObserver(callback);
    observer.observe(document.body, {
        subtree: true,
        attributes: false,
        childList: true
    });
}


