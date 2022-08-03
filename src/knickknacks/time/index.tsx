import { PureComponent, ReactNode } from 'react';
import { KK_Bug_DCloud } from '../bug/puls';
import { KK_PaidCalc } from '../paidCalc';

type Props = {
    size?: number
    miuiStyle?: boolean
}
type State = {
    date?: string
    time?: string
    sec?: string
    noon?: string
    ms?: string
}

export class KK_Time extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const baseSize = this.props.size || 24
        return <div
            className='KK_Time miuiStyle'
            style={{
                width: "100%",
                height: "100%",
                textAlign: "center",
                position: "relative"
            }}>
            <div className='time' style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute"
            }}>
                <div style={{ fontSize: 150, fontWeight: 900, position: "relative", top: "-4vh" }}>

                    {(() => {
                        const timeSplit = this.state.time?.split(":")
                        const showSplit = Number((this.state.sec?.split("").pop() || "0")) % 2 === 0

                        return <>
                            {/* <LCDDigital number={4} /> */}
                            {timeSplit?.shift()}
                            <span style={{ width: 64, display: "inline-block", opacity: showSplit ? 0.1 : 1 }}>{":"}</span>
                            {timeSplit?.pop()}
                        </>
                    })()}
                    <div style={{ fontSize: 28, lineHeight: `${28}px`, display: "inline-block", fontWeight: 900 }}>
                        <div style={{}}>
                            {this.state.noon}
                        </div>
                        <div style={{ fontWeight: 600 }}>
                            {this.state.sec}
                        </div>
                    </div>
                </div>
            </div>
            <div className='date' style={{
                fontSize: 36,
                position: "absolute",
                bottom: 20,
                width: "100%",
                textAlign: "center",

            }}>
                {this.state.date}
            </div>
            <div className='paid' style={{
                fontSize: 36,
                position: "absolute",
                top: 18,
                left: 20,
                transform: `scale(0.5)`, transformOrigin: "left top"

            }}>
                <KK_PaidCalc
                    salaryInK={12}
                    inDutyTime={new Date("2022-01-01T09:00:00+08:00")}
                    offDutyTime={new Date("2022-01-01T18:00:00+08:00")} />
            </div>
            <div className='paid' style={{
                fontSize: 36,
                position: "absolute",
                top: 18,
                left: 20,
                transform: `scale(0.5)`, transformOrigin: "left top"
            }}>
                <KK_Bug_DCloud />
            </div>
        </div>

    }
    async componentDidMount() {
        window.requestAnimationFrame(this.updateTime.bind(this));

    }

    async updateTime() {
        const DATE = new Date().toLocaleDateString('zh-CN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        const dateString = `${DATE}`

        const TIME = new Date().toLocaleTimeString('zh-CN', { hour12: true, "hour": "numeric", minute: "numeric" })
        const noonString = `${TIME.substring(0, 2)}`
        const timeString = `${TIME.substring(2)}`
        const secTIME = new Date().toLocaleTimeString('zh-CN', { hour12: true, second: "numeric" })

        const secString = `${secTIME}`

        const msTIME = new Date().getMilliseconds()
        const msString = `${msTIME}`.padEnd(3, '0')


        this.setState({
            date: dateString,
            noon: noonString,
            time: timeString,
            sec: secString,
            ms: msString,
        })
        window.requestAnimationFrame(this.updateTime.bind(this));


    }


}



type LCDDigitalProps = {
    number: number
}
class LCDDigital extends PureComponent<LCDDigitalProps, {}> {
    render(): ReactNode {
        return <div style={{ display: "inline-block", position: "relative" }}>
            {Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], (value) => {
                return <div style={{ width: "100%", height: "100%", position: "absolute", opacity: 0.03 }}>
                    {value}
                </div>
            })}
            {this.props.number}
        </div>
    }
}