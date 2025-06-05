import { Typography } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { KhaltiLogo, MasterCardLogo } from '../../assets';
import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePayment = () => {
    const isForLiveClass = location.state?.paymentFor === 'liveClass';
    if (isForLiveClass) {
      sessionStorage.setItem('isPaid', 'true');
    }
    navigate(-1);
  };

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white py-8 px-8 gap-8">
        <Typography className="!text-2xl !text-[#DC3545]">
          Subscriptions
        </Typography>
        <Typography className="!text-base">
          Please select your desired payment method.
        </Typography>
        <Typography className="!text-xl !text-[#DC3545]">
          Total Amount: NPR 500
        </Typography>
        <div className="flex gap-10 lg:gap-16 items-center justify-center">
          <div className="flex flex-col gap-2">
            <div className="w-[140px] h-[140px] md:w-[270px] md:h-[270px] bg-black rounded-md">
              <img
                src={KhaltiLogo}
                className="w-full h-full rounded-md object-contain"
              />
            </div>
            <button
              onClick={handlePayment}
              className="py-1 px-2 min-w-[120px] md:min-w-[142px] border rounded-md cursor-pointer hover:shadow-md bg-[#512A7E] flex self-center items-center justify-center">
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
              />
            </div>
            <button
              onClick={handlePayment}
              className="py-1 px-2 min-w-[120px] md:min-w-[142px] border rounded-md cursor-pointer hover:shadow-md bg-[#512A7E] flex self-center items-center justify-center">
              <Typography className="text-center !text-2xl !text-white">
                Mastercard
              </Typography>
            </button>
          </div>
        </div>
      </div>
    </AppWrapper>
  );
};

export default Payment;
