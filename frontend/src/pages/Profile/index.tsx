// frontend/src/pages/Profile/index.tsx
import { Typography, notification } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { useState, useEffect } from 'react';
import { handleOpenPicker } from '../../utils/helper';
import TextArea from 'antd/es/input/TextArea';
import { PostCard } from '../../components/home';
import { useAppSelector } from '../../redux/hook';
import {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
} from '../../redux/services/userApi';

const Profile = () => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [isEditable, setEditable] = useState(false);
  const [bioText, setBioText] = useState('');

  const { user } = useAppSelector(s => s.auth);
  const { data: profileData, isLoading } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  useEffect(() => {
    if (profileData) {
      setBioText(profileData.bio || '');
      if (profileData.photo) {
        setImageUrl(profileData.photo);
      }
    }
  }, [profileData]);

  const handleGetImage = async () => {
    const imageFile = await handleOpenPicker();
    if (imageFile) {
      const blobImageUrl = URL.createObjectURL(imageFile);
      setImageUrl(blobImageUrl);

      // Here you would typically upload the image to your server
      // and get back a URL to save in the profile
      // For now, we'll just use the blob URL
    }
  };

  const handleUpdateBio = async () => {
    try {
      await updateProfile({
        bio: bioText,
        photo: imageUrl,
      }).unwrap();

      setEditable(false);
      notification.success({ message: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      notification.error({ message: 'Failed to update profile' });
    }
  };

  if (isLoading) {
    return (
      <AppWrapper>
        <div className="h-full flex justify-center items-center">
          <Typography>Loading profile...</Typography>
        </div>
      </AppWrapper>
    );
  }

  const displayData = profileData || user;

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white overflow-y-auto flex-1">
        <div className="flex flex-col pt-8 pb-4 px-8 gap-8 border-b border-b-[#A6A3A3]">
          <Typography className="!text-[32px]">Your Profile</Typography>
          <div className="flex gap-8">
            <div className="flex gap-8 items-center w-1/2">
              <button
                className="w-[170px] h-[170px] rounded-full bg-[#D9D9D9] flex items-center cursor-pointer overflow-hidden"
                onClick={handleGetImage}>
                {imageUrl || displayData.photo ? (
                  <img
                    src={imageUrl || displayData.photo || ''}
                    alt="profile-picture"
                    className="w-[170px] h-[170px] object-cover rounded-full"
                  />
                ) : (
                  <Typography className="!text-[#28A3DB] !text-[20px] text-center">
                    Upload a profile picture
                  </Typography>
                )}
              </button>
              <div className="space-y-2">
                <Typography className="!text-2xl">
                  {displayData.full_name}
                </Typography>
                <Typography className="!text-base !text-[#D63D00]">
                  {profileData?.posts?.length || 0} posts
                </Typography>
                <Typography className="!text-base text-gray-600">
                  Member since {new Date(displayData.created_at).getFullYear()}
                </Typography>
              </div>
            </div>
            <div className="w-1/2">
              <Typography className="!text-2xl">Bio</Typography>
              <TextArea
                placeholder="Edit Your Bio"
                value={bioText}
                onChange={e => setBioText(e.target.value)}
                autoSize={{ minRows: 4 }}
                readOnly={!isEditable}
                className={`!border-none !shadow-none !text-base ${isEditable ? '' : '!px-0'}`}
              />
              <button
                className="bg-[#B5B5B5] px-4 rounded-full flex self-end cursor-pointer mt-4"
                onClick={isEditable ? handleUpdateBio : () => setEditable(true)}
                disabled={isUpdating}>
                <Typography className="text-black !text-base">
                  {isUpdating
                    ? 'Updating...'
                    : isEditable
                      ? 'Update'
                      : 'Edit Bio'}
                </Typography>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col pt-8 px-8 gap-8">
          <Typography className="!text-2xl">Your Posts</Typography>
        </div>

        {profileData?.posts?.length === 0 ? (
          <div className="flex justify-center items-center p-8">
            <Typography>No posts yet. Create your first post!</Typography>
          </div>
        ) : (
          profileData?.posts?.map(post => (
            <PostCard key={post.id} data={post} hideReportBtn />
          ))
        )}
      </div>
    </AppWrapper>
  );
};

export default Profile;
