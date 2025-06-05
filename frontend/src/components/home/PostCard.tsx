import { notification, Typography } from 'antd';
import { BookmarkIcon, ChatIcon, FlagIcon, HeartIcon } from '../../assets';
import { UserNameWithIcon } from '../common';
import { useLocation } from 'react-router-dom';
import { UserReviewType } from '../../utils/data';

const PostCard = ({
  hideReportBtn,
  data,
}: {
  hideReportBtn?: boolean;
  data: UserReviewType;
}) => {
  const location = useLocation();
  const locationUser = location?.state?.name;

  const { userName, review } = data || {};

  return (
    <div className="flex flex-col pt-8 pb-4 px-8 gap-4 border-b border-b-[#A6A3A3]">
      <UserNameWithIcon
        userName={locationUser || userName}
        disabled={hideReportBtn}
      />
      <Typography className="!text-base">{review}</Typography>
      <div className="flex justify-between items-center gap-6">
        <div className="flex justify-between items-center gap-4">
          <img
            src={ChatIcon}
            alt="comment"
            className="w-6 h-6 object-contain cursor-pointer"
          />
          <img
            src={HeartIcon}
            alt="heart"
            className="w-6 h-6 object-contain cursor-pointer"
          />
          <img
            src={BookmarkIcon}
            alt="bookmark"
            className="w-6 h-6 object-contain cursor-pointer"
            onClick={() =>
              notification.success({ message: 'Post has been bookmarked' })
            }
          />
        </div>
        {!hideReportBtn && (
          <button
            className="flex justify-between items-center gap-2 cursor-pointer"
            onClick={() =>
              notification.success({ message: 'Post has been reported' })
            }>
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

export default PostCard;
