import { Progress } from 'antd';
import React from 'react';
import { PureComponent } from 'react';
import { KK_Time } from '../../knickknacks/time';
// import "./index.less"

type Props = {

}
type State = {
}


/**监听器
 * 
 * 在回调中会返回音频文件的base64编码
 * 
 * 会根据设定值自动分割音频
 */
export class MIUI extends PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <>
                <div
                onClick={()=>{
                    document.location.reload()
                }}
                    className='MIUI'
                    style={{
                        width: "100%",
                        height: "100%",
                        textAlign: "center"
                    }}>
                    <div className='MIUI-time' style={{
                        width: "100%",
                        height: "100%",
                        display: "flex"
                    }}>
                        <KK_Time size={56} miuiStyle />
                    </div>
                </div>
            </>
        );
    }



}

