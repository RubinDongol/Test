// frontend/src/pages/Classes/index.tsx - Updated with real API
import { Typography, Button, notification, Spin, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { AppWrapper } from '../../components/layouts';
import { ClassCard } from '../../components/classes';
import AddClassModal from '../../components/classes/AddClassModal';
import { useAppSelector } from '../../redux/hook';
import {
  useGetAllCookingClassesQuery,
  useCreateCookingClassMutation,
} from '../../redux/services/cookingClassApi';

const Classes = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { user } = useAppSelector(state => state.auth);
  const {
    data: classes = [],
    isLoading,
    error,
    refetch,
  } = useGetAllCookingClassesQuery();
  const [createClass, { isLoading: isCreatingClass }] =
    useCreateCookingClassMutation();

  // Check if user is a chef (role_id === 3)
  const isChef = user.role_id === 3;

  const handleAddClass = async () => {
    // The modal now handles the creation directly
    // Just refresh the data after successful creation
    refetch();
  };

  if (isLoading) {
    return (
      <AppWrapper>
        <div className="h-full flex justify-center items-center">
          <div className="text-center">
            <Spin size="large" />
            <Typography className="mt-4 text-lg">Loading classes...</Typography>
          </div>
        </div>
      </AppWrapper>
    );
  }

  if (error) {
    return (
      <AppWrapper>
        <div className="h-full flex justify-center items-center">
          <Alert
            message="Error Loading Classes"
            description="Unable to fetch cooking classes. Please try again later."
            type="error"
            showIcon
          />
        </div>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <>
        <div className="h-full flex flex-col border border-black bg-white py-8 px-8 gap-8 flex-1 overflow-y-scroll">
          <div className="flex justify-between items-center">
            <div>
              <Typography className="!text-2xl !text-[#DC3545]">
                Classes
              </Typography>
              <Typography className="!text-base mt-2">
                Book the best online cooking session taught by world-class
                chefs. Fully Interactive!
              </Typography>
            </div>
            {isChef && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => setIsModalVisible(true)}
                className="!bg-[#DC3545] !border-[#DC3545] hover:!bg-[#c82333] hover:!border-[#c82333]">
                Create Class
              </Button>
            )}
          </div>

          {classes.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <Typography className="text-gray-500 text-lg">
                No cooking classes available yet.
              </Typography>
              {isChef && (
                <Typography className="text-gray-600">
                  Be the first chef to create a cooking class!
                </Typography>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-8 items-center justify-center mx-auto max-w-[970px]">
              {classes.map(classItem => (
                <ApiClassCard key={classItem.id} data={classItem} />
              ))}
            </div>
          )}
        </div>

        {/* Add Class Modal */}
        <AddClassModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleAddClass}
          loading={isCreatingClass}
        />
      </>
    </AppWrapper>
  );
};

// Component to transform API data to ClassCard format
const ApiClassCard = ({ data }: { data: any }) => {
  const transformedData = {
    id: data.id.toString(),
    title: data.title,
    price: data.price,
    chef: data.full_name,
    description: data.description,
    image:
      data.image ||
      'https://images.pexels.com/photos/15076692/pexels-photo-15076692/free-photo-of-burger.jpeg',
    duration: data.duration,
    class_date: data.class_date,
    class_time: data.class_time,
    max_students: data.max_students,
    difficulty: data.difficulty,
    live_link: data.live_link,
    payment_done: data.payment_done,
    stars: data.stars || 0,
    review_count: data.review_count || 0,
  };

  return <ClassCard data={transformedData} />;
};

export default Classes;
