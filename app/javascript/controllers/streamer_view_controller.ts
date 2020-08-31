import {Controller} from "stimulus";

// import {ipcRenderer} from 'electron/renderer';
// eslint-disable-next-line @typescript-eslint/no-var-requires


export default class extends Controller {
    static targets = ["videoContainer", "debugCanvas"];
    readonly videoContainerTarget!: HTMLVideoElement;
    private debugCanvasTarget!: HTMLCanvasElement
    private streamKey: string;
    private debugCanvasContext: CanvasRenderingContext2D;
    private audioTrack: MediaStreamTrack;
    private mediaRecorder: MediaRecorder;
    private dataCount = 0;
    private ipcRenderer: any;

    connect(): void {
        const { ipcRenderer } = eval("require('electron')")
        this.ipcRenderer = ipcRenderer
        
        this.streamKey = this.data.get("stream-key");

        this.debugCanvasContext = this.debugCanvasTarget.getContext("2d")

        navigator.getUserMedia({audio: true, video: true}, (mediaStream) => {
            this.videoContainerTarget.srcObject = mediaStream
            this.audioTrack = mediaStream.getAudioTracks()[0]
            // mediaStream.removeTrack(this.audioTrack)
            this.videoContainerTarget.play()
            this.timerCallback()
            this.startStreaming()
        }, (error) => {
            console.error("Something went wrong", error)
        })

        ipcRenderer.on("browser-frame", (event, frame) => {
            const browserImg = new Image()
            browserImg.src = frame;
            console.log(browserImg.height, browserImg.width)
            this.debugCanvasContext.drawImage(
                browserImg,
                0,
                0,
                browserImg.width,
                browserImg.height,
                0,
                0,
                1200,
                748)
        })
    }

    private onStopped() {
        console.log("STOPPED");
    }

    startStreaming(): void {
        // Have to do this gross bit of code because typescript is convinced captureStream() doesn't exist
        const canvas = this.debugCanvasTarget as any
        const mediaStream = canvas.captureStream(60) as MediaStream
        mediaStream.addTrack(this.audioTrack)
        this.mediaRecorder = new MediaRecorder(mediaStream, {
            mimeType: 'video/webm',
            videoBitsPerSecond: 3000000
        });

        this.ipcRenderer.send("start", {streamKey: this.streamKey})

        this.mediaRecorder.addEventListener('dataavailable', async (e) => {
            const arrayBuffer = await e.data.arrayBuffer();
            this.ipcRenderer.send("stream", {payload: new Uint8Array(arrayBuffer)})
            console.log("Just sent data of size ", e.data.size, e.data.toString())
        });

        this.mediaRecorder.addEventListener('stop', () => {
            this.ipcRenderer.send("stop")
        });

        this.mediaRecorder.start(1000);
        // FlashPhoner.createSession({ urlServer: url })
        //     .on(SESSION_STATUS.ESTABLISHED, (session) => {
        //       //session connected, start streaming
        //       const mediaStream = this.debugCanvasTarget.captureStream(60) as MediaStream
        //       mediaStream.addTrack(this.audioTrack)
        //       session
        //           .createStream({
        //             name: this.streamKey,
        //             display: document.createElement("video"),
        //             constraints: {
        //               customStream: mediaStream
        //             },
        //             rtmpUrl: "rtmps://global-live.mux.com:443/app"
        //           })
        //           .on(STREAM_STATUS.PUBLISHING, (publishStream) => {
        //             console.log(publishStream);
        //           })
        //           .on(STREAM_STATUS.UNPUBLISHED, function () {
        //             // setStatus(STREAM_STATUS.UNPUBLISHED);
        //             // //enable start button
        //             // onStopped();
        //           })
        //           .on(STREAM_STATUS.FAILED, function (stream) {
        //             // setStatus(STREAM_STATUS.FAILED, stream);
        //             // //enable start button
        //             // onStopped();
        //           })
        //           .publish();
        //     })
        //     .on(SESSION_STATUS.DISCONNECTED, () => {
        //       this.onStopped();
        //     })
        //     .on(SESSION_STATUS.FAILED, () => {
        //       this.onStopped();
        //     });

    }

    timerCallback(): void {
        this.computeFrame();
        setTimeout(() => {
            this.timerCallback();
        }, 16); // roughly 60 frames per second
    }

    private computeFrame() {
        this.debugCanvasContext.drawImage(this.videoContainerTarget, 0, 784)
    }
}
