import { Divider, Popover, Typography } from 'antd';
import { MikeIcon } from '../../assets';

const AnnouncementPopover = () => {
  const content = (
    <div className="bg-white items-center flex flex-col rounded-[20px]">
      <div className="py-4 px-4">
        <Typography className="!text-base">Rubin liked your post</Typography>
      </div>
      <Divider className="bg-[#A6A3A3] !m-0" />
      <div className="py-4 px-4">
        <Typography className="!text-base">Rubin liked your post</Typography>
      </div>
    </div>
  );
  return (
    <Popover content={content} trigger="click">
      <div className="flex gap-2 cursor-pointer transform transition-transform duration-200 ease-out hover:scale-[1.06]">
        <img src={MikeIcon} alt="mike" className="w-5 h-5 object-contain" />
        <Typography className="xl:!text-base">Announcement</Typography>
      </div>
    </Popover>
  );
};

export default AnnouncementPopover;
