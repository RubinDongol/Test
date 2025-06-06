// frontend/src/components/recipes/RecipeCard.tsx
import { Rate, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  needsSubscription?: boolean;
  data: {
    id: string | number;
    recipeName: string;
    reviews: number;
    imageUrl: string;
    rating?: number;
    chef?: string;
    description?: string;
    cookingTime?: number;
    difficulty?: string;
    cost?: number;
  };
}

const RecipeCard = ({ needsSubscription, data }: RecipeCardProps) => {
  const navigate = useNavigate();
  const { id, imageUrl, recipeName, reviews, rating, chef } = data;

  const handleCardClick = () => {
    // Navigate to recipe detail page with the recipe ID
    navigate(`/recipe-detail/${id}`, {
      state: {
        recipeId: id,
        fallbackData: data, // Keep fallback data in case needed
      },
    });
  };

  return (
    <div
      className="flex flex-col gap-2 cursor-pointer transition-transform hover:scale-105"
      onClick={handleCardClick}>
      <div className="w-[258px] h-[140px] rounded-[14px] bg-black">
        <img
          src={imageUrl}
          className="w-full h-full object-cover rounded-[14px]"
          alt="food-item"
          loading="lazy"
        />
      </div>
      <Typography className="!text-base font-medium">{recipeName}</Typography>
      {chef && (
        <Typography className="!text-sm text-gray-600">by {chef}</Typography>
      )}
      <div onClick={e => e.stopPropagation()}>
        <Rate allowHalf defaultValue={rating || 2.5} disabled />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <Typography className="!text-base">{reviews} Reviews</Typography>
        {needsSubscription && (
          <button
            className="bg-[#008000] px-4 rounded-full flex self-end cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              navigate('/subscription');
            }}>
            <Typography className="!text-white !text-sm">Subscribe</Typography>
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
