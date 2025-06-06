// frontend/src/pages/Subscription/payment.tsx - Updated with confirm payment button
import { Typography, notification, Button, Spin } from 'antd';
import { CheckCircleOutlined, CreditCardOutlined } from '@ant-design/icons';
import { AppWrapper } from '../../components/layouts';
import { KhaltiLogo, MasterCardLogo } from '../../assets';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUpdatePaymentStatusMutation } from '../../redux/services/cookingClassApi';
import { useState } from 'react';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [updatePaymentStatus, { isLoading: isUpdatingPayment }] =
    useUpdatePaymentStatusMutation();

  // State for tracking selected payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Get payment details from location state
  const paymentFor = location.state?.paymentFor;
  const classId = location.state?.classId;
  const amount = location.state?.amount || 500;

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPaymentMethod) {
      notification.warning({
        message: 'Please select a payment method',
        description:
          'Choose either Khalti or Mastercard to proceed with payment.',
      });
      return;
    }

    try {
      setIsProcessingPayment(true);

      // Simulate payment processing delay (remove this in real implementation)
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (paymentFor === 'liveClass' && classId) {
        // Update payment status in backend for cooking class
        await updatePaymentStatus({
          classId: Number(classId),
          payment_done: true,
        }).unwrap();

        notification.success({
          message: 'Payment Successful!',
          description: `Your cooking class has been booked successfully via ${selectedPaymentMethod}. You can now join the class.`,
          duration: 4,
        });

        // Navigate back to classes page or class detail
        navigate('/classes', {
          replace: true,
        });
      } else {
        // Handle subscription payment (existing logic)
        sessionStorage.setItem('isPaid', 'true');
        notification.success({
          message: 'Payment Successful!',
          description: `Your subscription has been activated via ${selectedPaymentMethod}.`,
          duration: 4,
        });
        navigate(-1);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      notification.error({
        message: 'Payment Failed',
        description:
          error?.data?.message ||
          'Payment could not be processed. Please try again.',
        duration: 4,
      });
    } finally {
      setIsProcessingPayment(false);
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

  const isProcessing = isProcessingPayment || isUpdatingPayment;

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

        <Typography className="!text-base !text-center">
          Select your preferred payment method:
        </Typography>

        {/* Payment Methods Selection */}
        <div className="flex gap-10 lg:gap-16 items-center justify-center">
          {/* Khalti Payment Option */}
          <div className="flex flex-col gap-2">
            <div
              className={`w-[140px] h-[140px] md:w-[270px] md:h-[270px] bg-black rounded-md cursor-pointer transition-all duration-200 ${
                selectedPaymentMethod === 'Khalti'
                  ? 'ring-4 ring-[#512A7E] ring-opacity-50 transform scale-105'
                  : 'hover:scale-105'
              }`}
              onClick={() => handlePaymentMethodSelect('Khalti')}>
              <img
                src={KhaltiLogo}
                className="w-full h-full rounded-md object-contain"
                alt="Khalti"
              />
              {selectedPaymentMethod === 'Khalti' && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <CheckCircleOutlined className="text-white text-lg" />
                </div>
              )}
            </div>
            <button
              onClick={() => handlePaymentMethodSelect('Khalti')}
              className={`py-2 px-4 min-w-[120px] md:min-w-[142px] border rounded-md cursor-pointer transition-all duration-200 flex self-center items-center justify-center ${
                selectedPaymentMethod === 'Khalti'
                  ? 'bg-[#512A7E] border-[#512A7E] text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-[#512A7E] hover:text-white'
              }`}>
              <Typography
                className={`text-center !text-xl ${
                  selectedPaymentMethod === 'Khalti'
                    ? '!text-white'
                    : '!text-gray-700'
                }`}>
                Khalti
              </Typography>
            </button>
          </div>

          {/* Mastercard Payment Option */}
          <div className="flex flex-col gap-2">
            <div
              className={`w-[140px] h-[140px] md:w-[270px] md:h-[270px] bg-black rounded-md cursor-pointer transition-all duration-200 relative ${
                selectedPaymentMethod === 'Mastercard'
                  ? 'ring-4 ring-[#512A7E] ring-opacity-50 transform scale-105'
                  : 'hover:scale-105'
              }`}
              onClick={() => handlePaymentMethodSelect('Mastercard')}>
              <img
                src={MasterCardLogo}
                className="w-full h-full rounded-md object-contain"
                alt="Mastercard"
              />
              {selectedPaymentMethod === 'Mastercard' && (
                <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                  <CheckCircleOutlined className="text-white text-lg" />
                </div>
              )}
            </div>
            <button
              onClick={() => handlePaymentMethodSelect('Mastercard')}
              className={`py-2 px-4 min-w-[120px] md:min-w-[142px] border rounded-md cursor-pointer transition-all duration-200 flex self-center items-center justify-center ${
                selectedPaymentMethod === 'Mastercard'
                  ? 'bg-[#512A7E] border-[#512A7E] text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-[#512A7E] hover:text-white'
              }`}>
              <Typography
                className={`text-center !text-xl ${
                  selectedPaymentMethod === 'Mastercard'
                    ? '!text-white'
                    : '!text-gray-700'
                }`}>
                Mastercard
              </Typography>
            </button>
          </div>
        </div>

        {/* Confirm Payment Button */}
        <div className="flex justify-center mt-8">
          <Button
            type="primary"
            size="large"
            icon={isProcessing ? <Spin /> : <CreditCardOutlined />}
            onClick={handleConfirmPayment}
            loading={isProcessing}
            disabled={!selectedPaymentMethod || isProcessing}
            className={`!px-12 !py-6 !h-auto !text-xl !font-semibold transition-all duration-200 ${
              selectedPaymentMethod && !isProcessing
                ? '!bg-[#28A745] !border-[#28A745] hover:!bg-[#218838] hover:!border-[#218838]'
                : '!bg-gray-400 !border-gray-400'
            }`}>
            {isProcessing ? (
              <span className="flex items-center gap-2">
                Processing Payment...
              </span>
            ) : (
              `Confirm Payment - NPR ${amount?.toLocaleString() || '500'}`
            )}
          </Button>
        </div>

        {/* Selected Payment Method Display */}
        {selectedPaymentMethod && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2">
              <CheckCircleOutlined className="text-green-600" />
              <Typography className="!text-green-800 !font-medium">
                Selected: {selectedPaymentMethod}
              </Typography>
            </div>
          </div>
        )}

        <Typography className="!text-base !text-[#DC3545] text-center">
          Note: The payment is Non-Refundable
        </Typography>

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
