// frontend/src/components/recipes/AddRecipeModal.tsx - Updated with working image upload
import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Typography,
  notification,
  Divider,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { useCreateChefRecipeMutation } from '../../redux/services/chefRecipeApi';
import { useAppSelector } from '../../redux/hook';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface AddRecipeModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit?: () => void;
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
  loading: propLoading = false,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: '', quantity: '' },
  ]);
  const [directions, setDirections] = useState<Direction[]>([
    { id: '1', step: '' },
  ]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Get auth token from Redux store
  const { accessToken } = useAppSelector(state => state.auth);

  const [createChefRecipe, { isLoading: isCreatingRecipe }] =
    useCreateChefRecipeMutation();
  const loading = propLoading || isCreatingRecipe;

  //
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
      // if (selectedImage) {
      //   formData.append('image', selectedImage);
      // }

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
    // Clear the file input
    const fileInput = document.getElementById(
      'recipe-image-input',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      if (file.originFileObj) {
        file.preview = URL.createObjectURL(file.originFileObj);
      }
    }
  };

  const handleRemove = (file: UploadFile) => {
    // Clean up the preview URL when file is removed
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
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

      // Create FormData for file upload
      const formData = new FormData();

      // Add basic recipe data
      formData.append('name', formValues.recipeName);
      formData.append('type', formValues.recipeType);
      if (formValues.recipeType === 'premium' && formValues.cost) {
        formData.append('cost', formValues.cost.toString());
      }
      formData.append('description', formValues.description);
      formData.append('cooking_time', formValues.cookingTime.toString());
      formData.append('difficulty', formValues.difficulty);

      // Add arrays as JSON strings
      formData.append(
        'ingredients',
        JSON.stringify(
          validIngredients.map(ing => ({
            name: ing.name,
            quantity: ing.quantity,
          })),
        ),
      );
      formData.append(
        'directions',
        JSON.stringify(validDirections.map(dir => dir.step)),
      );
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      if (formValues.tags && formValues.tags.length > 0) {
        formData.append('tags', JSON.stringify(formValues.tags));
      }

      // Add image file if present
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      // Create recipe using FormData
      await createRecipeWithFormData(formData);

      notification.success({
        message: 'Recipe Added Successfully!',
        description: `${formValues.recipeName} has been added to your recipes.`,
      });

      handleCancel();
      if (onSubmit) onSubmit();
    } catch (error: any) {
      console.error('Recipe creation failed:', error);
      notification.error({
        message: 'Error Adding Recipe',
        description: error?.message || 'Please try again later.',
      });
    }
  };

  // Custom function to handle FormData submission
  const createRecipeWithFormData = async (formData: FormData) => {
    console.log(
      'Using token:',
      accessToken ? 'Token present' : 'No token found',
    );

    if (!accessToken) {
      throw new Error('Authentication token not found. Please log in again.');
    }

    const response = await fetch('http://localhost:8080/api/recipes', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error(errorData.message || 'Failed to create recipe');
    }

    return response.json();
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedImage(null);
    setImagePreview(null);
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
        <Form.Item label={<Text strong>Recipe Image (Optional)</Text>}>
          <div className="flex flex-col gap-4">
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  id="recipe-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() =>
                    document.getElementById('recipe-image-input')?.click()
                  }
                  size="large">
                  Upload Recipe Image
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
                    alt="Recipe preview"
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

        {/* Cost (only for premium recipes) */}
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.recipeType !== currentValues.recipeType
          }>
          {({ getFieldValue }) =>
            getFieldValue('recipeType') === 'premium' ? (
              <Form.Item
                label={<Text strong>Cost (NPR)</Text>}
                name="cost"
                rules={[
                  { required: true, message: 'Please enter recipe cost' },
                ]}>
                <Input
                  type="number"
                  placeholder="500"
                  size="large"
                  prefix="NPR"
                />
              </Form.Item>
            ) : null
          }
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

        {/* Cooking Time */}
        <Form.Item
          label={<Text strong>Cooking Time (minutes)</Text>}
          name="cookingTime"
          rules={[{ required: true, message: 'Please enter cooking time' }]}>
          <Input type="number" placeholder="30" size="large" />
        </Form.Item>

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
