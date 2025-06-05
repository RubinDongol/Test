import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserIcon } from '../../assets';

const RecommendedProfile = () => {
  const navigate = useNavigate(); 
  const recommendedUsers = [
    'John Doe',
    'Jane Smith',
    'Michael Scott',
    'David Lee',
    'Emily Clark',
  ];

  return (
    <div className="w-[215px] bg-white border !border-black !rounded-2xl py-8 px-4 flex flex-col gap-6">
      <Typography className="!text-base text-center">
        Recommended Profile
      </Typography>
      <div className="overflow-y-auto flex-1 space-y-8">
        {recommendedUsers.map((name, index) => (
          <div
            className="flex gap-1 items-center justify-between"
            key={index}
          >
            <div className="flex gap-1 items-center">
              <img
                src={UserIcon}
                alt="user"
                className="w-5 h-5 object-contain"
              />
              <Typography className="!text-base">{name}</Typography>
            </div>
            <button
              onClick={() => {
                navigate('/user-profile', {
                  state: {
                    name: name, 
                  },
                });
              }}
              className="bg-black rounded-full px-2 py-1 min-w-[52px] cursor-pointer"
            >
              <Typography className="!text-xs !text-white text-center">
                Follow
              </Typography>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProfile;
