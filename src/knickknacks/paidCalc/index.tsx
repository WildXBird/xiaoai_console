import { Progress } from 'antd';
import { PureComponent } from 'react';

type Props = {
    size?: number
    salaryInK: number
    /**上班开始时间，传入任何一天的时间都可以，因为只会读取小时(分钟)时间 */
    inDutyTime: Date
    /**下班时间，传入任何一天的时间都可以，因为只会读取小时(分钟)时间 */
    offDutyTime: Date
}
type State = {
    已工作时间比例?: number
    已赚工资?: string
    加班?: boolean
}

export class KK_PaidCalc extends PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }

    render() {

        return (
            <>
                <div
                    className='KK_PaidCalc'
                    style={{ width: "100%", height: "100%", textAlign: "center", }}>
                    <Progress
                        size="small"
                        type="circle"
                        percent={(this.state.已工作时间比例 || 0) * 100}
                        status={this.state.加班 ? "exception" : "success"}
                        format={() => {
                            if (this.state.加班) {
                                if (this.state.已工作时间比例) {
                                    return `${((this.state.已工作时间比例 * 100) - 100).toFixed(2)}%`
                                } else {
                                    return "!"
                                }
                            }
                            return this.state.已赚工资
                        }}
                    />
                </div>
            </>
        );
    }
    async componentDidMount() {
        window.requestAnimationFrame(this.updateData.bind(this));
    }
    /**是否是周末时间 */
    isWeekend(time: Date) {
        const week = new Date(time).toLocaleDateString('zh-CN', { weekday: 'short' })
        switch (week) {
            case "周日":
            case "周六":
                return true
            default:
                break;
        }
        return false
    }

    getMoneyData(工作时间比例: number) {
        const 工资 = this.props.salaryInK * 1000
        const 单日工资 = 工资 / 4 / 5
        const 已赚工资 = 单日工资 * 工作时间比例

        const data = {
            单日工资: 单日工资.toFixed(2),
            已赚工资: 已赚工资.toFixed(3),
        }

        return data
    }
    getTimes() {
        let result = {
            已工作时间比例: 0,
            加班: true,
        }
        // const now = new Date(new Date().valueOf() - 1000 * 60 * 60 * (0 + 12))
        const now = new Date()
        const isWeekend = this.isWeekend(now)
        if (isWeekend) {
            return result
        }


        const 开始工作时间 = this.props.inDutyTime
        this.props.inDutyTime.setDate(now.getDate())
        this.props.inDutyTime.setMonth(now.getMonth())

        const 结束工作时间 = this.props.offDutyTime
        this.props.offDutyTime.setDate(now.getDate())
        this.props.offDutyTime.setMonth(now.getMonth())

        const 总工作时间 = 结束工作时间.valueOf() - 开始工作时间.valueOf()

        let 未到上班时间 = false
        let 已工作时间 = now.valueOf() - 开始工作时间.valueOf()
        if (已工作时间 <= 0) {
            未到上班时间 = true
            已工作时间 = 0
        }



        let 加班 = false
        if (已工作时间 > 总工作时间 || isWeekend) {
            加班 = true
        }



        let 已工作时间比例 = 已工作时间 / 总工作时间


        const startTimeFix = 开始工作时间.toISOString()


        const data = {
            inDutyTime: 开始工作时间,
            offDutyTime: 结束工作时间,
            startTimeFix,
            isWeekend,
            开始工作时间,
            结束工作时间,
            总工作时间,
            已工作时间,
            未到上班时间,
            加班,
            已工作时间比例,
        }


        result = {
            加班,
            已工作时间比例,
        }
        return result
    }


    async updateData() {
        const times = this.getTimes()
        const money = this.getMoneyData(times.已工作时间比例)

        this.setState({
            已工作时间比例: times.已工作时间比例,
            已赚工资: money.已赚工资,
            加班: times.加班
        })
        window.requestAnimationFrame(this.updateData.bind(this));


    }


}

