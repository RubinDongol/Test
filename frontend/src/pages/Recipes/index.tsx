// frontend/src/pages/Recipes/index.tsx - Updated with proper Spoonacular integration
import { Typography, Spin, Alert } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { RecipeCard } from '../../components/recipes';
import {
  useGetRecipesByCuisineQuery,
  useGetRecipesByDietQuery,
  useGetRecipesByTypeQuery,
} from '../../redux/services/recipeApi';

const Recipes = () => {
  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white">
        <div className="flex flex-col pt-8 px-8 gap-8">
          <div className="flex justify-between items-center">
            <Typography className="!text-[32px]">Recipes</Typography>
          </div>
        </div>

        {/* Recipe Sections - Using Spoonacular API */}
        <div className="flex-1 overflow-y-scroll pb-8">
          {/* Vegetarian Section */}
          <DietSection diet="vegetarian" title="Vegetarian" />

          {/* Appetizers Section */}
          <RecipeTypeSection type="appetizer" title="Appetizers" />

          {/* Desserts Section */}
          <RecipeTypeSection type="dessert" title="Desserts" />
        </div>
      </div>
    </AppWrapper>
  );
};

// Reusable component for cuisine-based sections
const CuisineSection = ({
  cuisine,
  title,
}: {
  cuisine: string;
  title: string;
}) => {
  const {
    data: cuisineRecipes,
    isLoading,
    error,
  } = useGetRecipesByCuisineQuery({ cuisine, limit: 8 });

  return (
    <div className="flex flex-col pt-8 px-8 gap-8">
      <Typography className="!text-2xl">{title}</Typography>
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert
          message={`Error loading ${title.toLowerCase()}`}
          description="Unable to fetch recipes. Please check your API key and try again."
          type="warning"
          showIcon
        />
      ) : cuisineRecipes?.recipes?.length === 0 ? (
        <div className="flex justify-center items-center py-4">
          <Typography className="text-gray-500">
            No {title.toLowerCase()} recipes found
          </Typography>
        </div>
      ) : (
        <div className="overflow-x-scroll flex gap-8">
          {cuisineRecipes?.recipes?.map(item => (
            <RecipeCard
              key={item.id}
              data={item}
              isSpoonacular={true} // Mark as Spoonacular recipe
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Reusable component for diet-based sections
const DietSection = ({ diet, title }: { diet: string; title: string }) => {
  const {
    data: dietRecipes,
    isLoading,
    error,
  } = useGetRecipesByDietQuery({ diet, limit: 8 });

  return (
    <div className="flex flex-col pt-8 px-8 gap-8">
      <Typography className="!text-2xl">{title}</Typography>
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert
          message={`Error loading ${title.toLowerCase()}`}
          description="Unable to fetch recipes. Please check your API key and try again."
          type="warning"
          showIcon
        />
      ) : dietRecipes?.recipes?.length === 0 ? (
        <div className="flex justify-center items-center py-4">
          <Typography className="text-gray-500">
            No {title.toLowerCase()} recipes found
          </Typography>
        </div>
      ) : (
        <div className="overflow-x-scroll flex gap-8">
          {dietRecipes?.recipes?.map(item => (
            <RecipeCard
              key={item.id}
              data={item}
              isSpoonacular={true} // Mark as Spoonacular recipe
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Reusable component for recipe type sections
const RecipeTypeSection = ({
  type,
  title,
}: {
  type: string;
  title: string;
}) => {
  const {
    data: typeRecipes,
    isLoading,
    error,
  } = useGetRecipesByTypeQuery({ type, limit: 8 });

  return (
    <div className="flex flex-col pt-8 px-8 gap-8">
      <Typography className="!text-2xl">{title}</Typography>
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert
          message={`Error loading ${title.toLowerCase()}`}
          description="Unable to fetch recipes. Please check your API key and try again."
          type="warning"
          showIcon
        />
      ) : typeRecipes?.recipes?.length === 0 ? (
        <div className="flex justify-center items-center py-4">
          <Typography className="text-gray-500">
            No {title.toLowerCase()} found
          </Typography>
        </div>
      ) : (
        <div className="overflow-x-scroll flex gap-8">
          {typeRecipes?.recipes?.map(item => (
            <RecipeCard
              key={item.id}
              data={item}
              isSpoonacular={true} // Mark as Spoonacular recipe
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
