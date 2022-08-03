import { Progress } from 'antd';
import React from 'react';
import { PureComponent } from 'react';

type Props = {
    /**音频文件回调 */
    onRecorded: (blobUrl: string, fileB64: string) => void
    /**音频自动分段时间，单位秒 */
    splitTime?: number
}
type State = {
    recording?: boolean
}


/**监听器
 * 
 * 在回调中会返回音频文件的base64编码
 * 
 * 会根据设定值自动分割音频
 */
export class KK_Bug extends PureComponent<Props, State> {
    visualizerRef: React.RefObject<HTMLCanvasElement>;
    mediaRecorder?: MediaRecorder

    constructor(props: Props) {
        super(props);


        this.visualizerRef = React.createRef()

        this.state = {
        }
    }

    render() {
        return (
            <>
                <div
                    className='KK_Bug'
                    style={{ width: "100%", height: "100%", textAlign: "center" }}>
                    {/* <div ref={this.visualizerRef} className='visualizer'> */}
                    <canvas ref={this.visualizerRef} className="visualizer" height="60px"></canvas>
                    <div>{this.getRecordState()}</div>
                </div>
            </>
        );
    }

    getRecordState() {
        return this.mediaRecorder?.state || "unset"
    }
    async componentDidMount() {
        alert(`${window.innerHeight},${window.innerWidth}`)
        // window.requestAnimationFrame(this.updateData.bind(this));
        const MediaStream = await this.initMediaStream()
        this.setVisualizeFromStream(MediaStream)
        this.record(MediaStream)
    }



    async updateData() {
        // window.requestAnimationFrame(this.updateData.bind(this));
    }
    async initMediaStream() {
        if (!navigator.mediaDevices.getUserMedia) {
            alert('getUserMedia not supported on your browser!')
            throw 'getUserMedia not supported on your browser!'
        }
        alert("navigator")
        const constraints = { audio: true };
        const MediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        alert(typeof MediaStream)
        return MediaStream
    }

    async setVisualizeFromStream(stream: MediaStream) {
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);


        const draw = () => {
            const canvas = this.visualizerRef.current
            const canvasCtx = canvas?.getContext("2d");
            if (!canvas || !canvasCtx) {
                console.error("canvas or canvasCtx not ready", { canvas, canvasCtx })
                return
            }
            const WIDTH = canvas.width
            const HEIGHT = canvas.height;

            requestAnimationFrame(draw.bind(this));

            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = 'rgb(200, 200, 200)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

            canvasCtx.beginPath();

            let sliceWidth = WIDTH * 1.0 / bufferLength;
            let x = 0;


            for (let i = 0; i < bufferLength; i++) {

                let v = dataArray[i] / 128.0;
                let y = v * HEIGHT / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();

        }
        draw()
    }
    async record(stream: MediaStream) {
        let coder: string | undefined = undefined
        const coders = ["audio/ogg; codecs=opus", "audio/webm;codecs=opus"]
        for (let type of coders) {
            if (MediaRecorder.isTypeSupported(type)) {
                coder = type
                break
            }
        }
        if (!coder) {
            throw "没有支持的格式"
        }

        let chunks: Blob[] = [];
        this.mediaRecorder = new MediaRecorder(stream, {
            mimeType: coder,
            audioBitsPerSecond: 128000,
            // audioBitrateMode:"cbr"
        });
        console.log("this.mediaRecorder", this.mediaRecorder)
        this.mediaRecorder.start();
        console.log("recorder started");
        this.setState({ recording: true })

        this.mediaRecorder.ondataavailable = function (event) {
            console.log("ondataavailable1", chunks)

            chunks.push(event.data);

            console.log("ondataavailable2", chunks)

        }

        setTimeout(() => {
            this.mediaRecorder?.stop()
        }, 60_000);
        const recordStop = () => {
            this.setState({ recording: false })

            console.log("data available after MediaRecorder.stop() called.");
            console.log("recorder stopped");

            // const clipName = prompt('Enter a name for your sound clip?', 'My unnamed clip');



            // const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
            const blob = new Blob(chunks, { 'type': coder });
            chunks = [];
            const audioURL = URL.createObjectURL(blob);
            // URL.revokeObjectURL(audioURL)

            console.log({ audioURL })

            var reader = new FileReader();
            reader.onload = (e) => {
                console.log("b64", e.target)
                if (e.target) {
                    const b64 = String(e.target.result)
                    this.props.onRecorded(audioURL, b64)
                }



            }
            reader.readAsDataURL(blob);


        }
        this.mediaRecorder.onstop = recordStop
    }

}

