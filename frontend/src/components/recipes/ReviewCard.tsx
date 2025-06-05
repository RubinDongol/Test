import { Rate, Typography } from 'antd';
import { ChatIcon, FlagIcon, LikeIcon } from '../../assets';
import { UserNameWithIcon } from '../common';
import { UserReviewType } from '../../utils/data';

const ReviewCard = ({
  hideReportBtn,
  data,
}: {
  hideReportBtn?: boolean;
  data: UserReviewType;
}) => {
  const { review, userName } = data;
  return (
    <div className="flex flex-col pt-8 pb-4 px-8 gap-4 border-b border-b-[#A6A3A3]">
      <UserNameWithIcon userName={userName} />
      <div onClick={e => e.stopPropagation()}>
        <Rate allowHalf defaultValue={3.5} />
      </div>
      <Typography className="!text-base">{review}</Typography>
      <div className="flex justify-between items-center gap-6">
        <div className="flex justify-between items-center gap-4">
          <button className="flex gap-1 items-center cursor-pointer">
            <img
              src={LikeIcon}
              alt="heart"
              className="w-6 h-6 object-contain"
            />
            <Typography className="!text-base">Like</Typography>
          </button>
          <button className="flex gap-1 items-center cursor-pointer">
            <img
              src={ChatIcon}
              alt="comment"
              className="w-6 h-6 object-contain"
            />
            <Typography className="!text-base">Comment</Typography>
          </button>
        </div>
        {!hideReportBtn && (
          <button className="flex justify-between items-center gap-2 cursor-pointer">
            <Typography className="!text-base text-[#807F7F]">
              Report
            </Typography>
            <img
              src={FlagIcon}
              alt="bookmark"
              className="w-5 h-5 object-contain"
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
