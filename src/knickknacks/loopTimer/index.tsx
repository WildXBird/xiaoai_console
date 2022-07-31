import { PureComponent } from 'react';

type Props = {
    size?: number
    seconds?: number
}
type State = {
    past: number
    startTime: Date
}

export class KK_LoopTimer extends PureComponent<Props, State> {
    startTime: Date;
    constructor(props: Props) {
        super(props);
        this.startTime = new Date()
        this.state = {
            past: 0,
            startTime: new Date()
        }
    }

    render() {
        const setting = (this.props.seconds || 60) * 1000
        const baseSize = this.props.size || 24


        let reached = false
        let color = "unset"
        let backgroundColor = "unset"
        let time = (this.state.past / 1000)

        if (this.state.past > setting) {
            reached = true
            time = (this.state.past - setting) / 1000
            if (time <= 1) {
                color = "white"
                backgroundColor = "red"
            } else {
                const times = (new Date().valueOf() / 1000).toFixed(0)
                const timesLastLetter = times.substring(times.length - 1)
                color = (Number(timesLastLetter) % 2) === 0 ? "red" : "white"
                backgroundColor = (Number(timesLastLetter) % 2) === 0 ? "white" : "red"

            }
        }

        const secDisplay = String(time).split(".").shift()
        const msDisplay = (String(time).split(".").pop() || "").substring(0,2).padEnd(2, '0')



        return (
            <>
                <div
                    className='KK_LoopTimer'
                    style={{
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        border: "1px red solid",
                        cursor: "pointer"
                    }}
                    onClick={this.resetTimer.bind(this)}>

                    <div style={{ fontSize: baseSize, color, backgroundColor }}>
                        {secDisplay}
                        <span style={{ fontSize: baseSize / 2 }}>
                            {msDisplay}
                        </span>
                    </div>
                    <div style={{ fontSize: baseSize / 1.5 }}>


                        {/* {this.state.date} */}



                    </div>
                </div>
            </>
        );

    }
    async componentDidMount() {
        window.requestAnimationFrame(this.updateTime.bind(this));

    }

    async updateTime() {
        const past = new Date().valueOf() - this.state.startTime.valueOf()


        this.setState({
            past: past,
        })
        window.requestAnimationFrame(this.updateTime.bind(this));


    }

    async resetTimer() {
        this.setState({
            startTime: new Date()
        })

    }


}

