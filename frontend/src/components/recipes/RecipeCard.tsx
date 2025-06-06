// frontend/src/components/recipes/RecipeCard.tsx - Updated to handle Spoonacular recipes
import { Rate, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  needsSubscription?: boolean;
  isSpoonacular?: boolean; // Add flag to distinguish Spoonacular recipes
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
    readyInMinutes?: number;
    servings?: number;
    sourceUrl?: string;
    cuisines?: string[];
    diets?: string[];
    dishTypes?: string[];
  };
}

const RecipeCard = ({
  needsSubscription,
  data,
  isSpoonacular = false,
}: RecipeCardProps) => {
  const navigate = useNavigate();
  const { id, imageUrl, recipeName, reviews, rating, chef, readyInMinutes } =
    data;

  // Function to construct image URL
  const getImageUrl = (imagePath: string | null): string => {
    if (!imagePath) {
      return 'https://images.pexels.com/photos/28978147/pexels-photo-28978147.jpeg';
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    const cleanPath = imagePath.startsWith('/')
      ? imagePath.substring(1)
      : imagePath;
    return `http://localhost:8080/${cleanPath}`;
  };

  const handleCardClick = () => {
    if (isSpoonacular) {
      // For Spoonacular recipes, navigate with the Spoonacular ID
      navigate(`/recipe-detail/${id}`, {
        state: {
          isSpoonacular: true,
          spoonacularId: id,
          fallbackData: data,
        },
      });
    } else {
      // For chef/internal recipes, use the existing navigation
      navigate(`/recipe-detail/${id}`, {
        state: {
          recipeId: id,
          fallbackData: data,
        },
      });
    }
  };

  return (
    <div
      className="flex flex-col gap-2 cursor-pointer transition-transform hover:scale-105"
      onClick={handleCardClick}>
      <div className="w-[258px] h-[140px] rounded-[14px] bg-black overflow-hidden">
        <img
          src={getImageUrl(imageUrl)}
          className="w-full h-full object-cover rounded-[14px]"
          alt="food-item"
          loading="lazy"
          onError={e => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.src =
              'https://images.pexels.com/photos/28978147/pexels-photo-28978147.jpeg';
          }}
        />
      </div>

      <Typography className="!text-base font-medium">{recipeName}</Typography>
      {chef && (
        <Typography className="!text-sm text-gray-600">by {chef}</Typography>
      )}
      {readyInMinutes && (
        <Typography className="!text-sm text-gray-500">
          Ready in {readyInMinutes} minutes
        </Typography>
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
