import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ChefDataType } from '../../pages/Chefs';

const ChefCard = ({ data }: { data: ChefDataType }) => {
  const { image, name, description } = data;

  return (
    <Link
      to="/chef-detail"
      state={{
        chefName: name,
        chefImage: image,
        chefDescription: description,
      }}>
      <div className="space-y-4 cursor-pointer">
        <div
          className="w-[146px] h-[146px] rounded-full bg-[#D9D9D9]"
          style={{ boxShadow: '0px 4px 4px 0px rgba(86, 80, 80, 0.25)' }}>
          <img
            src={image}
            className="w-full h-full object-cover rounded-full hover:shadow-md"
            alt="chef"
          />
        </div>
        <Typography className="!text-base text-center">{name}</Typography>
      </div>
    </Link>
  );
};

export default ChefCard;
