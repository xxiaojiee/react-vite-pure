import React, { useState } from 'react';
import { Modal, Button, Input } from 'antd';

const { TextArea } = Input;

const Index: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="文书确认"
        okText="签收"
        cancelText="取消"
        visible ={isModalVisible}
        onOk={handleOk}
        bodyStyle={{ padding: 10 }}
        onCancel={handleCancel}
      >
        <div style={{ marginBottom: 10 }}>文书确认无误请填写备注信息</div>
        <TextArea rows={4} />
      </Modal>
    </>
  );
};

export default Index;
