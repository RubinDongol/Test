// frontend/src/pages/Chefs/index.tsx - Simplified with compact header
import { Typography, Button, Input } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useState, useMemo } from 'react';
import { AppWrapper } from '../../components/layouts';
import { RecipeCard } from '../../components/recipes';
import { ChefCard } from '../../components/chefs';
import { useAppSelector } from '../../redux/hook';
import AddRecipeModal from '../../components/recipes/AddRecipeModal';
import { useGetAllChefRecipesQuery } from '../../redux/services/chefRecipeApi';

const { Search } = Input;

const Chefs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useAppSelector(state => state.auth);
  const {
    data: recipesData,
    isLoading,
    error,
    refetch,
  } = useGetAllChefRecipesQuery();

  const isChef = user.role_id === 3;

  const handleAddRecipeSuccess = () => {
    setIsModalVisible(false);
    refetch();
  };

  // Simple search logic
  const { filteredFreeRecipes, filteredPremiumRecipes } = useMemo(() => {
    if (!recipesData) {
      return {
        filteredFreeRecipes: [],
        filteredPremiumRecipes: [],
      };
    }

    const freeRecipes = recipesData.free_recipes || [];
    const premiumRecipes = recipesData.premium_recipes || [];

    const filterRecipes = (recipes: any[]) => {
      if (!recipes || recipes.length === 0) return [];

      if (!searchTerm.trim()) return recipes; // Show all if no search term

      const search = searchTerm.toLowerCase().trim();
      return recipes.filter(recipe => {
        if (!recipe) return false;

        return (
          (recipe.name && recipe.name.toLowerCase().includes(search)) ||
          (recipe.description &&
            recipe.description.toLowerCase().includes(search)) ||
          (recipe.full_name && recipe.full_name.toLowerCase().includes(search))
        );
      });
    };

    return {
      filteredFreeRecipes: filterRecipes(freeRecipes),
      filteredPremiumRecipes: filterRecipes(premiumRecipes),
    };
  }, [recipesData, searchTerm]);

  const totalResults =
    filteredFreeRecipes.length + filteredPremiumRecipes.length;
  const hasSearch = searchTerm.trim().length > 0;

  if (isLoading) {
    return (
      <AppWrapper>
        <div className="h-full flex justify-center items-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#DC3545] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <Typography className="!text-lg text-gray-600">
              Loading delicious recipes...
            </Typography>
          </div>
        </div>
      </AppWrapper>
    );
  }

  if (error) {
    return (
      <AppWrapper>
        <div className="h-full flex justify-center items-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🍳</div>
            <Typography className="!text-xl text-red-500 mb-2">
              Oops! Something went wrong
            </Typography>
            <Typography className="text-gray-600">
              We couldn't load the recipes. Please try again later.
            </Typography>
          </div>
        </div>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <>
        <div className="h-full flex flex-col bg-white border border-black">
          {/* Compact Header Section */}
          <div className="bg-[#DC3545] text-white px-8 py-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <Typography className="!text-2xl !font-bold !text-white mb-2">
                  Chefs & Their Recipes
                </Typography>
                <Typography className="!text-base !text-white/90">
                  Discover amazing recipes from talented chefs
                </Typography>
              </div>
              {isChef && (
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => setIsModalVisible(true)}
                  className="!bg-white !text-[#DC3545] !border-white hover:!bg-gray-100 !font-medium shadow-sm">
                  Add Recipe
                </Button>
              )}
            </div>

            {/* Compact Search Bar */}
            <div className="max-w-md">
              <Search
                placeholder="Search recipes, chefs, or ingredients..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                prefix={<SearchOutlined className="text-gray-400" />}
                size="large"
                allowClear
                className="search-input-custom"
              />
              {hasSearch && (
                <Typography className="!text-white/80 !text-sm mt-2">
                  {totalResults === 0
                    ? `No recipes found for "${searchTerm}"`
                    : `${totalResults} recipe${totalResults !== 1 ? 's' : ''} found`}
                </Typography>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-scroll">
            {/* Free Recipes Section */}
            {filteredFreeRecipes.length > 0 && (
              <section className="px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                  <Typography className="!text-2xl !font-bold !text-gray-800">
                    Free Recipes
                  </Typography>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {filteredFreeRecipes.length} recipe
                    {filteredFreeRecipes.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="overflow-x-scroll flex gap-8">
                  {filteredFreeRecipes.map(item => (
                    <div
                      key={item.id}
                      className="transform transition-all duration-200 hover:scale-105">
                      <ApiRecipeCard data={item} needsSubscription={false} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Premium Recipes Section */}
            {filteredPremiumRecipes.length > 0 && (
              <section className="px-8 py-8 bg-gray-50">
                <div className="flex items-center justify-between mb-6">
                  <Typography className="!text-2xl !font-bold !text-gray-800">
                    Premium Recipes
                  </Typography>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {filteredPremiumRecipes.length} recipe
                    {filteredPremiumRecipes.length !== 1 ? 's' : ''}
                  </div>
                </div>

                <div className="overflow-x-scroll flex gap-8">
                  {filteredPremiumRecipes.map(item => (
                    <div
                      key={item.id}
                      className="transform transition-all duration-200 hover:scale-105">
                      <ApiRecipeCard data={item} needsSubscription={true} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No Results State */}
            {hasSearch && totalResults === 0 && (
              <section className="px-8 py-16">
                <div className="max-w-md mx-auto text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <Typography className="!text-xl !font-bold !text-gray-800 mb-2">
                    No recipes found
                  </Typography>
                  <Typography className="!text-gray-600 mb-6">
                    We couldn't find any recipes matching{' '}
                    <span className="font-medium">"{searchTerm}"</span>
                  </Typography>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <Typography className="!text-blue-800 !font-medium mb-2 !text-sm">
                      Try searching for:
                    </Typography>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['burger', 'pasta', 'dessert', 'quick meals'].map(
                        suggestion => (
                          <button
                            key={suggestion}
                            onClick={() => setSearchTerm(suggestion)}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs hover:bg-blue-200 transition-colors">
                            {suggestion}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Empty State - No recipes at all */}
            {!hasSearch && totalResults === 0 && (
              <section className="px-8 py-16">
                <div className="max-w-md mx-auto text-center">
                  <div className="text-6xl mb-4">🍳</div>
                  <Typography className="!text-xl !font-bold !text-gray-800 mb-2">
                    No recipes yet
                  </Typography>
                  <Typography className="!text-gray-600 mb-6">
                    Be the first chef to share your amazing recipes!
                  </Typography>
                  {isChef && (
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlusOutlined />}
                      onClick={() => setIsModalVisible(true)}
                      className="!bg-[#DC3545] !border-[#DC3545] !font-medium">
                      Add Your First Recipe
                    </Button>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Add Recipe Modal */}
        <AddRecipeModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleAddRecipeSuccess}
        />

        {/* Custom CSS for search input */}
        <style jsx>{`
          .search-input-custom .ant-input-affix-wrapper {
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            background: rgba(255, 255, 255, 0.1) !important;
            backdrop-filter: blur(10px) !important;
          }
          .search-input-custom .ant-input-affix-wrapper:focus,
          .search-input-custom .ant-input-affix-wrapper:hover {
            border-color: white !important;
            background: rgba(255, 255, 255, 0.2) !important;
          }
          .search-input-custom .ant-input {
            background: transparent !important;
            color: white !important;
          }
          .search-input-custom .ant-input::placeholder {
            color: rgba(255, 255, 255, 0.7) !important;
          }
        `}</style>
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
  const transformedData = {
    id: data.id,
    recipeName: data.name,
    reviews: data.review_count,
    imageUrl: data.image,
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
