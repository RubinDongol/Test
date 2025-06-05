import { Divider, Popover, Typography } from 'antd';
import { LogoutIcon, UserIcon } from '../../assets';
import { CaretDownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { logout } from '../../redux/reducers/auth';

const ProfilePopover = () => {
  const dispatch = useAppDispatch();
  const {user}=useAppSelector(s=>s.auth);
  const {full_name}=user;

  const content = (
    <div className="bg-white items-center flex flex-col rounded-[20px]">
      <div className="py-4 px-4">
        <Link to="/profile">
          <Typography className="!text-base">Profile</Typography>
        </Link>
      </div>
      <Divider className="bg-[#A6A3A3] !m-0" />
      <div className="py-4 px-4">
        <Link to="/subscription">
          <Typography className="!text-base">Subscription</Typography>
        </Link>
      </div>
      <Divider className="bg-[#A6A3A3] !m-0" />
      <div
        className="py-4 px-4 flex gap-1 items-center cursor-pointer"
        onClick={() => dispatch(logout())}>
        <Typography className="!text-base">Sign out</Typography>
        <img src={LogoutIcon} alt="logout" className="w-5 h-5 object-contain" />
      </div>
    </div>
  );
  return (
    <Popover content={content} trigger="click" showArrow={false}>
      <div className="flex gap-2 cursor-pointer transform transition-transform duration-200 ease-out hover:scale-[1.06]">
        <img src={UserIcon} alt="user" className="w-5 h-5 object-contain" />
        <Typography className="xl:!text-base">{full_name}</Typography>
        <CaretDownOutlined className="!text-black" />
      </div>
    </Popover>
  );
};

export default ProfilePopover;
