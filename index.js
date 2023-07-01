const searchInput = document.getElementById('searchInput');
const apiKey = "AIzaSyASs00yBusrpDZAZKFRu9Zwu60LI7qnJJ8";
const container = document.getElementById("container");
function searchVideos(){
    let searchValue = searchInput.value;

    fetchVideos(searchValue);
}

async function fetchVideos(searchValue){
    let endpoint = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchValue}&maxResults=16&key=${apiKey}`
    
    try{
        let response = await fetch(endpoint);
        let result = await response.json();
        for(let x=0;x<result.items.length;x++){
            let video = result.items[x];
            let videoStats = await fetchStats(video.id.videoId)
            if(videoStats.items.length > 0)
              result.items[x].videoStats = videoStats.items[0].statistics
        }
        // console.log(result);
        showThumbnails(result.items);
    }
    catch(error){
        console.log(error);
    }
}

function showThumbnails(items){
    for(let x=0;x<items.length;x++){
        let videoItem = items[x];
        let imageUrl = videoItem.snippet.thumbnails.high.url;
        let videoElement = document.createElement("div");
        const videoChildren = `
        <img src="${imageUrl}">
        <p class="title">${videoItem.snippet.title}</p>
        <p class="channel-title">${videoItem.snippet.channelTitle}</p>
        <p class="view-count">${videoItem.videoStats ? getViews(videoItem.videoStats.viewCount) + " Views": ""}</p>`
        videoElement.addEventListener("click", () => {
            navigateToVideo(videoItem.id.videoId);
        } )
        videoElement.innerHTML = videoChildren;
        container.append(videoElement);
    }
}

async function fetchStats(videoId){
  const endpoint = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;

    let response = await fetch(endpoint);
    let result = response.json();
    return result;
}

function getViews(n){
    if(n<1000) return n;
    else if(n>=1000 && n<=999999){
        n  /= 1000;
        n = parseInt(n);
        return n + "K";
    }
    return parseInt(n / 1000000) + "M";
}







function navigateToVideo(videoId){
    let path = `./index2.js`;
    if(videoId){
    document.cookie = `video_id=${videoId}; path=${path}`;
     let linkItem = document.createElement("a");
     linkItem.href = "http://127.0.0.1:5500/index2.html";
     linkItem.target = "_blank";
     linkItem.click();
    }
    else{
        alert("Go and watch video in youtube");
    }
}
