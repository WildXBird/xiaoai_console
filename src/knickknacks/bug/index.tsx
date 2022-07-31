import { Progress } from 'antd';
import { PureComponent } from 'react';

type Props = {
    size?: number
}
type State = {
}

export class KK_Bug extends PureComponent<Props, State> {
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
                    className='KK_Bug'
                    style={{ width: "100%", height: "100%", textAlign: "center" }}>
                    123
                </div>
            </>
        );
    }

    async componentDidMount() {
        window.requestAnimationFrame(this.updateData.bind(this));

    }

    async updateData() {
        
        window.requestAnimationFrame(this.updateData.bind(this));


    }


}

