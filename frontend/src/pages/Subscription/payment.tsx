// frontend/src/pages/Subscription/payment.tsx - Updated with cooking class payment support
import { Typography, notification } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { KhaltiLogo, MasterCardLogo } from '../../assets';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUpdatePaymentStatusMutation } from '../../redux/services/cookingClassApi';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

  // Get payment details from location state
  const paymentFor = location.state?.paymentFor;
  const classId = location.state?.classId;
  const amount = location.state?.amount || 500;

  const handlePayment = async () => {
    try {
      if (paymentFor === 'liveClass' && classId) {
        // Update payment status in backend for cooking class
        await updatePaymentStatus({
          classId: Number(classId),
          payment_done: true,
        }).unwrap();

        notification.success({
          message: 'Payment Successful!',
          description:
            'Your cooking class has been booked. You can now join the class.',
        });

        // Navigate back to class detail with updated payment status
        navigate(`/classes-detail`, {
          state: {
            paymentComplete: true,
            classId: classId,
          },
          replace: true,
        });
      } else {
        // Handle subscription payment (existing logic)
        sessionStorage.setItem('isPaid', 'true');
        notification.success({
          message: 'Payment Successful!',
          description: 'Your subscription has been activated.',
        });
        navigate(-1);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      notification.error({
        message: 'Payment Failed',
        description: error?.data?.message || 'Please try again later.',
      });
    }
  };

  const getPaymentTitle = () => {
    if (paymentFor === 'liveClass') {
      return 'Cooking Class Payment';
    }
    return 'Subscriptions';
  };

  const getPaymentDescription = () => {
    if (paymentFor === 'liveClass') {
      return 'Complete your payment to book this cooking class.';
    }
    return 'Please select your desired payment method.';
  };

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white py-8 px-8 gap-8">
        <Typography className="!text-2xl !text-[#DC3545]">
          {getPaymentTitle()}
        </Typography>

        <Typography className="!text-base">
          {getPaymentDescription()}
        </Typography>

        <Typography className="!text-xl !text-[#DC3545]">
          Total Amount: NPR {amount?.toLocaleString() || '500'}
        </Typography>

        {paymentFor === 'liveClass' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Typography className="!text-blue-800 !font-medium mb-2">
              📚 What's included:
            </Typography>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Live interactive cooking session</li>
              <li>• Direct guidance from professional chef</li>
              <li>• Recipe and ingredient list provided</li>
              <li>• Recording access for 24 hours</li>
              <li>• Q&A session with the chef</li>
            </ul>
          </div>
        )}

        <Typography className="!text-base !text-[#DC3545] text-center">
          Note: The payment is Non-Refundable
        </Typography>

        <div className="flex gap-10 lg:gap-16 items-center justify-center">
          <div className="flex flex-col gap-2">
            <div className="w-[140px] h-[140px] md:w-[270px] md:h-[270px] bg-black rounded-md">
              <img
                src={KhaltiLogo}
                className="w-full h-full rounded-md object-contain"
                alt="Khalti"
              />
            </div>
            <button
              onClick={handlePayment}
              className="py-1 px-2 min-w-[120px] md:min-w-[142px] border rounded-md cursor-pointer hover:shadow-md bg-[#512A7E] flex self-center items-center justify-center transition-all duration-200 hover:bg-[#3d1f5f]">
              <Typography className="text-center !text-2xl !text-white">
                Khalti
              </Typography>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-[140px] h-[140px] md:w-[270px] md:h-[270px] bg-black rounded-md">
              <img
                src={MasterCardLogo}
                className="w-full h-full rounded-md object-contain"
                alt="Mastercard"
              />
            </div>
            <button
              onClick={handlePayment}
              className="py-1 px-2 min-w-[120px] md:min-w-[142px] border rounded-md cursor-pointer hover:shadow-md bg-[#512A7E] flex self-center items-center justify-center transition-all duration-200 hover:bg-[#3d1f5f]">
              <Typography className="text-center !text-2xl !text-white">
                Mastercard
              </Typography>
            </button>
          </div>
        </div>

        {/* Payment Security Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto">
          <Typography className="!text-sm !text-gray-700 text-center">
            🔒 Your payment is secured with industry-standard encryption. Your
            card details are never stored on our servers.
          </Typography>
        </div>
      </div>
    </AppWrapper>
  );
};

export default Payment;
