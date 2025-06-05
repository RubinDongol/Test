// frontend/src/pages/Classes/index.tsx
import { Typography, Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { AppWrapper } from '../../components/layouts';
import { ClassCard } from '../../components/classes';
import AddClassModal from '../../components/classes/AddClassModal.tsx';
import { useAppSelector } from '../../redux/hook.ts';

const Classes = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAppSelector(state => state.auth);

  // Mock function to check if user is a chef
  const isChef = true; // This should come from your auth state/user role

  const handleAddClass = async (classData: any) => {
    setIsLoading(true);
    try {
      // Here you would typically send the data to your backend
      console.log('Class Data:', classData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      notification.success({
        message: 'Class Created Successfully!',
        description: `${classData.title} has been scheduled and is now available for booking.`,
      });

      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Error Creating Class',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            {user.role_id === 3 && isChef && (
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

          <div className="flex flex-col gap-8 items-center justify-center mx-auto max-w-[970px]">
            {CLASS_DATA.map(item => (
              <ClassCard key={item.id} data={item} />
            ))}
          </div>
        </div>

        {/* Add Class Modal */}
        <AddClassModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSubmit={handleAddClass}
          loading={isLoading}
        />
      </>
    </AppWrapper>
  );
};

export default Classes;

const CLASS_DATA = [
  {
    id: '1',
    title: 'Italian Risotto and Gelato',
    price: 3000,
    chef: 'Chef Maria',
    description:
      'Learn to create Italian Risotto and Gelato from scratch with Chef Maria live from Rome.',
    image:
      'https://images.pexels.com/photos/15076692/pexels-photo-15076692/free-photo-of-burger.jpeg',
  },
  {
    id: '2',
    title: 'French Pizza',
    price: 1200,
    chef: 'Chef Raj',
    description:
      'Master the art of French-Style Pizza making with Chef Raj. Authentic and delicious!',
    image:
      'https://images.pexels.com/photos/2232/vegetables-italian-pizza-restaurant.jpg',
  },
];

export type ClassData = (typeof CLASS_DATA)[0];
