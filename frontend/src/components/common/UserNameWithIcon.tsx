import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserIcon } from '../../assets';

const UserNameWithIcon = ({
  userName,
  disabled,
}: {
  userName: string;
  disabled?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <button
      className={`flex self-start gap-1 items-center ${disabled ? '' : 'cursor-pointer'}`}
      onClick={() => {
        if (!disabled) {
          navigate('/user-profile', {
            state: {
              name: userName,
            },
          });
        }
      }}>
      <img src={UserIcon} alt="user" className="w-6 h-6 object-contain" />
      <Typography className="!text-base">{userName}</Typography>
    </button>
  );
};

export default UserNameWithIcon;
