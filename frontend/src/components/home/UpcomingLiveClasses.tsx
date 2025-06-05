import { Divider, Typography } from 'antd';
import { Link } from 'react-router-dom';

const UpcomingLiveClasses = () => {
  return (
    <div className="w-[215px] bg-white border !border-black !rounded-2xl py-8 px-4 flex flex-col gap-6">
      <Typography className="!text-base text-center">
        Upcoming Live Classes
      </Typography>
      <div className="overflow-y-auto flex-1 space-y-8">
        {/* Content */}
        <Link to="/classes-detail">
          <Typography className="!text-base mb-0">
            <span className="font-medium">Italian Rissoto and Gelato</span>
            &nbsp;by John Doe
          </Typography>
        </Link>
        <Divider className=" bg-black" />
        <Link to="/classes-detail">
          <Typography className="!text-base">
            <span className="font-medium">Italian Rissoto and Gelato</span>
            &nbsp;by Sarah Johnson
          </Typography>
        </Link>
        <Divider className=" bg-black" />
        <Link to="/classes-detail">
          <Typography className="!text-base">
            <span className="font-medium">Italian Rissoto and Gelato</span>
            &nbsp;by Emily Clark
          </Typography>
        </Link>
        <Divider className=" bg-black" />
      </div>
    </div>
  );
};

export default UpcomingLiveClasses;
