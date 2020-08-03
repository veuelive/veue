import hls from 'hls.js';

window.document.onload(() => {
    // Replace with your asset's playback ID
    var playbackId = "YOUR_PLAYBACK_ID";
    var url = "https://stream.mux.com/" + playbackId + ".m3u8";
    var video = document.getElementById("myVideo");

    // Let native HLS support handle it if possible
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
    } else if (Hls.isSupported()) {
        // HLS.js-specific setup code
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
    }
})
