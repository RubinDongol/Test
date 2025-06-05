import { Typography } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { RecipeCard } from '../../components/recipes';
import { RECIPEDATA } from '../../utils/data';

const Recipes = () => {
  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white">
        <div className="flex flex-col pt-8 px-8 gap-8">
          <Typography className="!text-[32px]">Recipes</Typography>
        </div>
        <div className="flex-1 overflow-y-scroll pb-8">
          <div className="flex flex-col pt-8 px-8 gap-8">
            <Typography className="!text-2xl">What's Trending</Typography>
            <div className="overflow-x-scroll flex gap-8">
              {RECIPEDATA.map(item => {
                return <RecipeCard key={item.id} data={item} />;
              })}
            </div>
          </div>
          <div className="flex flex-col pt-8 px-8 gap-8">
            <Typography className="!text-2xl">Vegeterian</Typography>
            <div className="overflow-x-scroll flex gap-8">
              {RECIPEDATA.map(item => {
                return <RecipeCard key={item.id} data={item} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </AppWrapper>
  );
};

export default Recipes;
