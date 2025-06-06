// frontend/src/components/classes/AddClassModal.tsx - Fixed version
import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Typography,
  DatePicker,
  TimePicker,
  InputNumber,
  notification,
  Divider,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAppSelector } from '../../redux/hook';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface AddClassModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit?: () => void;
  loading?: boolean;
}

interface LearningOutcome {
  id: string;
  text: string;
}

interface Requirement {
  id: string;
  text: string;
}

const AddClassModal: React.FC<AddClassModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [learningOutcomes, setLearningOutcomes] = useState<LearningOutcome[]>([
    { id: '1', text: '' },
  ]);
  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: '1', text: '' },
  ]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Get auth token from Redux store
  const { accessToken, user } = useAppSelector(state => state.auth);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        notification.error({ message: 'You can only upload image files!' });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        notification.error({ message: 'Image must be smaller than 5MB!' });
        return;
      }

      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    const fileInput = document.getElementById(
      'class-image-input',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Learning Outcomes handlers
  const addLearningOutcome = () => {
    const newOutcome: LearningOutcome = {
      id: Date.now().toString(),
      text: '',
    };
    setLearningOutcomes([...learningOutcomes, newOutcome]);
  };

  const removeLearningOutcome = (id: string) => {
    if (learningOutcomes.length > 1) {
      setLearningOutcomes(
        learningOutcomes.filter(outcome => outcome.id !== id),
      );
    }
  };

  const updateLearningOutcome = (id: string, value: string) => {
    setLearningOutcomes(
      learningOutcomes.map(outcome =>
        outcome.id === id ? { ...outcome, text: value } : outcome,
      ),
    );
  };

  // Requirements handlers
  const addRequirement = () => {
    const newRequirement: Requirement = {
      id: Date.now().toString(),
      text: '',
    };
    setRequirements([...requirements, newRequirement]);
  };

  const removeRequirement = (id: string) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter(req => req.id !== id));
    }
  };

  const updateRequirement = (id: string, value: string) => {
    setRequirements(
      requirements.map(req => (req.id === id ? { ...req, text: value } : req)),
    );
  };

  const handleSubmit = async () => {
    try {
      // Validate authentication
      if (!accessToken) {
        notification.error({
          message: 'Authentication Error',
          description: 'Please log in again.',
        });
        return;
      }

      // Validate user role
      if (user.role_id !== 3) {
        notification.error({
          message: 'Permission Error',
          description: 'Only chefs can create cooking classes.',
        });
        return;
      }

      const formValues = await form.validateFields();
      setIsCreating(true);

      // Filter out empty learning outcomes and requirements
      const validLearningOutcomes = learningOutcomes
        .filter(outcome => outcome.text.trim())
        .map(outcome => outcome.text.trim());

      const validRequirements = requirements
        .filter(req => req.text.trim())
        .map(req => req.text.trim());

      if (validLearningOutcomes.length === 0) {
        notification.error({
          message: 'Please add at least one learning outcome',
        });
        setIsCreating(false);
        return;
      }

      // Create the class data object
      const classData = {
        title: formValues.title.trim(),
        description: formValues.description.trim(),
        price: Number(formValues.price) || 0,
        duration: Number(formValues.duration) || 60,
        class_date: dayjs(formValues.date).format('YYYY-MM-DD'),
        class_time: dayjs(formValues.time).format('HH:mm:ss'),
        max_students: Number(formValues.maxStudents) || 20,
        difficulty: formValues.difficulty || 'medium',
        learn: validLearningOutcomes,
        requirements: validRequirements,
        category: formValues.category || '',
        tags: formValues.tags || [],
        chef_notes: formValues.chefNotes || '',
        course_fee: Number(formValues.price) || 0,
        image: selectedImage ? 'placeholder-image-path' : null, // Handle image later
      };

      // For now, let's create without image upload since we need to set up the backend
      const result = await createClass(classData);

      notification.success({
        message: 'Class Created Successfully!',
        description: `${formValues.title} has been scheduled and is now available for booking.`,
      });

      handleCancel();
      if (onSubmit) onSubmit();
    } catch (error: any) {
      console.error('Class creation failed:', error);

      let errorMessage = 'Please try again later.';
      if (error.message) {
        errorMessage = error.message;
      }

      notification.error({
        message: 'Error Creating Class',
        description: errorMessage,
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Simplified class creation function using JSON
  const createClass = async (classData: any) => {
    if (!accessToken) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/cooking-classes',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(classData),
        },
      );

      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response text:', responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText || `HTTP ${response.status}` };
        }

        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Permission denied. Only chefs can create classes.');
        } else if (response.status === 404) {
          throw new Error(
            'Cooking classes endpoint not found. Please contact support.',
          );
        } else {
          throw new Error(
            errorData.message || `Server error (${response.status})`,
          );
        }
      }

      // Parse successful response
      try {
        return JSON.parse(responseText);
      } catch {
        // If response is not JSON, return a success object
        return { message: 'Class created successfully' };
      }
    } catch (error) {
      console.error('Network/Fetch error:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedImage(null);
    setImagePreview(null);
    setLearningOutcomes([{ id: '1', text: '' }]);
    setRequirements([{ id: '1', text: '' }]);
    onCancel();
  };

  const finalLoading = loading || isCreating;

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: 0 }}>
          Create New Cooking Class
        </Title>
      }
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={finalLoading}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={finalLoading}
          onClick={handleSubmit}>
          {finalLoading ? 'Creating Class...' : 'Create Class'}
        </Button>,
      ]}>
      <Form form={form} layout="vertical" requiredMark={false}>
        {/* Class Image Upload */}
        <Form.Item label={<Text strong>Class Image (Optional)</Text>}>
          <div className="flex flex-col gap-4">
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  id="class-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    document.getElementById('class-image-input')?.click()
                  }
                  size="large">
                  Upload Class Image
                </Button>
                <div className="mt-2 text-gray-500 text-sm">
                  Max size: 5MB, Formats: JPG, PNG, GIF
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-full h-48 border rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Class preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2">
                  Remove
                </Button>
              </div>
            )}
          </div>
        </Form.Item>

        {/* Class Title */}
        <Form.Item
          label={<Text strong>Class Title</Text>}
          name="title"
          rules={[
            { required: true, message: 'Please enter class title' },
            { min: 3, message: 'Title must be at least 3 characters long' },
          ]}>
          <Input placeholder="e.g., Italian Risotto and Gelato" size="large" />
        </Form.Item>

        {/* Class Description */}
        <Form.Item
          label={<Text strong>Class Description</Text>}
          name="description"
          rules={[
            { required: true, message: 'Please enter class description' },
            {
              min: 10,
              message: 'Description must be at least 10 characters long',
            },
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
              max={100000}
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
              <Option value="easy">Easy</Option>
              <Option value="medium">Medium</Option>
              <Option value="hard">Hard</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Learning Outcomes Section */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
            <Text strong style={{ fontSize: '16px' }}>
              What Students Will Learn *
            </Text>
            <Button
              type="dashed"
              onClick={addLearningOutcome}
              icon={<PlusOutlined />}>
              Add Learning Outcome
            </Button>
          </div>

          {learningOutcomes.map((outcome, index) => (
            <div
              key={outcome.id}
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '8px',
                alignItems: 'center',
              }}>
              <Text style={{ minWidth: '20px', fontWeight: 'bold' }}>
                {index + 1}.
              </Text>
              <Input
                placeholder="What will students learn?"
                value={outcome.text}
                onChange={e =>
                  updateLearningOutcome(outcome.id, e.target.value)
                }
                style={{ flex: 1 }}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeLearningOutcome(outcome.id)}
                disabled={learningOutcomes.length === 1}
              />
            </div>
          ))}
        </div>

        <Divider />

        {/* Requirements Section */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
            <Text strong style={{ fontSize: '16px' }}>
              Requirements (Optional)
            </Text>
            <Button
              type="dashed"
              onClick={addRequirement}
              icon={<PlusOutlined />}>
              Add Requirement
            </Button>
          </div>

          {requirements.map((requirement, index) => (
            <div
              key={requirement.id}
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '8px',
                alignItems: 'center',
              }}>
              <Text style={{ minWidth: '20px', fontWeight: 'bold' }}>
                {index + 1}.
              </Text>
              <Input
                placeholder="Equipment, ingredients, or prior knowledge needed"
                value={requirement.text}
                onChange={e =>
                  updateRequirement(requirement.id, e.target.value)
                }
                style={{ flex: 1 }}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeRequirement(requirement.id)}
                disabled={requirements.length === 1}
              />
            </div>
          ))}
        </div>

        {/* Category */}
        <Form.Item label={<Text strong>Category</Text>} name="category">
          <Input
            placeholder="e.g., Italian Cuisine, Baking, Quick Meals"
            size="large"
          />
        </Form.Item>

        {/* Tags */}
        <Form.Item label={<Text strong>Tags</Text>} name="tags">
          <Select
            mode="tags"
            placeholder="Add tags like 'Italian', 'Dessert', 'Beginner-Friendly'"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>

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
