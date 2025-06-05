import { RightOutlined } from '@ant-design/icons';
import { Rate, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { UserNameWithIcon } from '../common';
import { ClassData } from '../../pages/Classes';

const ClassCard = ({ data }: { data: ClassData }) => {
  const { title, price, chef, description, image } = data;

  return (
    <div className="border border-black rounded-xl flex">
      <div className="w-[286px] min-h-[286px] bg-black rounded-l-xl overflow-hidden">
        <img
          src={image}
          alt="class"
          className="w-full h-full rounded-l-xl object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-col border-b border-b-[#A6A3A3] px-4 pt-8 pb-4 gap-4">
          <div className="flex justify-between gap-6 items-center">
            <Typography className="!text-[32px]">{title}</Typography>
            <Typography className="!text-base !text-[#28A745]">
              Rs {price}
            </Typography>
          </div>

          <Typography className="!text-base !text-[#D63D00]">
            Online Cooking Class
          </Typography>

          <Typography.Paragraph className="!text-base" ellipsis={{ rows: 3 }}>
            {description}
          </Typography.Paragraph>

          <Link
            to="/classes-detail"
            state={{ title, price, chef, description, image }}
            className="flex self-end"
          >
            <Typography className="!text-base !text-[#D63D00]">
              See More <RightOutlined className="!text-[#D63D00] text-sm" />
            </Typography>
          </Link>
        </div>

        <div className="flex p-4 gap-6 justify-between items-center">
          <div className="flex flex-col gap-1">
            <UserNameWithIcon userName={chef} />
            <div onClick={e => e.stopPropagation()}>
              <Rate allowHalf defaultValue={4} />
            </div>
          </div>

          <Typography className="!text-base">
            Date: Thu, Apr 24th, 2:00pm
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
