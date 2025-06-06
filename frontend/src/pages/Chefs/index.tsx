// frontend/src/pages/Chefs/index.tsx
import { Typography, Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { AppWrapper } from '../../components/layouts';
import { RecipeCard } from '../../components/recipes';
import { ChefCard } from '../../components/chefs';
import { useAppSelector } from '../../redux/hook';
import AddRecipeModal from '../../components/recipes/AddRecipeModal';
import { useGetAllChefRecipesQuery } from '../../redux/services/chefRecipeApi';

const Chefs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { user } = useAppSelector(state => state.auth);
  const {
    data: recipesData,
    isLoading,
    error,
    refetch,
  } = useGetAllChefRecipesQuery();

  // Check if user is a chef (role_id 3 = chef)
  const isChef = user.role_id === 3;

  const handleAddRecipeSuccess = () => {
    setIsModalVisible(false);
    refetch(); // Refetch recipes after successful creation
  };

  if (isLoading) {
    return (
      <AppWrapper>
        <div className="h-full flex justify-center items-center">
          <Typography>Loading recipes...</Typography>
        </div>
      </AppWrapper>
    );
  }

  if (error) {
    return (
      <AppWrapper>
        <div className="h-full flex justify-center items-center">
          <Typography className="text-red-500">
            Error loading recipes. Please try again.
          </Typography>
        </div>
      </AppWrapper>
    );
  }

  const chefs = recipesData?.chefs || CHEF_DATA; // Fallback to mock data
  const freeRecipes = recipesData?.free_recipes || [];
  const premiumRecipes = recipesData?.premium_recipes || [];

  return (
    <AppWrapper>
      <>
        <div className="h-full flex flex-col border border-black bg-white">
          <div className="flex flex-col pt-8 px-8 gap-8">
            <div className="flex justify-between items-center">
              <Typography className="!text-[32px]">
                Chefs & Their Recipes
              </Typography>
              {isChef && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => setIsModalVisible(true)}
                  className="!bg-[#DC3545] !border-[#DC3545] hover:!bg-[#c82333] hover:!border-[#c82333]">
                  Add Recipe
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-scroll pb-8">
            <div className="flex flex-col pt-8 px-8 gap-8">
              <Typography className="!text-2xl">Featured Chefs</Typography>
              <div className="overflow-x-scroll flex gap-8 self-center">
                {chefs.map(item => {
                  return <ChefCard key={item.id} data={item} />;
                })}
              </div>
            </div>

            <div className="flex flex-col pt-8 px-8 gap-8">
              <Typography className="!text-2xl">Free Recipes</Typography>
              {freeRecipes.length === 0 ? (
                <div className="flex justify-center items-center p-8">
                  <Typography>No free recipes available</Typography>
                </div>
              ) : (
                <div className="overflow-x-scroll flex gap-8">
                  {freeRecipes.map(item => {
                    return (
                      <ApiRecipeCard
                        key={item.id}
                        data={item}
                        needsSubscription={false}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col pt-8 px-8 gap-8">
              <Typography className="!text-2xl">Premium Recipes</Typography>
              {premiumRecipes.length === 0 ? (
                <div className="flex justify-center items-center p-8">
                  <Typography>No premium recipes available</Typography>
                </div>
              ) : (
                <div className="overflow-x-scroll flex gap-8">
                  {premiumRecipes.map(item => {
                    return (
                      <ApiRecipeCard
                        key={item.id}
                        data={item}
                        needsSubscription={true}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Recipe Modal */}
        <AddRecipeModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleAddRecipeSuccess}
        />
      </>
    </AppWrapper>
  );
};

// Component to handle API recipe data format
const ApiRecipeCard = ({
  data,
  needsSubscription,
}: {
  data: any;
  needsSubscription: boolean;
}) => {
  // Transform API data to match RecipeCard expected format
  const transformedData = {
    id: data.id, // Keep as number for API calls
    recipeName: data.name,
    reviews: data.review_count,
    imageUrl:
      data.image ||
      'https://images.pexels.com/photos/28978147/pexels-photo-28978147.jpeg',
    rating: data.stars || 0,
    chef: data.full_name,
    description: data.description,
    cookingTime: data.cooking_time,
    difficulty: data.difficulty,
    cost: data.cost,
  };

  return (
    <RecipeCard data={transformedData} needsSubscription={needsSubscription} />
  );
};

export default Chefs;

const CHEF_DATA = [
  {
    id: 1,
    name: 'Chef Maria',
    image: 'https://images.pexels.com/photos/5953502/pexels-photo-5953502.jpeg',
    description:
      'Expert in traditional Italian cuisine with 20+ years of experience.',
  },
  {
    id: 2,
    name: 'Chef Raj',
    image: 'https://images.pexels.com/photos/8629106/pexels-photo-8629106.jpeg',
    description:
      'Fusion food master blending French and Indian flavors creatively.',
  },
  {
    id: 3,
    name: 'Chef James',
    image: 'https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg',
    description:
      'Award-winning pastry chef known for creating art with desserts.',
  },
  {
    id: 4,
    name: 'Chef Ayesha',
    image: 'https://images.pexels.com/photos/3338534/pexels-photo-3338534.jpeg',
    description: 'Modern Middle Eastern cuisine expert with global experience.',
  },
  {
    id: 5,
    name: 'Chef Mei',
    image: 'https://images.pexels.com/photos/8629076/pexels-photo-8629076.jpeg',
    description:
      'Authentic Asian culinary specialist with a contemporary twist.',
  },
];

export type ChefDataType = (typeof CHEF_DATA)[0];
