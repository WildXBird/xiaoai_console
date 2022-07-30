import { PureComponent } from 'react';

type Props = {
    size?: number
}
type State = {
    date?: string
    time?: string
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
        return (
            <>
                <div 
               className='KK_Time'
               style={{
                     width: "100%", 
                     height: "100%", 
                     textAlign: "center" ,
                     border: "1px red solid"
                     }}>

                    <div style={{ fontSize: baseSize }}>


                        {this.state.time}
                       <span  style={{ fontSize: baseSize / 2 }}>
                       {this.state.ms}
                       </span>



                    </div>
                    <div style={{ fontSize: baseSize / 1.5 }}>


                        {this.state.date}



                    </div>
                </div>
            </>
        );

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

        const TIME = new Date().toLocaleTimeString()
        const timeString = `${TIME}`

        const msTIME = new Date().getMilliseconds()
        const msString = `${msTIME}`.padStart(3, '0')


        this.setState({
            date: dateString,
            time: timeString,
            ms: msString,
        })
        window.requestAnimationFrame(this.updateTime.bind(this));


    }


}

