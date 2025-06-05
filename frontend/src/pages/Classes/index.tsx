import { Typography } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { ClassCard } from '../../components/classes';

const Classes = () => {
  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white py-8 px-8 gap-8 flex-1 overflow-y-scroll">
        <Typography className="!text-2xl !text-[#DC3545]">Classes</Typography>
        <Typography className="!text-base">
          Book the best online cooking session taught by world-class chefs.
          Fully Interactive!
        </Typography>
        <div className="flex flex-col gap-8 items-center justify-center mx-auto max-w-[970px]">
          {CLASS_DATA.map(item => (
            <ClassCard key={item.id} data={item} />
          ))}
        </div>
      </div>
    </AppWrapper>
  );
};

export default Classes;

const CLASS_DATA = [
  {
    id: '1',
    title: 'Italian Risotto and Gelato',
    price: 3000,
    chef: 'Chef Maria',
    description:
      'Learn to create Italian Risotto and Gelato from scratch with Chef Maria live from Rome.',
    image: 'https://images.pexels.com/photos/15076692/pexels-photo-15076692/free-photo-of-burger.jpeg',
  },
  {
    id: '2',
    title: 'French Pizza',
    price: 1200,
    chef: 'Chef Raj',
    description:
      'Master the art of French-Style Pizza making with Chef Raj. Authentic and delicious!',
    image: 'https://images.pexels.com/photos/2232/vegetables-italian-pizza-restaurant.jpg',
  },
];

export type ClassData = (typeof CLASS_DATA)[0];
