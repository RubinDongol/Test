import { Typography } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { PlanCard } from '../../components/subscription';

const Subscription = () => {
  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white py-8 px-8 gap-8">
        <Typography className="!text-2xl !text-[#DC3545]">
          Subscriptions
        </Typography>
        <Typography className="!text-2xl">
          Payment gateways for Cookify
        </Typography>
        <Typography className="!text-xl !text-[#DC3545]">
          Note : The payment is Non-Refundable
        </Typography>
        <div className="flex gap-8 lg:gap-16 items-center justify-center">
          {PLAN_LIST.map(plan => (
            <PlanCard key={plan.key} plan={plan} />
          ))}
        </div>
      </div>
    </AppWrapper>
  );
};

export default Subscription;

export type PlanType = (typeof PLAN_LIST)[0];

const PLAN_LIST = [
  {
    title: '3 Months',
    key: 'three-months',
    price: 500,
    currency: 'NPR',
    description: 'Get gourmet recipes from Michelin-starred chefs',
    color: '#007BFF',
  },
  {
    title: '6 Months',
    key: 'six-months',
    price: 1000,
    currency: 'NPR',
    description: 'Get gourmet recipes from Michelin-starred chefs',
    color: '#28A745',
  },
  {
    title: '1 Year',
    key: 'one-year',
    price: 1500,
    currency: 'NPR',
    description: 'Get gourmet recipes from Michelin-starred chefs',
    color: '#DC3545',
  },
];
