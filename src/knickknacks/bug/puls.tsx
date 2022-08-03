import { message } from "antd";
import { PureComponent, ReactNode } from "react";

export class KK_Bug_DCloud extends PureComponent<{}, {}> {
    recorder: PlusAudioAudioRecorder | undefined;

    constructor() {
        super({})
        //@ts-ignore 
        if (global.plus) {
            this.recorder = plus.audio.getRecorder()
            this.reader = plus.io.FileReader
        }

        // this.recorder = plus.audio.AudioRecorder
    }
    render() {
        return <div>weee</div>;
    }
    componentDidMount() {
        this.start()
    }
    start() {
        if (this.recorder) {
            this.recorder.record({
                format: "amr"
            },
                (event) => {
                    console.log("successCB", event)
                    message.info("done:" + event, 500)
                })
        } else {
            message.error("recoder Err," + typeof this.recorder, 5)
            message.error(Object.keys(plus.audio), 50000)
            console.log("plus!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", plus.audio)
            console.error(plus)
        }

        setTimeout(() => {
            this.recorder?.stop()
        }, 5000);
    }

    uploadFile(fileLocation: string) {
        if (plus && plus.io.FileReader) {
            const task = plus.uploader.createUpload("url", {
                retry: 10,
                retryInterval: 30,
                timeout: 30,
            }, (completedCB) => {

            })
            task.addFile(fileLocation, { key: `file-${new Date().toISOString()}` });
            task.addData("string_key", "string_value");
            //task.addEventListener( "statechanged", onStateChanged, false );
            task.start();
        }

    }
    componentWillUnmount() {
        if (this.recorder) {
            this.recorder.stop()
        }
    }
} 