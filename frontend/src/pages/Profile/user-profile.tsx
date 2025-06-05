import { Typography } from 'antd';
import { AppWrapper } from '../../components/layouts';
import TextArea from 'antd/es/input/TextArea';
import { PostCard } from '../../components/home';
import { UserOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { USER_REVIEWS } from '../../utils/data';

const UserProfile = () => {
  const imageUrl = null;

  const location = useLocation();

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white overflow-y-auto flex-1">
        <div className="flex flex-col pt-8 pb-4 px-8 gap-8 border-b border-b-[#A6A3A3]">
          <Typography className="!text-[32px]">User Profile</Typography>
          <div className="flex gap-8">
            <div className="flex gap-8 items-center w-1/2">
              <button className="w-[170px] h-[170px] rounded-full bg-[#D9D9D9] flex items-center justify-center cursor-pointer">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="profile-picture"
                    className="w-[170px] h-[170px] object-contain rounded-full"
                  />
                ) : (
                  <UserOutlined className="text-[100px] rounded-full" />
                )}
              </button>
              <div className="space-y-2">
                <Typography className="!text-2xl">
                  {location?.state?.name || 'John Wright'}
                </Typography>
                <Typography className="!text-base !text-[#D63D00]">
                  {Math.round(Math.random() * Math.random() * 102)} followers
                </Typography>
              </div>
            </div>
            <div className="w-1/2">
              <Typography className="!text-2xl">Bio</Typography>
              <TextArea
                placeholder="Edit Your Bio"
                defaultValue={`There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there`}
                autoSize={{ minRows: 4 }}
                readOnly
                className={`!border-none !shadow-none !text-base !px-0`}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col pt-8 px-8 gap-8">
          <Typography className="!text-2xl">Posts</Typography>
        </div>
        {USER_REVIEWS.map(item => {
          return <PostCard key={item.id} data={item} hideReportBtn />;
        })}
      </div>
    </AppWrapper>
  );
};

export default UserProfile;
