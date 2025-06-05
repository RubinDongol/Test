// frontend/src/pages/Recipes/detail.tsx
import { useState } from 'react';
import { Rate, Typography, Tag, Divider } from 'antd';
import {
  ClockCircleOutlined,
  UserOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { AppWrapper } from '../../components/layouts';
import { BookmarkIcon, UserIcon } from '../../assets';
import TextArea from 'antd/es/input/TextArea';
import { ReviewCard } from '../../components/recipes';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { USER_REVIEWS } from '../../utils/data';

const RecipeDetail = () => {
  const [isNoteInputVisible, setNoteInputVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const location = useLocation();
  const { data } = location.state || {};
  const { imageUrl, recipeName } = data || {};

  // Mock recipe data - in real app, this would come from API
  const recipeData = {
    name: recipeName || 'Spaghetti Carbonara',
    image:
      imageUrl ||
      'https://images.pexels.com/photos/15076692/pexels-photo-15076692/free-photo-of-burger.jpeg',
    description:
      'A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper. This authentic recipe delivers creamy, rich flavors that will transport you straight to Rome.',
    cookingTime: 30,
    servings: 4,
    difficulty: 'Medium',
    rating: 4.5,
    reviewCount: 28,
    isPremium: false,
    chef: 'Chef Maria Romano',
    tags: ['Italian', 'Pasta', 'Quick', 'Comfort Food'],
    ingredients: [
      { name: 'Spaghetti', quantity: '400g' },
      { name: 'Pancetta or guanciale', quantity: '150g' },
      { name: 'Large eggs', quantity: '4' },
      { name: 'Pecorino Romano cheese (grated)', quantity: '100g' },
      { name: 'Black pepper (freshly ground)', quantity: '1 tsp' },
      { name: 'Salt', quantity: 'to taste' },
    ],
    directions: [
      'Bring a large pot of salted water to boil. Cook spaghetti according to package directions until al dente.',
      'While pasta cooks, cut pancetta into small cubes and cook in a large skillet over medium heat until crispy.',
      'In a bowl, whisk together eggs, grated cheese, and black pepper.',
      'Reserve 1 cup of pasta cooking water, then drain the pasta.',
      'Immediately add hot pasta to the skillet with pancetta. Remove from heat.',
      'Quickly pour the egg mixture over the pasta, tossing rapidly to create a creamy sauce. Add pasta water if needed.',
      'Serve immediately with extra cheese and black pepper.',
    ],
  };

  const saveNote = () => {
    // Here you would save the note to your backend
    console.log('Saving note:', noteText);
    setNoteInputVisible(false);
  };

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white flex-1 overflow-y-scroll">
        <div className="flex flex-col py-8 px-8 gap-6 border-b border-black">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Typography className="!text-3xl !font-bold mb-2">
                {recipeData.name}
              </Typography>
              <Typography className="!text-base text-gray-600 mb-4">
                by {recipeData.chef}
              </Typography>

              {/* Recipe Meta Info */}
              <div className="flex gap-6 items-center mb-4">
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-gray-500" />
                  <span>{recipeData.cookingTime} mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-gray-500" />
                  <span>Serves {recipeData.servings}</span>
                </div>
                <Tag
                  color={
                    recipeData.difficulty === 'Easy'
                      ? 'green'
                      : recipeData.difficulty === 'Medium'
                        ? 'orange'
                        : 'red'
                  }>
                  {recipeData.difficulty}
                </Tag>
                {recipeData.isPremium && <Tag color="gold">Premium</Tag>}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 mb-4">
                <TagOutlined className="text-gray-500" />
                {recipeData.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="flex gap-8">
            <div className="space-y-4">
              <div className="w-[402px] h-[300px] rounded-[14px] bg-black shrink-0 overflow-hidden">
                <img
                  src={recipeData.image}
                  className="w-full h-full object-cover rounded-[14px] hover:shadow-lg transition-shadow"
                  alt="recipe"
                />
              </div>
              <div className="flex gap-2 justify-between items-center">
                <div
                  className="flex gap-1 items-center"
                  onClick={e => e.stopPropagation()}>
                  <Rate allowHalf defaultValue={recipeData.rating} disabled />
                  <Typography className="!text-base ml-2">
                    {recipeData.reviewCount} Reviews
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
                      {index + 1}
                    </div>
                    <Typography className="!text-base leading-relaxed pt-1">
                      {step}
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

        {/* Reviews Section */}
        <div className="px-8 pt-8 pb-4 flex flex-col border-b border-b-[#A6A3A3]">
          <Typography className="!text-2xl !font-semibold mb-4">
            Reviews & Comments
          </Typography>
          <div className="flex gap-2">
            <img src={UserIcon} alt="user" className="w-5 h-5 object-contain" />
            <TextArea
              placeholder="Share your experience with this recipe..."
              autoSize={{ minRows: 3, maxRows: 3 }}
              className="!text-black"
            />
          </div>
        </div>

        <div className="">
          {USER_REVIEWS.map(item => {
            return <ReviewCard key={item.id} data={item} />;
          })}
        </div>
      </div>
    </AppWrapper>
  );
};

export default RecipeDetail;
