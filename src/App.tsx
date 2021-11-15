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
  async componentDidMount() {

    this.startBackgroundFetching()

    setInterval(() => {
      this.setState({ ts: performance.now() })
    }, 100);
  }

  async startBackgroundFetching() {
    try {
      if (new Date().valueOf() > this.state.nextFetchTime) {
        await this.fetchNotification()
        this.setState({
          nextFetchTime: new Date().valueOf() + 10 * 1000
        })
      } else {
      }
    } catch (error) {
      message.error('网络异常');
    }

    setTimeout(() => {
      this.startBackgroundFetching()
    }, 3000);
  }

  newMessage() {
    message.info('有新消息');
  }

  async fetchNotification() {
    // message.info('fetchNotification');

    NProgress.start()
    const githubNotifications = await GetGithubNotifications()
    const newNotifications = [...githubNotifications]
    NProgress.done()

    let notied = false
    for (let item of newNotifications) {
      let thisHit = false
      for (let oldItem of this.state.notifications) {
        if (item.id === oldItem.id) {
          thisHit = true
        }
      }
      if (!thisHit) {
        if (!notied) {
          this.newMessage()
          notied = true
        }
      }
    }
    this.setState({
      notifications: newNotifications
    })
    this.forceUpdate()
  }

  async removeNotification(id: string) {
    let loacalRemoved = this.getLocalRemoved()
    loacalRemoved.add(id)
    localStorage.setItem("removed", JSON.stringify([...loacalRemoved]))
    this.forceUpdate()
  }
  getLocalRemoved(): Set<string> {
    let loacalRemoved: Set<string> = new Set<string>()

    try {
      let removed = localStorage.getItem("removed")
      loacalRemoved = new Set<string>(JSON.parse(String(removed)))
    } catch (error) {
      localStorage.setItem("removed", "[]")
      loacalRemoved = new Set<string>()
    }

    return new Set(loacalRemoved)
  }
  render() {
    let loacalRemoved = this.getLocalRemoved()
    let displayed = 0

    return (
      <>
        <div style={{ width: "100%", height: "100%", verticalAlign: "top", background: "#cfcfcf", overflow: "scroll",paddingTop:10 }}>

          <div style={{ width: "100%", height: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 24 }}>
              {new Date().toLocaleString()}
            </span>
            {/* <span>
              {new Date().valueOf()}
            </span> */}

          </div>
          <div style={{ width: "100%", height: "calc(100% - 50px)", }}>
            {Array.from(this.state.notifications, (item, aid) => {
              if (loacalRemoved.has(item.id)) {
                return
              }
              displayed++
              return <div key={`${item.id}-${aid}`} style={{ width: "100%", overflowX: "scroll" }} onScroll={async (event) => {
                const target = event.target as HTMLDivElement
                console.log(target.scrollLeft)
                if (target.scrollLeft > window.innerWidth && !this.removed[item.id]) {
                  this.removed[item.id] = true
                  await this.removeNotification(item.id)
                }
              }}>
                <div style={{ width: "400%" }}>
                  <div style={{ width: "25%", padding: 16, paddingTop: 0 }}>
                    <Card loading={false} style={{ position: "relative", borderRadius: 15 }} onClick={async () => {
                      await OpenLink(item.url.href)
                      await this.removeNotification(item.id)
                    }}>
                      <Card.Meta
                        avatar={<Avatar src={item.picture instanceof URL ? item.picture.href : null} />}
                        title={item.title}
                        description={item.summary}
                      />
                      <div style={{ position: "absolute", right: 10, top: 5, fontSize: 12, fontWeight: 400 }}>
                        {/* {"五分钟"} */}
                        {`${item.id}-${aid}`}
                      </div>
                    </Card>

                  </div>
                </div>
              </div>
            })}
            {(() => {
              if (displayed == 0) {
                return <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => { }}>
                  <Spin tip="Loading..." spinning={this.state.loading}>
                    <Empty />
                  </Spin>
                </div>
              }
            })()}
          </div>
        </div>
      </>
    );

  }
}


export default ControlPanel;
