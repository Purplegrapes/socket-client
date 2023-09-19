import React, { useState, useCallback } from 'react';
import { Space, Button, Progress, message, Alert } from 'antd';
import socketIO from 'socket.io-client';
import JSONInput from 'react-json-editor-ajrm';
import { v4 } from 'uuid';
import locale from 'react-json-editor-ajrm/locale/en';

let socket = null;

const ERROR = 'ERROR';
const PROGRESS = 'PROGRESS_TASK';

const defaultUrl = 'http://api4.betalpha.com:81/socket';
const defaultToken =
  'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDgzNTQ0NC0xZjY5LTRmNTEtYmZlMy02ZGQyNDJiZDdmZTgiLCJleHAiOjM2ODk4NDE4MTksImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiNWcxOHM5aVJtbFIyNDRXSE1sY2VoSmdESG0wIiwiY2xpZW50X2lkIjoib2ZmaWNpYWxfd2Vic2l0ZSIsInNjb3BlIjpbInJpc2tTeXN0ZW0iXX0.iLNVOa83FYsIywZ0mGEcxS-77X1lw_fN5O3onzNi_eRZ9RXN9MU1H9zWJvD-8TeYhOGVRCbxmEhNyYwxxKFRxdantl0gCyy70ZYLUOoJI3cqYA0dR3cNMgLxVIvAH1d51kb35W8P-AN9BNX-UmBxjlNBHB7Ladd_BvDVnGdBXq3sAY4IHaEKdf0T3kR9gVU2wsGmppN6PJlDsPqGkKTfuapjVS1odhNMydald3SAbjmWCjW6M36OdkMPAiFI9E69LvkYs6ZacBLKW_wVtkPHrZuuTEPoHs5hAUOi45Fp32U9V6RroNKQqUUU3GScRqBGKONhj2Kecm5p3fbqGrLtrA';

const App = () => {
  const [meta, setMeta] = useState({
    startEventName: 'START_FUND_DETAIL_TAG_FILTER',
    finishEventName: 'FINISH_FUND_DETAIL_TAG_FILTER',
    taskMeta: {
      meta: {},
      task: {
        dataSourceId: 'baef693e-bbee-4bb2-a4f5-66bc538d3c66',
        locale: 'zh',
        clientVersion: 'webapp',
        taskId: v4()
      },
      authorization: defaultToken
    }
  });
  const [authorizationMeta, setAuthorizationMeta] = useState({
    url: defaultUrl,
    startEventName: 'AUTHORIZATION',
    socketPath: '/socket',
    taskMeta: {
      task: {
        dataSourceId: 'baef693e-bbee-4bb2-a4f5-66bc538d3c66',
        locale: 'zh',
        clientVersion: 'webapp',
        taskId: v4()
      },
      authorization: defaultToken
    }
  });
  const [result, setResult] = useState({});
  const connect = useCallback(() => {
    if (authorizationMeta) {
      socket = socketIO(authorizationMeta.url, {
        transports: ['polling', 'websocket'],
        path: authorizationMeta.socketPath
      });
      socket.connect(() => {
        console.log(socket.id);
      });
      socket.on(ERROR, (response) => {
        console.log(response);
        setResult({
          progress: -1,
          message: response?.fieldError.message
        });
      });
      socket.on('connect_error', (error) => {
        console.log(error); // true
      });
      socket.emit(authorizationMeta.startEventName, authorizationMeta.taskMeta, (response) => {
        console.log(response.status); // ok
        message.success('鉴权成功');
      });
    } else {
      message.warning('请输入鉴权信息');
    }
  }, [authorizationMeta]);

  const onFinish = useCallback(() => {
    if (socket && socket.connected) {
      setResult({});
      socket.emit(meta.startEventName, meta.taskMeta, (response) => {
        console.log(response.status); // ok
      });
      socket.on(meta?.finishEventName, (response) => {
        console.log(response);
        setResult({
          progress: 1,
          data: response
        });
      });
      socket.on(PROGRESS, (response) => {
        console.log(response);
        setResult({
          progress: response.progress
        });
      });
    } else {
      message.info('请先连接socket');
    }
  }, [meta]);
  return (
    <div style={{ padding: '10px 20px' }}>
      <h5>SOCKET--CLIENT</h5>
      authorizationMeta:
      <JSONInput
        id="authorization"
        locale={locale}
        placeholder={authorizationMeta}
        onBlur={(obj) => {
          if (obj.error) {
            console.log('ERROR: ', obj.error);
          } else {
            console.log(obj.plainText);
            setAuthorizationMeta(obj.jsObject);
          }
        }}
        colors={{
          default: '#1E1E1E',
          background: '#ffffff',
          string: '#ce8453',
          number: '#ce8453',
          keys: '#386fa4',
          background_warning: '#ffffff'
        }}
        style={{
          outerBox: { border: '10px solid green' },
          width: '100%'
        }}
        onChange={(obj) => {
          if (obj.error) {
            console.log('ERROR: ', obj.error);
          } else {
            console.log(obj.plainText);
          }
        }}
        height="250px"
        width="800px"
      />
      <Button type="primary" onClick={connect} style={{ margin: 20 }}>
        连接
      </Button>
      <div>taskMeta:</div>
      <JSONInput
        id="a_unique_id"
        locale={locale}
        placeholder={meta}
        onBlur={(obj) => {
          if (obj.error) {
            console.log('ERROR: ', obj.error);
          } else {
            console.log(obj.plainText);
            setMeta(obj.jsObject);
          }
        }}
        colors={{
          default: '#1E1E1E',
          background: '#ffffff',
          string: '#ce8453',
          number: '#ce8453',
          keys: '#386fa4',
          background_warning: '#ffffff'
        }}
        style={{
          outerBox: { border: '10px solid green' }
        }}
        onChange={(obj) => {
          if (obj.error) {
            console.log('ERROR: ', obj.error);
          } else {
            console.log(obj.plainText);
          }
        }}
        height="250px"
        width="800px"
      />
      <Space style={{ margin: 20 }}>
        <Button type="primary" onClick={onFinish}>
          发送消息
        </Button>

        <Button onClick={() => setMeta({})}>清除meta</Button>
      </Space>
      {result?.progress === -1 && <Alert message="Error" description={result.message} type="error" showIcon />}
      {result?.progress && result?.progress !== 1 && <Progress percent={result?.progress * 100} />}
      {result?.progress === 1 && (
        <JSONInput
          id="output"
          confirmGood={false}
          placeholder={result?.data} // data to display
          theme="light_mitsuketa_tribute"
          locale={locale}
          viewOnly
          colors={{
            string: 'green' // overrides theme colors with whatever color value you want
          }}
          height="550px"
          width="800px"
        />
      )}
    </div>
  );
};
export default App;
