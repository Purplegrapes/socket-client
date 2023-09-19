import React, { useState, useCallback } from 'react';
import { Input, Space, Form, Button, Progress, message, Alert } from 'antd';
import socketIO from "socket.io-client";
import JSONInput from 'react-json-editor-ajrm';
import { v4 } from 'uuid'
import locale from "react-json-editor-ajrm/locale/en";
import style from './App.css';

let socket = null;

const ERROR = 'ERROR';
const PROGRESS = 'PROGRESS_TASK';

const App = () => {

  const [form] = Form.useForm();
  const [meta, setMeta] = useState({});
  
  const initialValues = ({
    url: "http://api4.betalpha.com:81/socket",
    startEventName: 'START_FUND_DETAIL_TAG_FILTER',
    finishEventName: 'FINISH_FUND_DETAIL_TAG_FILTER',
    token: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDgzNTQ0NC0xZjY5LTRmNTEtYmZlMy02ZGQyNDJiZDdmZTgiLCJleHAiOjM2ODk4NDE4MTksImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiNWcxOHM5aVJtbFIyNDRXSE1sY2VoSmdESG0wIiwiY2xpZW50X2lkIjoib2ZmaWNpYWxfd2Vic2l0ZSIsInNjb3BlIjpbInJpc2tTeXN0ZW0iXX0.iLNVOa83FYsIywZ0mGEcxS-77X1lw_fN5O3onzNi_eRZ9RXN9MU1H9zWJvD-8TeYhOGVRCbxmEhNyYwxxKFRxdantl0gCyy70ZYLUOoJI3cqYA0dR3cNMgLxVIvAH1d51kb35W8P-AN9BNX-UmBxjlNBHB7Ladd_BvDVnGdBXq3sAY4IHaEKdf0T3kR9gVU2wsGmppN6PJlDsPqGkKTfuapjVS1odhNMydald3SAbjmWCjW6M36OdkMPAiFI9E69LvkYs6ZacBLKW_wVtkPHrZuuTEPoHs5hAUOi45Fp32U9V6RroNKQqUUU3GScRqBGKONhj2Kecm5p3fbqGrLtrA',
  })
  const [result, setResult] = useState({});
  const connect = useCallback (() => {
    console.log(form.getFieldsValue())
    const formValues = form.getFieldsValue();
    if (formValues.url && formValues.token) {
      socket = socketIO(formValues.url,{
        transports: ["polling", "websocket"],
        path: '/socket'
      });
      socket.connect(() => {
        console.log(socket.id)
      })
      socket.on(ERROR, (response) => {
        console.log(response)
        setResult({
          progress: -1,
          message: response?.fieldError.message
        })
      })
      socket.on("connect_error", (error) => {
        console.log(error); // true
      });
      socket.emit('AUTHORIZATION', ({
        task: {
          locale: "zh",
          clientVersion: "webapp",
        },
        authorization: formValues.token
       }), (response) => {
        console.log(response.status); // ok
        message.success('鉴权成功')
      });
    } else {
      message.warning('请输入鉴权信息')
    }
  }, [form]);

  const onFinish = useCallback((values) => {
    if (socket && socket.connected) {
      setResult({});
      socket.emit(values.startEventName, ({
         meta,
        "task": {
          "name": "",
          "dataSourceId": "baef693e-bbee-4bb2-a4f5-66bc538d3c66",
          "locale": "zh",
          "clientVersion": "webapp",
          "traceId": "7e9e4e3d-6452-42f8-9c34-be824b8f7bca-1693293342858",
          taskId: v4(),
        },
        "authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDgzNTQ0NC0xZjY5LTRmNTEtYmZlMy02ZGQyNDJiZDdmZTgiLCJleHAiOjM2ODk4NDE4MTksImF1dGhvcml0aWVzIjpbIlVTRVIiXSwianRpIjoiNWcxOHM5aVJtbFIyNDRXSE1sY2VoSmdESG0wIiwiY2xpZW50X2lkIjoib2ZmaWNpYWxfd2Vic2l0ZSIsInNjb3BlIjpbInJpc2tTeXN0ZW0iXX0.iLNVOa83FYsIywZ0mGEcxS-77X1lw_fN5O3onzNi_eRZ9RXN9MU1H9zWJvD-8TeYhOGVRCbxmEhNyYwxxKFRxdantl0gCyy70ZYLUOoJI3cqYA0dR3cNMgLxVIvAH1d51kb35W8P-AN9BNX-UmBxjlNBHB7Ladd_BvDVnGdBXq3sAY4IHaEKdf0T3kR9gVU2wsGmppN6PJlDsPqGkKTfuapjVS1odhNMydald3SAbjmWCjW6M36OdkMPAiFI9E69LvkYs6ZacBLKW_wVtkPHrZuuTEPoHs5hAUOi45Fp32U9V6RroNKQqUUU3GScRqBGKONhj2Kecm5p3fbqGrLtrA"
       }), (response) => {
        console.log(response.status); // ok
      })
      socket.on(values?.finishEventName, (response) => {
        console.log(response)
        setResult({
          progress: 1,
          data: response.view
        })
      })
      socket.on(PROGRESS, (response) => {
        console.log(response)
        setResult({
          progress: response.progress,
        })
      })
    } else {
      message.info("请先连接socket")
    }
  }, [meta]);
  return (
    <div className={style.Container}>
      <Form
      onFinish={onFinish}
      initialValues={initialValues}
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
    >
      <Form.Item  {...{ wrapperCol: { span: 14, offset: 8 } }}>
        <h5>
          SOCKET测试
        </h5>
      </Form.Item>
      <Form.Item label="socketUrl" name="url">
        <Input style={{ width: 500 }} />
      </Form.Item>
      <Form.Item label="TOKEN" name="token">
        <Input.TextArea rows={3} style={{ width: 500 }} />
      </Form.Item>
      <Form.Item  {...{ wrapperCol: { span: 14, offset: 6 } }}>
      <Button type="primary" onClick={connect}>
          连接
        </Button>
      </Form.Item>
      <Form.Item label="startEventName" name="startEventName">
        <Input style={{ width: 500 }} />
      </Form.Item>
      <Form.Item label="finishEventName" name="finishEventName">
      <Input style={{ width: 500 }} />
      </Form.Item>
      <Form.Item label="taskMeta">
      <JSONInput
        id="a_unique_id"
        locale={locale}
        placeholder={meta}
        onBlur={(obj) => {
          if (obj.error) {
            console.log('ERROR: ', obj.error);
          } else {
            console.log(obj.plainText);
            setMeta(obj.jsObject)
          }
        }}
        colors={{
          default: '#1E1E1E',
          background: '#ffffff',
          string: '#ce8453',
          number: '#ce8453',
          keys: '#386fa4',
          background_warning: '#ffffff',
        }}
        style={{
          outerBox: { border: '10px solid green' },
        }}
        onChange={(obj) => {
          if (obj.error) {
            console.log('ERROR: ', obj.error);
          } else {
            console.log(obj.plainText);
          }
        }}
       height="250px"
      />
      </Form.Item>
      <Form.Item>
      <Form.Item  {...{ wrapperCol: { span: 14, offset: 8 } }}>
      <Space>

        <Button type="primary" htmlType="submit">
          发送消息
        </Button>
        <Button onClick={() => setMeta({})}>清除meta</Button>
      </Space>
      </Form.Item>

    </Form.Item>
    </Form>

    {result?.progress === -1 && (
       <Alert
       message="Error"
       description={result.message}
       type="error"
       showIcon
     />
    )}

    {result?.progress  && result?.progress !== 1 && <Progress percent={result?.progress * 100} />}
      {result?.progress === 1 && (
        <JSONInput
        id="output"
        confirmGood={false}
        placeholder={result?.data} // data to display
        theme="light_mitsuketa_tribute"
        locale={locale}
        viewOnly
        colors={{
          string: "green" // overrides theme colors with whatever color value you want
        }}
        height="550px"
        width="100%"
       />
      )}
    </div>
  )
};
export default App;