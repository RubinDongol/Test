import { Typography } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { UserIcon } from '../../assets';
import TextArea from 'antd/es/input/TextArea';
import { RecipeCard, ReviewCard } from '../../components/recipes';
import { RECIPEDATA, USER_REVIEWS } from '../../utils/data';
import { useLocation } from 'react-router-dom';

const ChefDetail = () => {
  const location = useLocation();
  const { chefName, chefImage, chefDescription } = location.state || {};

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white flex-1 overflow-y-scroll">
        <div className="flex flex-col py-8 px-8 gap-8 border-b border-black">
          <Typography className="!text-2xl">
            {chefName || 'Chef Name'}
          </Typography>

          <div className="flex gap-8">
            <div className="w-[225px] h-[225px] rounded-[14px] bg-black shrink-0 overflow-hidden">
              <img
                src={chefImage || 'https://via.placeholder.com/225'}
                className="w-full h-full object-cover rounded-[14px] hover:shadow-md"
                alt="chef"
              />
            </div>

            <Typography className="!text-base">
              {chefDescription ||
                'A top-tier chef with experience crafting delicious meals from around the world.'}
            </Typography>
          </div>

          <div className="flex flex-col gap-4">
            <Typography className="!text-2xl">Most Popular Recipe</Typography>
            <div className="overflow-x-auto w-full flex gap-8">
              {RECIPEDATA.map(item => (
                <RecipeCard key={item.id} data={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="px-8 pt-8 pb-4 flex flex-col border-b border-b-[#A6A3A3]">
          <div className="flex gap-2">
            <img src={UserIcon} alt="user" className="w-5 h-5 object-contain" />
            <TextArea
              placeholder="Leave a review..."
              autoSize={{ minRows: 3, maxRows: 3 }}
              className="!text-black"
            />
          </div>
        </div>

        <div className="">
          {USER_REVIEWS.map(item => (
            <ReviewCard key={item.id} data={item} />
          ))}
        </div>
      </div>
    </AppWrapper>
  );
};

export default ChefDetail;
