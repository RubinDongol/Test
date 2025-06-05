import { Typography } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { RecipeCard } from '../../components/recipes';
import { ChefCard } from '../../components/chefs';
import { PREMIUM_RECIPEDATA, RECIPEDATA } from '../../utils/data';

const Chefs = () => {
  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white">
        <div className="flex flex-col pt-8 px-8 gap-8">
          <Typography className="!text-[32px]">
            Chefs & Their Recipes
          </Typography>
        </div>
        <div className="flex-1 overflow-y-scroll pb-8">
          <div className="flex flex-col pt-8 px-8 gap-8">
            <Typography className="!text-2xl">Featured Chefs</Typography>
            <div className="overflow-x-scroll flex gap-8 self-center">
              {CHEF_DATA.map(item => {
                return <ChefCard key={item.id} data={item} />;
              })}
            </div>
          </div>
          <div className="flex flex-col pt-8 px-8 gap-8">
            <Typography className="!text-2xl">Chef's Recipe</Typography>
            <div className="overflow-x-scroll flex gap-8">
              {RECIPEDATA.map(item => {
                return <RecipeCard key={item.id} data={item} />;
              })}
            </div>
          </div>
          <div className="flex flex-col pt-8 px-8 gap-8">
            <Typography className="!text-2xl">Premium Recipe</Typography>
            <div className="overflow-x-scroll flex gap-8">
              {PREMIUM_RECIPEDATA.map(item => {
                return (
                  <RecipeCard key={item.id} data={item} needsSubscription />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppWrapper>
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
