// frontend/src/components/home/RecommendedProfile.tsx
import { Typography, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserIcon } from '../../assets';
import { useFollowUserMutation } from '../../redux/services/userApi';
import { useState } from 'react';

const RecommendedProfile = () => {
  const navigate = useNavigate();
  const [followUser] = useFollowUserMutation();
  const [followingStates, setFollowingStates] = useState<{
    [key: number]: boolean;
  }>({});

  // Mock recommended users - in a real app, this would come from an API
  const recommendedUsers = [
    { id: 1, name: 'John Doe', photo: null },
    { id: 2, name: 'Jane Smith', photo: null },
    { id: 3, name: 'Michael Scott', photo: null },
    { id: 4, name: 'David Lee', photo: null },
    { id: 5, name: 'Emily Clark', photo: null },
  ];

  const handleFollow = async (userId: number) => {
    try {
      await followUser(userId).unwrap();
      setFollowingStates(prev => ({ ...prev, [userId]: true }));
      notification.success({ message: 'User followed successfully!' });
    } catch (error) {
      console.error('Error following user:', error);
      notification.error({ message: 'Failed to follow user' });
    }
  };

  return (
    <div className="w-[215px] bg-white border !border-black !rounded-2xl py-8 px-4 flex flex-col gap-6">
      <Typography className="!text-base text-center">
        Recommended Profile
      </Typography>
      <div className="overflow-y-auto flex-1 space-y-8">
        {recommendedUsers.map(user => (
          <div
            className="flex gap-1 items-center justify-between"
            key={user.id}>
            <div className="flex gap-1 items-center">
              <img
                src={user.photo || UserIcon}
                alt="user"
                className="w-5 h-5 object-contain"
              />
              <Typography className="!text-base">{user.name}</Typography>
            </div>
            <button
              onClick={() => {
                if (followingStates[user.id]) {
                  navigate('/user-profile', {
                    state: {
                      name: user.name,
                    },
                  });
                } else {
                  handleFollow(user.id);
                }
              }}
              className="bg-black rounded-full px-2 py-1 min-w-[52px] cursor-pointer">
              <Typography className="!text-xs !text-white text-center">
                {followingStates[user.id] ? 'View' : 'Follow'}
              </Typography>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProfile;
