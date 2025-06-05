// frontend/src/components/recipes/AddRecipeModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Typography,
  Space,
  Rate,
  notification,
  Divider,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface AddRecipeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
}

interface Direction {
  id: string;
  step: string;
}

const AddRecipeModal: React.FC<AddRecipeModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: '', quantity: '' },
  ]);
  const [directions, setDirections] = useState<Direction[]>([
    { id: '1', step: '' },
  ]);

  const handleUploadChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload Image</div>
    </div>
  );

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: '',
      quantity: '',
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    }
  };

  const updateIngredient = (
    id: string,
    field: 'name' | 'quantity',
    value: string,
  ) => {
    setIngredients(
      ingredients.map(ingredient =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient,
      ),
    );
  };

  const addDirection = () => {
    const newDirection: Direction = {
      id: Date.now().toString(),
      step: '',
    };
    setDirections([...directions, newDirection]);
  };

  const removeDirection = (id: string) => {
    if (directions.length > 1) {
      setDirections(directions.filter(direction => direction.id !== id));
    }
  };

  const updateDirection = (id: string, value: string) => {
    setDirections(
      directions.map(direction =>
        direction.id === id ? { ...direction, step: value } : direction,
      ),
    );
  };

  const handleSubmit = async () => {
    try {
      const formValues = await form.validateFields();

      // Filter out empty ingredients and directions
      const validIngredients = ingredients.filter(
        ing => ing.name.trim() && ing.quantity.trim(),
      );
      const validDirections = directions.filter(dir => dir.step.trim());

      if (validIngredients.length === 0) {
        notification.error({ message: 'Please add at least one ingredient' });
        return;
      }

      if (validDirections.length === 0) {
        notification.error({
          message: 'Please add at least one direction step',
        });
        return;
      }

      const recipeData = {
        ...formValues,
        ingredients: validIngredients,
        directions: validDirections,
        image: fileList[0]?.originFileObj || null,
      };

      onSubmit(recipeData);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setIngredients([{ id: '1', name: '', quantity: '' }]);
    setDirections([{ id: '1', step: '' }]);
    onCancel();
  };

  return (
    <Modal
      title={
        <Title level={3} style={{ margin: 0 }}>
          Add New Recipe
        </Title>
      }
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}>
          Add Recipe
        </Button>,
      ]}>
      <Form form={form} layout="vertical" requiredMark={false}>
        {/* Recipe Image */}
        <Form.Item
          label={<Text strong>Recipe Image</Text>}
          name="image"
          rules={[{ required: true, message: 'Please upload a recipe image' }]}>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={() => false} // Prevent auto upload
            maxCount={1}>
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>

        {/* Recipe Name */}
        <Form.Item
          label={<Text strong>Recipe Name</Text>}
          name="recipeName"
          rules={[{ required: true, message: 'Please enter recipe name' }]}>
          <Input placeholder="e.g., Spaghetti Carbonara" size="large" />
        </Form.Item>

        {/* Recipe Type */}
        <Form.Item
          label={<Text strong>Recipe Type</Text>}
          name="recipeType"
          rules={[{ required: true, message: 'Please select recipe type' }]}>
          <Select placeholder="Select recipe type" size="large">
            <Option value="free">Free Recipe</Option>
            <Option value="premium">Premium Recipe</Option>
          </Select>
        </Form.Item>

        {/* Description */}
        <Form.Item
          label={<Text strong>Description</Text>}
          name="description"
          rules={[
            { required: true, message: 'Please enter recipe description' },
          ]}>
          <TextArea
            rows={4}
            placeholder="Describe your recipe, cooking techniques, and what makes it special..."
          />
        </Form.Item>

        {/* Cooking Time & Servings */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            label={<Text strong>Cooking Time (minutes)</Text>}
            name="cookingTime"
            style={{ flex: 1 }}
            rules={[{ required: true, message: 'Please enter cooking time' }]}>
            <Input type="number" placeholder="30" size="large" />
          </Form.Item>

          <Form.Item
            label={<Text strong>Servings</Text>}
            name="servings"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Please enter number of servings' },
            ]}>
            <Input type="number" placeholder="4" size="large" />
          </Form.Item>
        </div>

        <Divider />

        {/* Ingredients Section */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
            <Text strong style={{ fontSize: '16px' }}>
              Ingredients
            </Text>
            <Button
              type="dashed"
              onClick={addIngredient}
              icon={<PlusOutlined />}>
              Add Ingredient
            </Button>
          </div>

          {ingredients.map((ingredient, index) => (
            <div
              key={ingredient.id}
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
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={e =>
                  updateIngredient(ingredient.id, 'name', e.target.value)
                }
                style={{ flex: 2 }}
              />
              <Input
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={e =>
                  updateIngredient(ingredient.id, 'quantity', e.target.value)
                }
                style={{ flex: 1 }}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeIngredient(ingredient.id)}
                disabled={ingredients.length === 1}
              />
            </div>
          ))}
        </div>

        <Divider />

        {/* Directions Section */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
            <Text strong style={{ fontSize: '16px' }}>
              Directions
            </Text>
            <Button
              type="dashed"
              onClick={addDirection}
              icon={<PlusOutlined />}>
              Add Step
            </Button>
          </div>

          {directions.map((direction, index) => (
            <div
              key={direction.id}
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '8px',
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  minWidth: '30px',
                  fontWeight: 'bold',
                  paddingTop: '8px',
                }}>
                Step {index + 1}:
              </Text>
              <TextArea
                placeholder="Describe this cooking step in detail..."
                value={direction.step}
                onChange={e => updateDirection(direction.id, e.target.value)}
                autoSize={{ minRows: 2, maxRows: 4 }}
                style={{ flex: 1 }}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeDirection(direction.id)}
                disabled={directions.length === 1}
                style={{ marginTop: '8px' }}
              />
            </div>
          ))}
        </div>

        {/* Difficulty Level */}
        <Form.Item
          label={<Text strong>Difficulty Level</Text>}
          name="difficulty"
          rules={[
            { required: true, message: 'Please select difficulty level' },
          ]}>
          <Select placeholder="Select difficulty level" size="large">
            <Option value="easy">Easy</Option>
            <Option value="medium">Medium</Option>
            <Option value="hard">Hard</Option>
          </Select>
        </Form.Item>

        {/* Tags */}
        <Form.Item label={<Text strong>Tags (optional)</Text>} name="tags">
          <Select
            mode="tags"
            placeholder="Add tags like 'Italian', 'Vegetarian', 'Quick'"
            size="large"
            style={{ width: '100%' }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddRecipeModal;
