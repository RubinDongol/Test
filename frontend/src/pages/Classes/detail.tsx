// frontend/src/pages/Classes/detail.tsx - Updated with API integration
import {
  Rate,
  Typography,
  Tag,
  Divider,
  Button,
  notification,
  Spin,
} from 'antd';
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
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { USER_REVIEWS } from '../../utils/data';
import {
  useGetCookingClassByIdQuery,
  useRateCookingClassMutation,
  useUpdatePaymentStatusMutation,
} from '../../redux/services/cookingClassApi';

const ClassDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { classId } = useParams<{ classId: string }>();
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Get class data from location state (for navigation from ClassCard) or fetch from API
  const locationData = location.state;
  const classIdFromLocation = locationData?.id;
  const finalClassId = classId || classIdFromLocation;

  const {
    data: classData,
    isLoading,
    error,
    refetch,
  } = useGetCookingClassByIdQuery(Number(finalClassId), {
    skip: !finalClassId,
  });

  const [rateClass] = useRateCookingClassMutation();
  const [updatePayment] = useUpdatePaymentStatusMutation();

  // Use API data if available, otherwise fallback to location state
  const displayData = classData || locationData;

  useEffect(() => {
    // Check if payment was completed in session storage
    const isPaid = sessionStorage.getItem('isPaid');
    if (isPaid === 'true' && finalClassId) {
      // Update payment status in backend
      updatePaymentStatus();
      sessionStorage.removeItem('isPaid'); // Clean up
    }
  }, [finalClassId]);

  const updatePaymentStatus = async () => {
    try {
      await updatePayment({
        classId: Number(finalClassId),
        payment_done: true,
      }).unwrap();

      notification.success({
        message: 'Payment Confirmed!',
        description: 'You can now join the cooking class.',
      });

      refetch(); // Refresh the class data
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleRating = async (rating: number) => {
    if (!finalClassId) return;

    try {
      await rateClass({
        classId: Number(finalClassId),
        rating,
        comment: reviewText,
      }).unwrap();

      setUserRating(rating);
      notification.success({ message: 'Rating submitted successfully!' });
      refetch();
    } catch (error) {
      notification.error({ message: 'Failed to submit rating' });
    }
  };

  const handleJoinClass = () => {
    if (!displayData) return;

    if (displayData.payment_done && displayData.live_link) {
      // Extract room ID from live link and navigate
      const roomId = displayData.live_link.split('/').pop()?.split('?')[0];
      if (roomId) {
        navigate(`/live-classes/${roomId}`);
      } else {
        window.open(displayData.live_link, '_blank');
      }
    } else {
      // Navigate to payment
      navigate('/payment', {
        state: {
          paymentFor: 'liveClass',
          classId: finalClassId,
          amount: displayData.price,
        },
      });
    }
  };

  if (isLoading) {
    return (
      <AppWrapper>
        <div className="h-full flex justify-center items-center">
          <div className="text-center">
            <Spin size="large" />
            <Typography className="mt-4">Loading class details...</Typography>
          </div>
        </div>
      </AppWrapper>
    );
  }

  if (error || !displayData) {
    return (
      <AppWrapper>
        <div className="h-full flex justify-center items-center">
          <Typography className="text-red-500">
            Class not found or error loading class details.
          </Typography>
        </div>
      </AppWrapper>
    );
  }

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
    return displayData.class_date && displayData.class_time
      ? `${displayData.class_date}, ${displayData.class_time}`
      : 'Thu, Apr 24th, 2:00pm';
  };

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
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

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white flex-1 overflow-y-scroll">
        <div className="flex flex-col py-8 px-8 gap-8 border-b border-black">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <Typography className="!text-3xl !font-bold mb-2">
                {displayData.title}
              </Typography>
              <Typography className="!text-base text-gray-600 mb-4">
                Recipe courtesy of{' '}
                <span className="!text-blue-400">{displayData.chef}</span>
              </Typography>

              {/* Class Meta Info */}
              <div className="flex gap-6 items-center mb-4">
                <div className="flex items-center gap-2">
                  <ClockCircleOutlined className="text-gray-500" />
                  <span>{displayData.duration || 90} minute class</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserOutlined className="text-gray-500" />
                  <span>Max {displayData.max_students || 20} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-gray-500" />
                  <span>
                    {formatDate(displayData.class_date, displayData.class_time)}
                  </span>
                </div>
                <Tag color={getDifficultyColor(displayData.difficulty)}>
                  {displayData.difficulty?.charAt(0).toUpperCase() +
                    displayData.difficulty?.slice(1) || 'Intermediate'}
                </Tag>
              </div>

              {/* Payment Status Indicator */}
              {displayData.payment_done && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Typography className="!text-green-800 !font-medium">
                    ✓ Payment Complete - You can join this class
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="w-[280px] md:w-[320px] lg:w-[400px] h-[188px] rounded-[14px] bg-black shrink-0 overflow-hidden">
              <img
                src={
                  displayData.image ||
                  'https://images.pexels.com/photos/15076692/pexels-photo-15076692/free-photo-of-burger.jpeg'
                }
                className="w-full h-full object-cover rounded-[14px] hover:shadow-md"
                alt="class"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    'https://images.pexels.com/photos/15076692/pexels-photo-15076692/free-photo-of-burger.jpeg';
                }}
              />
            </div>

            <div className="border-2 border-[#9C9C9C] rounded-xl flex flex-col gap-4 flex-1 p-6">
              <div className="flex gap-3 items-center justify-between">
                <Typography className="!text-3xl !text-[#28A745] !font-bold">
                  Rs {displayData.price?.toLocaleString() || '3000'}
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
                    {displayData.duration || 90} - minute class
                  </Typography>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarOutlined className="text-[#D63D00]" />
                  <Typography className="!text-lg !text-[#D63D00] !font-medium">
                    Date:{' '}
                    {formatDate(displayData.class_date, displayData.class_time)}
                  </Typography>
                </div>

                {/* Live Link Display - Only show if payment is done */}
                {displayData.payment_done && displayData.live_link && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkOutlined className="text-green-600" />
                      <Typography className="!text-base !text-green-800 !font-medium">
                        Class Access Details:
                      </Typography>
                    </div>
                    <Typography className="!text-sm !text-green-700 mb-2">
                      Platform: Live Video Call
                    </Typography>
                    <Typography className="!text-sm !text-green-700 break-all">
                      Ready to join: {displayData.live_link}
                    </Typography>
                  </div>
                )}
              </div>

              <Button
                size="large"
                className={`${!displayData.payment_done ? 'bg-[#008000] hover:bg-[#006600]' : 'bg-[#DC3545] hover:bg-[#c82333]'} border-none text-white font-medium`}
                onClick={handleJoinClass}>
                {!displayData.payment_done ? 'Book Now' : 'Join Class'}
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
                  {displayData.description}
                </Typography>
              </div>

              {/* What You'll Learn */}
              {displayData.learn && displayData.learn.length > 0 && (
                <div>
                  <Typography className="!text-xl !font-semibold mb-3">
                    What You'll Learn
                  </Typography>
                  <ul className="space-y-2">
                    {displayData.learn.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <Typography className="!text-base">{item}</Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {displayData.requirements &&
                displayData.requirements.length > 0 && (
                  <div>
                    <Typography className="!text-xl !font-semibold mb-3">
                      Requirements
                    </Typography>
                    <ul className="space-y-2">
                      {displayData.requirements.map(
                        (requirement: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <Typography className="!text-base">
                              {requirement}
                            </Typography>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
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
                      {displayData.chef || displayData.full_name}
                    </Typography>
                  </div>

                  <div onClick={e => e.stopPropagation()}>
                    <Rate allowHalf value={displayData.stars || 4.5} disabled />
                  </div>

                  <Typography className="!text-base">
                    {displayData.review_count || 0} Reviews
                  </Typography>
                </div>

                <div className="flex flex-col gap-1 w-[70%]">
                  <Typography.Paragraph
                    className="!text-base"
                    ellipsis={{ rows: 3 }}>
                    {displayData.description}
                  </Typography.Paragraph>

                  <Link to="/chef-detail" className="flex self-end">
                    <Typography className="!text-base !text-[#D63D00] hover:underline">
                      See More&nbsp;
                      <RightOutlined className="!text-[#D63D00] text-sm" />
                    </Typography>
                  </Link>
                </div>
              </div>

              {/* Chef Notes */}
              {displayData.chef_notes && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <Typography className="!text-sm !font-medium mb-2">
                    Chef's Notes:
                  </Typography>
                  <Typography className="!text-sm">
                    {displayData.chef_notes}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="px-8 pt-8 pb-4 flex flex-col gap-4">
          <Typography className="!text-2xl !font-semibold">Reviews</Typography>
          <div className="flex gap-2">
            <img src={UserIcon} alt="user" className="w-5 h-5 object-contain" />
            <div className="flex-1">
              <TextArea
                placeholder="Leave a review about this class..."
                autoSize={{ minRows: 3, maxRows: 3 }}
                className="!text-black mb-2"
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <Rate
                  value={userRating}
                  onChange={setUserRating}
                  className="text-sm"
                />
                <Button
                  type="primary"
                  onClick={() => handleRating(userRating)}
                  disabled={userRating === 0}
                  className="!bg-[#DC3545] !border-[#DC3545]">
                  Submit Review
                </Button>
              </div>
            </div>
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
