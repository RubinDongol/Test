// frontend/src/components/classes/AddClassModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Typography,
  DatePicker,
  TimePicker,
  InputNumber,
  notification,
  Divider,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface AddClassModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

const AddClassModal: React.FC<AddClassModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUploadChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload Class Image</div>
    </div>
  );

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();

      // Combine date and time
      const classDateTime = dayjs(formValues.date)
        .hour(dayjs(formValues.time).hour())
        .minute(dayjs(formValues.time).minute());

      const classData = {
        ...formValues,
        dateTime: classDateTime.toISOString(),
        image: fileList[0]?.originFileObj || null,
      };

      onSubmit(classData);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: 0 }}>
          Create New Cooking Class
        </Title>
      }
      open={visible}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}>
          Create Class
        </Button>,
      ]}>
      <Form form={form} layout="vertical" requiredMark={false}>
        {/* Class Image */}
        <Form.Item
          label={<Text strong>Class Image</Text>}
          name="image"
          rules={[{ required: true, message: 'Please upload a class image' }]}>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Prevent auto upload
            maxCount={1}>
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>

        {/* Class Title */}
        <Form.Item
          label={<Text strong>Class Title</Text>}
          name="title"
          rules={[{ required: true, message: 'Please enter class title' }]}>
          <Input placeholder="e.g., Italian Risotto and Gelato" size="large" />
        </Form.Item>

        {/* Class Description */}
        <Form.Item
          label={<Text strong>Class Description</Text>}
          name="description"
          rules={[
            { required: true, message: 'Please enter class description' },
          ]}>
          <TextArea
            rows={4}
            placeholder="Describe what students will learn in this class..."
          />
        </Form.Item>

        {/* Price and Duration */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            label={<Text strong>Price (NPR)</Text>}
            name="price"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Please enter class price' }]}>
            <InputNumber
              placeholder="3000"
              size="large"
              style={{ width: '100%' }}
              min={0}
              formatter={value =>
                `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={value => {
                if (typeof value === 'string') {
                  return value.replace(/₹\s?|(,*)/g, '');
                }
                return value || '';
              }}
            />
          </Form.Item>

          <Form.Item
            label={<Text strong>Duration (minutes)</Text>}
            name="duration"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Please enter class duration' },
            ]}>
            <InputNumber
              placeholder="90"
              size="large"
              style={{ width: '100%' }}
              min={15}
              max={480}
              formatter={value => `${value} min`}
              parser={value => {
                if (typeof value === 'string') {
                  return value.replace(' min', '');
                }
                return value || '';
              }}
            />
          </Form.Item>
        </div>

        {/* Date and Time */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            label={<Text strong>Class Date</Text>}
            name="date"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Please select class date' }]}>
            <DatePicker
              size="large"
              style={{ width: '100%' }}
              disabledDate={current =>
                current && current < dayjs().startOf('day')
              }
              placeholder="Select date"
            />
          </Form.Item>

          <Form.Item
            label={<Text strong>Class Time</Text>}
            name="time"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Please select class time' }]}>
            <TimePicker
              size="large"
              style={{ width: '100%' }}
              format="HH:mm"
              placeholder="Select time"
            />
          </Form.Item>
        </div>

        <Divider />

        {/* Class Settings */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            label={<Text strong>Maximum Students</Text>}
            name="maxStudents"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Please enter maximum students' },
            ]}>
            <InputNumber
              placeholder="20"
              size="large"
              style={{ width: '100%' }}
              min={1}
              max={100}
            />
          </Form.Item>

          <Form.Item
            label={<Text strong>Difficulty Level</Text>}
            name="difficulty"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Please select difficulty level' },
            ]}>
            <Select placeholder="Select difficulty" size="large">
              <Option value="beginner">Beginner</Option>
              <Option value="intermediate">Intermediate</Option>
              <Option value="advanced">Advanced</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Class Type */}
        {/* <Form.Item
          label={<Text strong>Class Type</Text>}
          name="classType"
          rules={[{ required: true, message: 'Please select class type' }]}>
          <Select placeholder="Select class type" size="large">
            <Option value="live">Live Interactive Class</Option>
            <Option value="recorded">Pre-recorded Class</Option>
            <Option value="hybrid">Hybrid (Live + Recording)</Option>
          </Select>
        </Form.Item> */}

        {/* What Students Will Learn */}
        <Form.Item
          label={<Text strong>What Students Will Learn</Text>}
          name="learningOutcomes"
          rules={[
            { required: true, message: 'Please describe learning outcomes' },
          ]}>
          <TextArea
            rows={3}
            placeholder="• Master authentic Italian risotto techniques&#10;• Learn traditional gelato making&#10;• Understand flavor pairing principles"
          />
        </Form.Item>

        {/* Requirements/Prerequisites */}
        <Form.Item
          label={<Text strong>Requirements (optional)</Text>}
          name="requirements">
          <TextArea
            rows={3}
            placeholder="List any equipment, ingredients, or prior knowledge students need..."
          />
        </Form.Item>

        {/* Class Category/Tags */}
        <Form.Item label={<Text strong>Category & Tags</Text>} name="tags">
          <Select
            mode="tags"
            placeholder="Add tags like 'Italian', 'Dessert', 'Beginner-Friendly'"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

        {/* Meeting Platform */}
        {/* <Form.Item
          label={<Text strong>Meeting Platform</Text>}
          name="platform"
          rules={[
            { required: true, message: 'Please select meeting platform' },
          ]}>
          <Select placeholder="Select platform" size="large">
            <Option value="zoom">Zoom</Option>
            <Option value="teams">Microsoft Teams</Option>
            <Option value="meet">Google Meet</Option>
            <Option value="custom">Custom Live Stream</Option>
          </Select>
        </Form.Item> */}

        {/* Chef Notes */}
        <Form.Item
          label={<Text strong>Chef's Notes (optional)</Text>}
          name="chefNotes">
          <TextArea
            rows={2}
            placeholder="Any special notes or messages for your students..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddClassModal;
