let netflixInit = false;
let primeInit = false;
let hostUrl = location.href;
if (hostUrl.includes("netflix") || hostUrl.includes("youtube")) {
    netflixInit = false;
    startListener(hostUrl);
} else if (hostUrl.includes("primevideo")) {
    primeInit = false;
    startListener(hostUrl);
}

function getMeaning(source, video) {
    let val = [];
    var subtitles;
    if (source === "netflix") {
        subtitles = document.querySelector(".player-timedtext");
    } else if (source === "primevideo") {
        subtitles = document.querySelector('.persistentPanel');
    } else if (source === "youtube") {
        subtitles = document.querySelector(".captions-text");
    }

    if (subtitles && video.paused) {
        if (subtitles.firstChild != null && val.length === 0) {
            let children = subtitles.children;
            for (let i = 0; i < children.length; i++) {
                let x = [];
                if (source === "primevideo") {
                    x = children[i].innerText.replace(/(\r\n|\n|\r)/gm," ").split(" ")
                } else {
                    x = children[i].innerText.split(" ");
                }
                x.forEach((e) => {
                    let y = e.replace(/[^\w\s]/gi, '');
                    val.push(y)
                });
                //removing duplicates
                val = val.filter(function(item,i,allItems){
                    return i===allItems.indexOf(item);
                });
            }
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
                            if (obj.hasOwnProperty('definitions')) {
                                listHtml += '<li class="list-group-item">' + v + ": " + obj.definitions[0].definition + '</li>';
                            } else {
                                listHtml += '<li class="list-group-item">' + v + ': No meaning</li>';
                            }
                        }
                        count++
                    }
                };
            });
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
            let intrId = setInterval(() => {
                if (source === "primevideo") {
                    let x = document.querySelector(".swal2-container");
                    if (x) {
                        x.style.zIndex = "10000";
                        clearInterval(intrId);
                    }
                }
            }, 500);

        }
    }
}


function startListener(url) {
    console.log("%cMean-titles : Listener is working... ", "color: red;");
    let callback = () => {
        // let url = location.href;
        if (url.includes("netflix") || url.includes("youtube")) {
            const video = document.querySelector("video:first-of-type");
            // .player-timedText
            if (video && !netflixInit) {
                netflixInit = true;
                video.onpause = function (e) {
                    getMeaning( url.includes("netflix") ? "netflix": "youtube", video)
                }
            }
        } else if (url.includes("primevideo")) {
            let elem = document.querySelector('[id^="videoContainer_"]');
            if (elem) {
                const video = elem.firstChild;
                if (video && !primeInit) {
                    primeInit = true;
                    video.onpause = function (e) {
                        getMeaning("primevideo", video)
                    }
                }
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


