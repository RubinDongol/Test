// frontend/src/pages/Recipes/detail.tsx
import { useState } from 'react';
import {
  Rate,
  Typography,
  Tag,
  Divider,
  notification,
  Popconfirm,
  Button,
} from 'antd';
import {
  ClockCircleOutlined,
  UserOutlined,
  TagOutlined,
  HeartOutlined,
  HeartFilled,
  DeleteOutlined,
} from '@ant-design/icons';
import { AppWrapper } from '../../components/layouts';
import { BookmarkIcon, UserIcon } from '../../assets';
import TextArea from 'antd/es/input/TextArea';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hook';
import {
  useGetChefRecipeDetailQuery,
  useRateChefRecipeMutation,
  useAddChefRecipeCommentMutation,
  useDeleteChefRecipeMutation,
} from '../../redux/services/chefRecipeApi';
import { getImageUrl } from '../../utils/imageUtils'; // Import the utility

// Simplified ReviewCard component without interactive elements
const SimpleReviewCard = ({ data }: { data: any }) => {
  const { review, userName } = data;

  return (
    <div className="flex flex-col pt-8 pb-4 px-8 gap-4 border-b border-b-[#A6A3A3]">
      <div className="flex gap-1 items-center">
        <img src={UserIcon} alt="user" className="w-6 h-6 object-contain" />
        <Typography className="!text-base">{userName}</Typography>
      </div>
      <Typography className="!text-base">{review}</Typography>
    </div>
  );
};

