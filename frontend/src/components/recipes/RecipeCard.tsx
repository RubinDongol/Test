import { Rate, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RecipeDataType } from '../../utils/data';

const RecipeCard = ({
  needsSubscription,
  data,
}: {
  needsSubscription?: boolean;
  data: RecipeDataType;
}) => {
  const navigate = useNavigate();
  const { imageUrl, recipeName, reviews } = data;
  return (
    <div
      className="flex flex-col gap-2 cursor-pointer"
      onClick={() =>
        navigate('/recipe-detail', {
          state: { data },
        })
      }>
      <div className="w-[258px] h-[140px] rounded-[14px] bg-black">
        <img
          src={imageUrl}
          className="w-full h-full object-contain rounded-[14px]"
          alt="food-item"
          loading="lazy"
        />
      </div>
      <Typography className="!text-base">{recipeName}</Typography>
      <div onClick={e => e.stopPropagation()}>
        <Rate allowHalf defaultValue={2.5} />
      </div>
      <div className="flex gap-4 justify-between items-center">
        <Typography className="!text-base">{reviews} Reviews</Typography>
        {needsSubscription && (
          <button
            className="bg-[#008000] px-4 rounded-full flex self-end cursor-pointer"
            onClick={e => {
              e.stopPropagation();
              navigate('/subscription');
            }}>
            <Typography className="!text-white !text-sm">Subscribe</Typography>
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
