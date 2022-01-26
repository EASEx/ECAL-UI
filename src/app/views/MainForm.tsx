import React from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useSetRecoilState } from "recoil";
import { ROUTE, URLS } from "../store";

const MainForm = () => {
  const setURLs = useSetRecoilState(URLS);
  const setRoute = useSetRecoilState(ROUTE);
  const onFinish = async (values: any) => {
    window.ipcAPI.invoke.submitURLs(values.serverURL, values.nbURL).then(() => {
      setURLs({
        serverURL: values.serverURL,
        nbURL: values.nbURL,
      });
      setRoute("/bot");
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label="Notebook URL"
        name="nbURL"
        rules={[{ required: true, message: "Please input the notebook url" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Server URL"
        name="serverURL"
        rules={[{ required: true, message: "Please input the server url" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MainForm;
