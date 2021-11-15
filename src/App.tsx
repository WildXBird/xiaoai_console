import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { Card, Space } from 'antd';
import { Table, DatePicker, Input, Typography } from 'antd';
import { Form, Button, Checkbox } from 'antd';
import { Drawer } from 'antd';
import { ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Notification } from './unit/type';
import { GetGithubNotifications } from './unit/github';


type State = {
  notifications: Notification[]
}

class ControlPanel extends PureComponent<any, State> {
  cmdContainerRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.cmdContainerRef = React.createRef<HTMLDivElement>()
    this.state = {
      notifications: [],
    }
  }
  async componentDidMount() {
  const GN =   await GetGithubNotifications()
console.log("GN",GN)
  }
  render() {
    return (
      <>
        <div style={{ display: "inline-block", width: "50%", height: "100%", verticalAlign: "top" }}>
          {Array.from(this.state.notifications, (item, id) => {
            // if (item === linend) {
            //   return <div key={id} style={{ background: "cadetblue" }}>{item}</div>
            // } else if (item.startsWith("!h97fvHRdf:")) {
            //   return <div key={id} style={{ fontWeight: 600 }}>{item.replace("!h97fvHRdf:", "")}<br /></div>
            // }
            return <div key={id}>{item}</div>
          })}
        </div>
      </>
    );

  }
}


export default ControlPanel;
