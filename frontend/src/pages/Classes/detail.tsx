import { Rate, Typography } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { BookmarkIcon, UserIcon } from '../../assets';
import TextArea from 'antd/es/input/TextArea';
import { ReviewCard } from '../../components/recipes';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { USER_REVIEWS } from '../../utils/data';

const ClassDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPurchased, setPurchased] = useState(false);

  const { title, price, chef, description, image } = location.state || {};

  useEffect(() => {
    const isPaid = sessionStorage.getItem('isPaid');
    if (isPaid === 'true') {
      setPurchased(true);
    }
  }, []);

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white flex-1 overflow-y-scroll">
        <div className="flex flex-col py-8 px-8 gap-8 border-b border-black">
          <Typography className="!text-2xl">
            {title} (Recipe courtesy of <span className="!text-blue-400">{chef}</span>)
          </Typography>

          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-[280px] md:w-[320px] lg:w-[400px] h-[188px] rounded-[14px] bg-black shrink-0 overflow-hidden">
              <img
                src={image}
                className="w-full h-full object-cover rounded-[14px] hover:shadow-md"
                alt="class"
              />
            </div>

            <div className="border-2 border-[#9C9C9C] rounded-xl flex flex-col gap-3 flex-1 p-4">
              <div className="flex gap-3 items-center justify-between">
                <Typography className="!text-2xl !text-[#28A745]">
                  Rs {price}
                </Typography>

                <button className="flex justify-between items-center gap-2 cursor-pointer">
                  <img src={BookmarkIcon} alt="bookmark" className="w-4 h-5 object-contain" />
                  <Typography className="!text-base">Save Class</Typography>
                </button>
              </div>

              <Typography className="!text-2xl !text-[#D63D00]">
                90 - minute class
              </Typography>

              <Typography className="!text-2xl !text-[#D63D00]">
                Date: Thu, Apr 24th, 2:00pm
              </Typography>
              {isPurchased && (
                  <>
                    <Typography className="!text-2xl !text-[#D63D00]">
                      Link : http://localhost:5173/live-classes/nvy-yjxn-gjy?pli=1
                    </Typography>             
                  </>
                )}
              <button
                className="bg-[#008000] px-4 rounded-full flex self-start cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  if (!isPurchased) {
                    return navigate('/payment', {
                      state: { paymentFor: 'liveClass' },
                    });
                  }
                  navigate('/live-classes/nvy-yjxn-gjy?pli=1');
                }}
              >
                <Typography className="!text-white !text-sm">
                  {!isPurchased ? 'Book Now' : 'Join Class'}
                </Typography>
              </button>
            </div>
          </div>

          <div className="flex gap-8 ">
            <div className="flex flex-col gap-4 w-1/2">
              <Typography className="!text-2xl">Description</Typography>
              <Typography className="!text-base">{description}</Typography>
            </div>

            <div className="border-2 border-[#9C9C9C] rounded-xl flex flex-col gap-3 w-1/2 p-4">
              <Typography className="!text-2xl text-center">
                Meet your chef
              </Typography>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1 w-[30%]">
                  <div className="flex gap-1 items-center">
                    <img src={UserIcon} alt="user" className="w-5 h-5 object-contain" />
                    <Typography className="!text-base">{chef}</Typography>
                  </div>

                  <div onClick={e => e.stopPropagation()}>
                    <Rate allowHalf defaultValue={4} />
                  </div>

                  <Typography className="!text-base">12 Reviews</Typography>
                </div>

                <div className="flex flex-col gap-1 w-[70%]">
                  <Typography.Paragraph className="!text-base" ellipsis={{ rows: 3 }}>
                    {description}
                  </Typography.Paragraph>

                  <Link to="/chef-detail" className="flex self-end">
                    <Typography className="!text-base !text-[#D63D00]">
                      See More&nbsp;<RightOutlined className="!text-[#D63D00] text-sm" />
                    </Typography>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="px-8 pt-8 pb-4 flex flex-col gap-4">
          <Typography className="!text-2xl">Reviews</Typography>
          <div className="flex gap-2">
            <img src={UserIcon} alt="user" className="w-5 h-5 object-contain" />
            <TextArea placeholder="Leave a review..." autoSize={{ minRows: 3, maxRows: 3 }} className="!text-black" />
          </div>
        </div>

        <div className="">
          {USER_REVIEWS.map(item => (
            <ReviewCard key={item.id} data={item} />
          ))}
        </div>
      </div>
    </AppWrapper>
  );
};

export default ClassDetail;
