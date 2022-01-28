import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Modal } from "antd";
import { useSetRecoilState, useRecoilState } from "recoil";
import { ROUTE, URLS } from "../store";
import axios, { AxiosResponse } from "axios";

const MainForm = () => {
  const [urls, setURLs] = useRecoilState(URLS);
  const setRoute = useSetRecoilState(ROUTE);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    window.ipcAPI.invoke.submitURLs(urls.serverURL, urls.nbURL).then(() => {
      setRoute("/bot");
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values: any) => {
    setURLs({
      serverURL: values.serverURL,
      nbURL: values.nbURL,
    });
    showModal();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <React.Fragment>
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
      <Modal
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Your pin is 3141</p>
        <p>Please use this pin to connect in the jupyter notebook.</p>
      </Modal>
    </React.Fragment>
  );
};

export default MainForm;
