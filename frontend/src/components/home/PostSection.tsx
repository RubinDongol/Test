import { useState } from 'react';
import { Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UserIcon } from '../../assets';
import PostCard from './PostCard';
import { USER_REVIEWS } from '../../utils/data';

const PostSection = () => {
  const [isFollowing, setFollowing] = useState(false);
  return (
    <div className="bg-white border border-black flex flex-col flex-1 pt-8">
      <div className="flex flex-col min-h-0">
        <div className="flex gap-[40px] md:gap-[90px] xl:gap-[128px] justify-center items-center pb-4 border-b border-b-[#A6A3A3]">
          {['For You', 'Following'].map((label, index) => {
            const isActive =
              (index === 1 && isFollowing) || (index === 0 && !isFollowing);
            return (
              <div
                key={label}
                className="relative cursor-pointer"
                onClick={() => setFollowing(index === 1)}>
                <Typography className="!text-base">{label}</Typography>
                <div
                  className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300 ${
                    isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </div>
            );
          })}
        </div>
        <div className="overflow-y-auto flex-1">
          {!isFollowing && (
            <div className="px-8 pt-8 pb-4 flex flex-col border-b border-b-[#A6A3A3]">
              <div className="flex gap-2">
                <img
                  src={UserIcon}
                  alt="user"
                  className="w-5 h-5 object-contain"
                />
                <TextArea
                  placeholder="Add Your Post?"
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  className="!border-none !shadow-none"
                />
              </div>
              <button className="bg-[#B5B5B5] px-4 rounded-full flex self-end cursor-pointer">
                <Typography className="text-black !text-base">Post</Typography>
              </button>
            </div>
          )}
          {USER_REVIEWS.map(item => {
            return <PostCard key={item.id} data={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default PostSection;
