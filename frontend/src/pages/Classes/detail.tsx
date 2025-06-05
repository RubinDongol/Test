// frontend/src/pages/Classes/detail.tsx
import { Rate, Typography, Tag, Divider, Button } from 'antd';
import {
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  LinkOutlined,
} from '@ant-design/icons';
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

  // Enhanced class data
  const classData = {
    title: title || 'Italian Risotto and Gelato',
    price: price || 3000,
    chef: chef || 'Chef Maria',
    description:
      description ||
      'Learn to create Italian Risotto and Gelato from scratch with Chef Maria live from Rome.',
    image:
      image ||
      'https://images.pexels.com/photos/15076692/pexels-photo-15076692/free-photo-of-burger.jpeg',
    duration: 90,
    date: 'Thu, Apr 24th, 2:00pm',
    maxStudents: 20,
    enrolledStudents: 12,
    difficulty: 'Intermediate',
    platform: 'Zoom',
    rating: 4.5,
    reviewCount: 12,
    tags: ['Italian', 'Live Class', 'Interactive', 'Dessert'],
    meetingLink: 'http://localhost:5173/live-classes/nvy-yjxn-gjy?pli=1',
    learningOutcomes: [
      'Master authentic Italian risotto cooking techniques',
      'Learn traditional gelato making from scratch',
      'Understand flavor pairing and seasoning principles',
      'Get hands-on experience with live chef guidance',
    ],
    requirements: [
      'Basic cooking equipment (pot, wooden spoon, etc.)',
      'Fresh ingredients list will be provided 24 hours before class',
      'Stable internet connection for live interaction',
    ],
  };

  const formatDate = (dateString: string) => {
    return dateString;
  };

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white flex-1 overflow-y-scroll">
        <div className="flex flex-col py-8 px-8 gap-8 border-b border-black">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Typography className="!text-3xl !font-bold mb-2">
                {classData.title}
              </Typography>
              <Typography className="!text-base text-gray-600 mb-4">
                Recipe courtesy of{' '}
                <span className="!text-blue-400">{classData.chef}</span>
              </Typography>

              {/* Class Meta Info */}
              <div className="flex gap-6 items-center mb-4">
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-gray-500" />
                  <span>{classData.duration} minute class</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-gray-500" />
                  <span>
                    {classData.enrolledStudents}/{classData.maxStudents}{' '}
                    students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-gray-500" />
                  <span>{formatDate(classData.date)}</span>
                </div>
                <Tag
                  color={
                    classData.difficulty === 'Beginner'
                      ? 'green'
                      : classData.difficulty === 'Intermediate'
                        ? 'orange'
                        : 'red'
                  }>
                  {classData.difficulty}
                </Tag>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 mb-4">
                {classData.tags.map(tag => (
                  <Tag key={tag} color="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-[280px] md:w-[320px] lg:w-[400px] h-[188px] rounded-[14px] bg-black shrink-0 overflow-hidden">
              <img
                src={classData.image}
                className="w-full h-full object-cover rounded-[14px] hover:shadow-md"
                alt="class"
              />
            </div>

            <div className="border-2 border-[#9C9C9C] rounded-xl flex flex-col gap-4 flex-1 p-6">
              <div className="flex gap-3 items-center justify-between">
                <Typography className="!text-3xl !text-[#28A745] !font-bold">
                  Rs {classData.price}
                </Typography>

                <button className="flex justify-between items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <img
                    src={BookmarkIcon}
                    alt="bookmark"
                    className="w-4 h-5 object-contain"
                  />
                  <Typography className="!text-base">Save Class</Typography>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-[#D63D00]" />
                  <Typography className="!text-lg !text-[#D63D00] !font-medium">
                    {classData.duration} - minute class
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-[#D63D00]" />
                  <Typography className="!text-lg !text-[#D63D00] !font-medium">
                    Date: {classData.date}
                  </Typography>
                </div>

                {isPurchased && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkOutlined className="text-green-600" />
                      <Typography className="!text-base !text-green-800 !font-medium">
                        Class Access Details:
                      </Typography>
                    </div>
                    <Typography className="!text-sm !text-green-700 mb-2">
                      Platform: {classData.platform}
                    </Typography>
                    <Typography className="!text-sm !text-green-700 break-all">
                      Link: {classData.meetingLink}
                    </Typography>
                  </div>
                )}
              </div>

              <Button
                size="large"
                className={`${!isPurchased ? 'bg-[#008000] hover:bg-[#006600]' : 'bg-[#DC3545] hover:bg-[#c82333]'} border-none text-white font-medium`}
                onClick={e => {
                  e.stopPropagation();
                  if (!isPurchased) {
                    return navigate('/payment', {
                      state: { paymentFor: 'liveClass' },
                    });
                  }
                  navigate('/live-classes/nvy-yjxn-gjy?pli=1');
                }}>
                {!isPurchased ? 'Book Now' : 'Join Class'}
              </Button>
            </div>
          </div>

          <Divider />

          {/* Class Details */}
          <div className="flex gap-8">
            <div className="flex flex-col gap-6 w-1/2">
              <div>
                <Typography className="!text-2xl !font-semibold mb-3">
                  Description
                </Typography>
                <Typography className="!text-base leading-relaxed">
                  {classData.description}
                </Typography>
              </div>

              <div>
                <Typography className="!text-xl !font-semibold mb-3">
                  What You'll Learn
                </Typography>
                <ul className="space-y-2">
                  {classData.learningOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <Typography className="!text-base">{outcome}</Typography>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Typography className="!text-xl !font-semibold mb-3">
                  Requirements
                </Typography>
                <ul className="space-y-2">
                  {classData.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <Typography className="!text-base">
                        {requirement}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-2 border-[#9C9C9C] rounded-xl flex flex-col gap-3 w-1/2 p-4">
              <Typography className="!text-2xl text-center !font-semibold">
                Meet your chef
              </Typography>

              <div className="flex gap-4">
                <div className="flex flex-col gap-3 w-[30%]">
                  <div className="flex gap-1 items-center">
                    <img
                      src={UserIcon}
                      alt="user"
                      className="w-5 h-5 object-contain"
                    />
                    <Typography className="!text-base !font-medium">
                      {classData.chef}
                    </Typography>
                  </div>

                  <div onClick={e => e.stopPropagation()}>
                    <Rate allowHalf defaultValue={classData.rating} disabled />
                  </div>

                  <Typography className="!text-base">
                    {classData.reviewCount} Reviews
                  </Typography>
                </div>

                <div className="flex flex-col gap-1 w-[70%]">
                  <Typography.Paragraph
                    className="!text-base"
                    ellipsis={{ rows: 3 }}>
                    {classData.description}
                  </Typography.Paragraph>

                  <Link to="/chef-detail" className="flex self-end">
                    <Typography className="!text-base !text-[#D63D00] hover:underline">
                      See More&nbsp;
                      <RightOutlined className="!text-[#D63D00] text-sm" />
                    </Typography>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="px-8 pt-8 pb-4 flex flex-col gap-4">
          <Typography className="!text-2xl !font-semibold">Reviews</Typography>
          <div className="flex gap-2">
            <img src={UserIcon} alt="user" className="w-5 h-5 object-contain" />
            <TextArea
              placeholder="Leave a review about this class..."
              autoSize={{ minRows: 3, maxRows: 3 }}
              className="!text-black"
            />
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
