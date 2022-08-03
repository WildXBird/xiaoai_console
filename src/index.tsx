import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import zhCN from 'antd/lib/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { a } from '@dcloudio/types';



const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );


}
const plusReady = () => {
  plus.navigator.hideSystemNavigation();
  plus.screen.lockOrientation("landscape-primary");


}
if (localStorage.noPlus) {
  render()
} else {
  //@ts-ignore
  if (window.plus) {
    plusReady();
    document.addEventListener("resume", function () {
      plusReady()
    }, false);

    render()
  } else {
    document.addEventListener('plusready', plusReady, false);
  }
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
