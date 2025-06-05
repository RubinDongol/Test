// frontend/src/components/common/UserNameWithIcon.tsx
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserIcon } from '../../assets';

const UserNameWithIcon = ({
  userName,
  userId, // Add userId prop
  disabled,
}: {
  userName: string;
  userId?: number; // Add this prop
  disabled?: boolean;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!disabled && userId) {
      navigate(`/user-profile/${userId}`, {
        state: {
          name: userName,
          userId: userId,
        },
      });
    }
  };

  return (
    <button
      className={`flex self-start gap-1 items-center ${disabled ? '' : 'cursor-pointer hover:opacity-75 transition-opacity'}`}
      onClick={handleClick}>
      <img src={UserIcon} alt="user" className="w-6 h-6 object-contain" />
      <Typography className="!text-base">{userName}</Typography>
    </button>
  );
};

export default UserNameWithIcon;
