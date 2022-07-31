import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { Card, Avatar } from 'antd';
import { Table, DatePicker, Input, Typography } from 'antd';
import { message, Button, Spin } from 'antd';
import { Drawer } from 'antd';
import { ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import * as NProgress from 'nprogress';
import { Notification } from './unit/type';
import { OpenLink } from './unit/pc';
import { GetGithubNotifications } from './unit/github';
import { Empty } from 'antd';
import { setInterval } from 'timers';
import "./App";
import { KK_Time } from './knickknacks/time';
import { KK_PaidCalc } from './knickknacks/paidCalc';
import { KK_LoopTimer } from './knickknacks/loopTimer';
import { KK_Bug } from './knickknacks/bug';


type State = {
  notifications: Notification[]
  loading: boolean
  ts: number
  nextFetchTime: number
}

class ControlPanel extends PureComponent<any, State> {
  cmdContainerRef: React.RefObject<HTMLDivElement>;
  removed: {
    [id: string]: boolean
  };
  constructor(props: any) {
    super(props);
    this.cmdContainerRef = React.createRef<HTMLDivElement>()
    this.removed = {}
    this.state = {
      notifications: [],
      loading: false,
      ts: 0,
      nextFetchTime: 0,
    }
  }

  render() {
    return (
      <>
        <div style={{ width: "100%", height: "100%", verticalAlign: "top", background: "#cfcfcf", overflow: "scroll", paddingTop: 10 }}>
          <Row>
            <Col span={18}>
              <KK_Time size={36} />
            </Col>
            <Col span={6}>
              <KK_PaidCalc
                salaryInK={12}
                inDutyTime={new Date("2022-01-01T09:00:00+08:00")}
                offDutyTime={new Date("2022-01-01T18:00:00+08:00")}
              />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <KK_LoopTimer seconds={60} size={36} />
            </Col>
            <Col span={12}>
              <KK_Bug  onRecorded={(base64)=>{
                console.log(base64)
                window.open(base64)
              }}  />
            </Col>
          </Row>


        </div>
      </>
    );

  }
  async componentDidMount() { }

}


export default ControlPanel;