const RecipeDetail = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [isNoteInputVisible, setNoteInputVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(0);

  // Get current user from Redux store
  const { user } = useAppSelector(state => state.auth);

  // API calls
  const {
    data: recipeData,
    isLoading,
    error,
    refetch,
  } = useGetChefRecipeDetailQuery(Number(recipeId), {
    skip: !recipeId,
  });

  const [rateRecipe, { isLoading: isRating }] = useRateChefRecipeMutation();
  const [addComment, { isLoading: isAddingComment }] =
    useAddChefRecipeCommentMutation();
  const [deleteRecipe, { isLoading: isDeletingRecipe }] =
    useDeleteChefRecipeMutation();

  if (isLoading) {
    return (
      <AppWrapper>
        <div className="h-full flex justify-center items-center">
          <Typography>Loading recipe details...</Typography>
        </div>
      </AppWrapper>
    );
  }

  if (error || !recipeData) {
    return (
      <AppWrapper>
        <div className="h-full flex justify-center items-center">
          <Typography className="text-red-500">
            Recipe not found or error loading recipe details.
          </Typography>
        </div>
      </AppWrapper>
    );
  }

  const handleRating = async (rating: number) => {
    try {
      await rateRecipe({ recipeId: Number(recipeId), rating }).unwrap();
      setUserRating(rating);
      notification.success({ message: 'Rating submitted successfully!' });
      refetch();
    } catch (error) {
      notification.error({ message: 'Failed to submit rating' });
    }
  };

  const handleAddReview = async () => {
    if (!reviewText.trim()) {
      notification.warning({ message: 'Please enter a review' });
      return;
    }

    try {
      await addComment({
        recipeId: Number(recipeId),
        text: reviewText,
      }).unwrap();
      setReviewText('');
      notification.success({ message: 'Review added successfully!' });
      refetch();
    } catch (error) {
      notification.error({ message: 'Failed to add review' });
    }
  };

  const handleDeleteRecipe = async () => {
    try {
      await deleteRecipe(Number(recipeId)).unwrap();
      notification.success({
        message: 'Recipe deleted successfully!',
        description: 'The recipe has been permanently removed.',
      });
      // Navigate back to recipes page after successful deletion
      navigate('/chefs');
    } catch (error: any) {
      console.error('Error deleting recipe:', error);
      notification.error({
        message: 'Failed to delete recipe',
        description: error?.data?.message || 'Please try again later.',
      });
    }
  };

  // Check if current user is the owner of the recipe
  const isRecipeOwner = recipeData && user && recipeData.user_id === user.id;

  const saveNote = () => {
    // Here you would save the note to your backend or local storage
    console.log('Saving note:', noteText);
    notification.success({ message: 'Note saved!' });
    setNoteInputVisible(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white flex-1 overflow-y-scroll">
        <div className="flex flex-col py-8 px-8 gap-6 border-b border-black">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <Typography className="!text-3xl !font-bold">
                  {recipeData.name}
                </Typography>

                {/* Delete Button - Only show if user owns the recipe */}
                {isRecipeOwner && (
                  <Popconfirm
                    title="Delete Recipe"
                    description="Are you sure you want to delete this recipe? This action cannot be undone."
                    onConfirm={handleDeleteRecipe}
                    okText="Yes, Delete"
                    cancelText="Cancel"
                    okButtonProps={{
                      danger: true,
                      loading: isDeletingRecipe,
                    }}
                    placement="bottomRight">
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      loading={isDeletingRecipe}
                      className="!text-red-500 hover:!text-red-700 hover:!border-red-500">
                      {isDeletingRecipe ? 'Deleting...' : 'Delete Recipe'}
                    </Button>
                  </Popconfirm>
                )}
              </div>

              <Typography className="!text-base text-gray-600 mb-4">
                by {recipeData.full_name}
              </Typography>

              {/* Recipe Meta Info */}
              <div className="flex gap-6 items-center mb-4">
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-gray-500" />
                  <span>{recipeData.cooking_time} mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-gray-500" />
                  <span>Serves 4</span>
                </div>
                <Tag
                  color={
                    recipeData.difficulty === 'easy'
                      ? 'green'
                      : recipeData.difficulty === 'medium'
                        ? 'orange'
                        : 'red'
                  }>
                  {recipeData.difficulty.charAt(0).toUpperCase() +
                    recipeData.difficulty.slice(1)}
                </Tag>
                {recipeData.type === 'premium' && (
                  <Tag color="gold">
                    Premium - {formatCurrency(recipeData.cost)}
                  </Tag>
                )}
              </div>

              {/* Tags */}
              {recipeData.tags && recipeData.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <TagOutlined className="text-gray-500" />
                  {recipeData.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content Section */}
          <div className="flex gap-8">
            <div className="space-y-4">
              <div className="w-[402px] h-[300px] rounded-[14px] bg-black shrink-0 overflow-hidden">
                <img
                  src={getImageUrl(recipeData.image)} // Use the utility function
                  className="w-full h-full object-cover rounded-[14px] hover:shadow-lg transition-shadow"
                  alt="recipe"
                  onError={e => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'https://images.pexels.com/photos/28978147/pexels-photo-28978147.jpeg';
                  }}
                />
              </div>
              <div className="flex gap-2 justify-between items-center">
                <div
                  className="flex gap-1 items-center"
                  onClick={e => e.stopPropagation()}>
                  <Rate
                    allowHalf
                    value={userRating || recipeData.stars}
                    onChange={handleRating}
                    disabled={isRating}
                  />
                  <Typography className="!text-base ml-2">
                    {recipeData.review_count} Reviews
                  </Typography>
                </div>
                <button className="flex justify-between items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <img
                    src={BookmarkIcon}
                    alt="bookmark"
                    className="w-5 h-5 object-contain"
                  />
                  <Typography className="!text-base !text-[#807F7F]">
                    Save Recipe
                  </Typography>
                </button>
              </div>
            </div>

            <div className="flex-1">
              <Typography className="!text-xl !font-semibold mb-3">
                Description
              </Typography>
              <Typography className="!text-base leading-relaxed">
                {recipeData.description}
              </Typography>
            </div>
          </div>

          <Divider />

          {/* Recipe Content Section */}
          <div className="flex gap-8">
            <div className="flex flex-col gap-4 w-1/3">
              <Typography className="!text-2xl !font-semibold">
                Ingredients
              </Typography>
              <div className="bg-gray-50 p-4 rounded-lg">
                {recipeData.ingredients.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <Typography className="!text-base">{item.name}</Typography>
                    <Typography className="!text-base font-medium">
                      {item.quantity}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 w-1/2">
              <Typography className="!text-2xl !font-semibold">
                Directions
              </Typography>
              <div className="space-y-4">
                {recipeData.directions.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-8 h-8 bg-[#DC3545] text-white rounded-full flex items-center justify-center font-semibold text-sm shrink-0">
                      {step.step_number}
                    </div>
                    <Typography className="!text-base leading-relaxed pt-1">
                      {step.instruction}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 w-1/5">
              <Typography
                className="!text-2xl !font-semibold cursor-pointer hover:text-[#DC3545] transition-colors"
                onClick={() => setNoteInputVisible(true)}>
                Add a note&nbsp;
                <PlusCircleOutlined className="text-lg" />
              </Typography>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <TextArea
                  placeholder={
                    isNoteInputVisible
                      ? 'Add your personal notes about this recipe...'
                      : 'Click "Add a note" to save your cooking tips and modifications'
                  }
                  autoSize={{ minRows: 4, maxRows: 6 }}
                  readOnly={!isNoteInputVisible}
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  className={`${isNoteInputVisible ? '' : '!border-none !shadow-none !px-0 !py-0 !bg-transparent'} !text-base`}
                />
                {isNoteInputVisible && (
                  <div className="flex gap-2 mt-3">
                    <button
                      className="bg-[#DC3545] text-white px-4 py-1 rounded cursor-pointer hover:bg-[#c82333] transition-colors"
                      onClick={saveNote}>
                      <Typography className="!text-white !text-base">
                        Save
                      </Typography>
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-1 rounded cursor-pointer hover:bg-gray-600 transition-colors"
                      onClick={() => setNoteInputVisible(false)}>
                      <Typography className="!text-white !text-base">
                        Cancel
                      </Typography>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Simplified Reviews Section */}
        <div className="px-8 pt-8 pb-4 flex flex-col border-b border-b-[#A6A3A3]">
          <Typography className="!text-2xl !font-semibold mb-4">
            Reviews & Comments
          </Typography>
          <div className="flex gap-2 mb-4">
            <img src={UserIcon} alt="user" className="w-5 h-5 object-contain" />
            <div className="flex-1">
              <TextArea
                placeholder="Share your experience with this recipe..."
                autoSize={{ minRows: 3, maxRows: 3 }}
                className="!text-black mb-2"
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
              />
              <div className="flex justify-end items-center">
                <button
                  className="bg-[#DC3545] text-white px-4 py-1 rounded cursor-pointer hover:bg-[#c82333] transition-colors"
                  onClick={handleAddReview}
                  disabled={isAddingComment}>
                  <Typography className="!text-white !text-base">
                    {isAddingComment ? 'Adding...' : 'Add Review'}
                  </Typography>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Simplified Comments Display */}
        <div className="">
          {recipeData.comments && recipeData.comments.length > 0 ? (
            recipeData.comments.map(comment => (
              <SimpleReviewCard
                key={comment.id}
                data={{
                  id: comment.id.toString(),
                  userName: comment.full_name,
                  review: comment.text,
                }}
              />
            ))
          ) : (
            <div className="flex justify-center items-center p-8">
              <Typography>
                No reviews yet. Be the first to review this recipe!
              </Typography>
            </div>
          )}
        </div>
      </div>
    </AppWrapper>
  );
};

export default RecipeDetail;
