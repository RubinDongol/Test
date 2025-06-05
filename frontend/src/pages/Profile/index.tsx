import { Typography } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { useState } from 'react';
import { handleOpenPicker } from '../../utils/helper';
import TextArea from 'antd/es/input/TextArea';
import { PostCard } from '../../components/home';
import { useAppSelector } from '../../redux/hook';
import { USER_REVIEWS } from '../../utils/data';

const Profile = () => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [isEditable, setEditable] = useState(false);

  const { user } = useAppSelector(s => s.auth);

  const handleGetImage = async () => {
    const imageFile = await handleOpenPicker();
    if (imageFile) {
      const blobImageUrl = URL.createObjectURL(imageFile);
      setImageUrl(blobImageUrl);
    }
  };

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white overflow-y-auto flex-1">
        <div className="flex flex-col pt-8 pb-4 px-8 gap-8 border-b border-b-[#A6A3A3]">
          <Typography className="!text-[32px]">Your Profile</Typography>
          <div className="flex gap-8">
            <div className="flex gap-8 items-center w-1/2">
              <button
                className="w-[170px] h-[170px] rounded-full bg-[#D9D9D9] flex items-center cursor-pointer"
                onClick={handleGetImage}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="profile-picture"
                    className="w-[170px] h-[170px] object-contain rounded-full"
                  />
                ) : (
                  <Typography className="!text-[#28A3DB] !text-[20px] text-center">
                    Upload a profile picture
                  </Typography>
                )}
              </button>
              <div className="space-y-2">
                <Typography className="!text-2xl">{user.full_name}</Typography>
                <Typography className="!text-base !text-[#D63D00]">
                  20 followers
                </Typography>
              </div>
            </div>
            <div className="w-1/2">
              <Typography className="!text-2xl">Bio</Typography>
              <TextArea
                placeholder="Edit Your Bio"
                defaultValue={user.bio}
                autoSize={{ minRows: 4 }}
                readOnly={!isEditable}
                className={`!border-none !shadow-none !text-base ${isEditable ? '' : '!px-0'}`}
              />
              <button
                className="bg-[#B5B5B5] px-4 rounded-full flex self-end cursor-pointer mt-4"
                onClick={() => setEditable(!isEditable)}>
                <Typography className="text-black !text-base">
                  {!isEditable ? 'Edit Bio' : 'Update'}
                </Typography>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col pt-8 px-8 gap-8">
          <Typography className="!text-2xl">Your Posts</Typography>
        </div>
        {USER_REVIEWS.map(item => {
          return <PostCard key={item.id} data={item} />;
        })}
      </div>
    </AppWrapper>
  );
};

export default Profile;
