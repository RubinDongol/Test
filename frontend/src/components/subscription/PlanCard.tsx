import { Typography } from 'antd';
import { PlanType } from '../../pages/Subscription';
import { useNavigate } from 'react-router-dom';

const PlanCard = ({ plan }: { plan: PlanType }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#EAEAEA] rounded-sm flex flex-col px-6 gap-8 min-h-[270px]">
      <div
        className="py-1 px-2 flex items-center justify-center self-center min-w-[140px]"
        style={{ backgroundColor: plan.color }}>
        <Typography className="!text-white !text-2xl">{plan.title}</Typography>
      </div>
      <Typography
        className="text-center !text-2xl"
        style={{ color: plan.color }}>
        {plan.currency} {plan.price}
      </Typography>
      <Typography className="text-center !text-base">
        {plan.description}
      </Typography>
      <button
        className="py-1 px-2 border rounded-md cursor-pointer hover:shadow-md"
        onClick={() => navigate('/payment')}
        style={{ borderColor: plan.color }}>
        <Typography
          className="text-center !text-base"
          style={{ color: plan.color }}>
          Subscribe Now
        </Typography>
      </button>
    </div>
  );
};

export default PlanCard;
