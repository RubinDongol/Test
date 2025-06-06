// frontend/src/components/classes/ClassCard.tsx - Updated with payment logic
import { RightOutlined } from '@ant-design/icons';
import { Rate, Typography, Tag, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserNameWithIcon } from '../common';

interface ClassCardProps {
  data: {
    id: string;
    title: string;
    price: number;
    chef: string;
    description: string;
    image: string;
    duration?: number;
    class_date?: string;
    class_time?: string;
    max_students?: number;
    difficulty?: string;
    live_link?: string;
    payment_done?: boolean;
    stars?: number;
    review_count?: number;
  };
}

const ClassCard = ({ data }: ClassCardProps) => {
  const navigate = useNavigate();
  const {
    id,
    title,
    price,
    chef,
    description,
    image,
    duration = 90,
    class_date = 'Thu, Apr 24th',
    class_time = '2:00pm',
    max_students = 20,
    difficulty = 'Intermediate',
    live_link,
    payment_done = false,
    stars = 4,
    review_count = 0,
  } = data;

  const formatDate = (dateString: string, timeString: string) => {
    try {
      if (dateString && timeString) {
        const date = new Date(`${dateString}T${timeString}`);
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });
      }
    } catch (error) {
      console.log('Date formatting error:', error);
    }
    return `${class_date}, ${class_time}`;
  };

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return 'green';
      case 'medium':
        return 'orange';
      case 'hard':
        return 'red';
      default:
        return 'blue';
    }
  };

  const handleJoinClass = () => {
    if (payment_done && live_link) {
      // Extract the room ID from the live link
      const roomId = live_link.split('/').pop()?.split('?')[0];
      if (roomId) {
        navigate(`/live-classes/${roomId}`);
      } else {
        navigate(live_link);
      }
    } else {
      // Navigate to payment if not paid yet
      navigate('/payment', {
        state: {
          paymentFor: 'liveClass',
          classId: id,
          amount: price,
        },
      });
    }
  };

  return (
    <div className="border border-black rounded-xl flex">
      <div className="w-[286px] min-h-[286px] bg-black rounded-l-xl overflow-hidden">
        <img
          src={image}
          alt="class"
          className="w-full h-full rounded-l-xl object-cover"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.src =
              'https://images.pexels.com/photos/15076692/pexels-photo-15076692/free-photo-of-burger.jpeg';
          }}
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-col border-b border-b-[#A6A3A3] px-4 pt-8 pb-4 gap-4">
          <div className="flex justify-between gap-6 items-start">
            <div className="flex-1">
              <Typography className="!text-[32px] mb-2">{title}</Typography>
              <div className="flex items-center gap-2 mb-2">
                <Tag color={getDifficultyColor(difficulty)}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </Tag>
                <Typography className="!text-sm text-gray-600">
                  {duration} minutes
                </Typography>
                <Typography className="!text-sm text-gray-600">
                  Max {max_students} students
                </Typography>
              </div>
            </div>
            <Typography className="!text-base !text-[#28A745] font-bold">
              Rs {price.toLocaleString()}
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
            state={{
              id,
              title,
              price,
              chef,
              description,
              image,
              duration,
              class_date,
              class_time,
              max_students,
              difficulty,
              live_link,
              payment_done,
              stars,
              review_count,
            }}
            className="flex self-end">
            <Typography className="!text-base !text-[#D63D00]">
              See More <RightOutlined className="!text-[#D63D00] text-sm" />
            </Typography>
          </Link>
        </div>

        <div className="flex p-4 gap-6 justify-between items-center">
          <div className="flex flex-col gap-1">
            <UserNameWithIcon userName={chef} disabled />
            <div onClick={e => e.stopPropagation()}>
              <Rate allowHalf value={stars} disabled />
              {review_count > 0 && (
                <Typography className="!text-sm text-gray-600 ml-2">
                  ({review_count} reviews)
                </Typography>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Typography className="!text-base">
              Date: {formatDate(class_date || '', class_time || '')}
            </Typography>

            {/* Payment Status and Join Button */}
            {payment_done ? (
              <div className="flex flex-col items-end gap-1">
                <Typography className="!text-sm !text-green-600 font-medium">
                  ✓ Payment Complete
                </Typography>
                <Button
                  type="primary"
                  onClick={handleJoinClass}
                  className="!bg-[#28A745] !border-[#28A745] hover:!bg-[#218838]">
                  Join Class
                </Button>
              </div>
            ) : (
              <Button
                type="primary"
                onClick={handleJoinClass}
                className="!bg-[#DC3545] !border-[#DC3545] hover:!bg-[#c82333]">
                Book Now - Rs {price.toLocaleString()}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
