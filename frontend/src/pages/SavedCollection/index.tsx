// frontend/src/pages/SavedCollection/index.tsx
import { Typography, Spin, Alert, Button, Popconfirm, Tabs } from 'antd';
import { DeleteOutlined, EyeOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AppWrapper } from '../../components/layouts';
import { PostCard } from '../../components/home';
import { 
  useGetSavedRecipesQuery, 
  useRemoveSavedRecipeMutation 
} from '../../redux/services/recipeBookmarkApi';
import { useGetBookmarkedPostsQuery } from '../../redux/services/postApi';

const { TabPane } = Tabs;

const SavedCollection = () => {
  const navigate = useNavigate();
  
  // Fetch saved recipes
  const {
    data: savedRecipes = [],
    isLoading: isLoadingRecipes,
    error: recipesError,
    refetch: refetchRecipes,
  } = useGetSavedRecipesQuery();

  // Fetch bookmarked posts
  const {
    data: bookmarkedPosts = [],
    isLoading: isLoadingPosts,
    error: postsError,
  } = useGetBookmarkedPostsQuery();

  const [removeSavedRecipe, { isLoading: isRemovingRecipe }] = useRemoveSavedRecipeMutation();

  const handleRemoveRecipe = async (recipeId: string) => {
    try {
      await removeSavedRecipe(recipeId).unwrap();
      refetchRecipes();
    } catch (error) {
      console.error('Error removing recipe:', error);
    }
  };

  const handleViewRecipe = (recipe: any) => {
    const parsedIngredients = JSON.parse(recipe.ingredients || '[]');
    const parsedDirections = JSON.parse(recipe.directions || '[]');
    const parsedTags = JSON.parse(recipe.tags || '[]');

    navigate('/recipe-detail', {
      state: {
        data: {
          id: recipe.recipe_id,
          recipeName: recipe.title,
          imageUrl: recipe.image,
        },
        savedRecipeData: {
          id: recipe.recipe_id,
          name: recipe.title,
          image: recipe.image,
          description: recipe.description,
          cookingTime: recipe.cooking_time,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          rating: recipe.rating,
          reviewCount: Math.floor(Math.random() * 100),
          isPremium: false,
          chef: recipe.chef,
          tags: parsedTags,
          ingredients: parsedIngredients,
          directions: parsedDirections,
        }
      },
    });
  };

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white py-8 px-8 gap-8">
        <Typography className="!text-2xl">Saved Collection</Typography>

        <Tabs defaultActiveKey="posts" className="flex-1">
          {/* Posts Tab */}
          <TabPane tab={`Posts (${bookmarkedPosts.length})`} key="posts">
            {isLoadingPosts ? (
              <div className="flex justify-center items-center h-64">
                <Spin size="large" />
                <Typography className="ml-4">Loading saved posts...</Typography>
              </div>
            ) : postsError ? (
              <div className="flex justify-center items-center h-64">
                <Alert
                  message="Error loading saved posts"
                  description="Please try again later"
                  type="error"
                  showIcon
                />
              </div>
            ) : bookmarkedPosts.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 gap-4">
                <Typography className="text-gray-500 text-lg">
                  No saved posts yet. Start bookmarking posts you like!
                </Typography>
                <Button 
                  type="primary" 
                  onClick={() => navigate('/')}
                  className="!bg-[#DC3545] !border-[#DC3545]">
                  Browse Posts
                </Button>
              </div>
            ) : (
              <div className="space-y-0">
                {bookmarkedPosts.map(post => (
                  <PostCard key={post.id} data={post} hideReportBtn />
                ))}
              </div>
            )}
          </TabPane>

          {/* Recipes Tab */}
          <TabPane tab={`Recipes (${savedRecipes.length})`} key="recipes">
            {isLoadingRecipes ? (
              <div className="flex justify-center items-center h-64">
                <Spin size="large" />
                <Typography className="ml-4">Loading saved recipes...</Typography>
              </div>
            ) : recipesError ? (
              <div className="flex justify-center items-center h-64">
                <Alert
                  message="Error loading saved recipes"
                  description="Please try again later"
                  type="error"
                  showIcon
                />
              </div>
            ) : savedRecipes.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 gap-4">
                <Typography className="text-gray-500 text-lg">
                  No saved recipes yet. Start bookmarking recipes you like!
                </Typography>
                <Button 
                  type="primary" 
                  onClick={() => navigate('/recipe')}
                  className="!bg-[#DC3545] !border-[#DC3545]">
                  Browse Recipes
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map((recipe) => (
                  <SavedRecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onView={() => handleViewRecipe(recipe)}
                    onRemove={() => handleRemoveRecipe(recipe.recipe_id)}
                    isRemoving={isRemovingRecipe}
                  />
                ))}
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>
    </AppWrapper>
  );
};

// Component for individual saved recipe card
const SavedRecipeCard = ({
  recipe,
  onView,
  onRemove,
  isRemoving,
}: {
  recipe: any;
  onView: () => void;
  onRemove: () => void;
  isRemoving: boolean;
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={onView}
            className="!bg-[#DC3545] !border-[#DC3545]">
          </Button>
          <Popconfirm
            title="Remove Recipe"
            description="Are you sure you want to remove this recipe from your collection?"
            onConfirm={onRemove}
            okText="Yes, Remove"
            cancelText="Cancel"
            okButtonProps={{
              danger: true,
              loading: isRemoving,
            }}>
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={isRemoving}>
            </Button>
          </Popconfirm>
        </div>
      </div>
      
      <div className="p-4">
        <Typography className="!text-lg !font-semibold mb-2 line-clamp-2">
          {recipe.title}
        </Typography>
        
        <Typography className="!text-sm text-gray-600 mb-3 line-clamp-2">
          {recipe.description}
        </Typography>
        
        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
          <span>By {recipe.chef}</span>
          <span>{recipe.cooking_time} mins</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            Saved on {formatDate(recipe.created_at)}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span>{recipe.rating}/5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedCollection;