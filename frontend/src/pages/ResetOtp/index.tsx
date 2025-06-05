import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, notification } from 'antd';
import { AuthWrapper } from '../../components/layouts';
import LogoIcon from '../../assets/logo.svg';
import {
  useResendOtpMutation,
  useVerifyForgotOtpMutation,
  useVerifyOtpMutation,
} from '../../redux/services/authApi';
import { useAppDispatch } from '../../redux/hook';
import { saveAccessToken } from '../../redux/reducers/auth';

const { Title, Text } = Typography;

// In a real app you’d pull this from state or query params
// const maskedEmail = 'rubi***@gmail.com';
let otpArray: string[] = [];

export default function ResetOTP() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const location = useLocation();
  const email = location.state?.email ?? '';
  const isForgotPassword = location.state?.type === 'forgot';
  const token = location.state?.token;
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [verifyOtp, { isLoading, isSuccess }] = useVerifyOtpMutation();
  const [
    verifyForgotOtp,
    { isLoading: isForgotLoading, isSuccess: isForgotSuccess },
  ] = useVerifyForgotOtpMutation();
  const [
    resendOtp,
    { isLoading: isResendOtpLoading, isSuccess: isResendOtpSuccess },
  ] = useResendOtpMutation();

  useEffect(() => {
    if (isSuccess || isForgotSuccess) {
      notification.success({ message: 'OTP verified.' });
      if (isForgotPassword) {
        navigate('/confirmation-password', {
          replace: true,
          state: {
            email,
          },
        });
      } else {
        dispatch(saveAccessToken(token));
      }
    }
  }, [isSuccess, isForgotSuccess]);

  useEffect(() => {
    if (isResendOtpSuccess) {
      notification.success({ message: 'OTP has been resent.' });
    }
  }, [isResendOtpSuccess]);

  const onFinish = async () => {
    if (!email) {
      navigate(-1);
    }
    const code = otpArray.join('');
    if (!isForgotPassword) {
      await verifyOtp({ email, otp: code }).unwrap();
      navigate('/login');
      return;
    }
    verifyForgotOtp({ email, otp: code });
  };

  return (
    <AuthWrapper>
      <div className="flex items-center justify-center h-full bg-gray-200">
        <div className="w-full max-w-sm bg-white border border-black rounded-2xl p-8 flex flex-col gap-6">
          {/* Logo */}
          <div className="flex justify-center transition-transform duration-200 ease-out hover:scale-[1.06]">
            <img src={LogoIcon} alt="Cookify" className="w-28 object-contain" />
          </div>

          {/* Header */}
          <Title level={4} className="text-center !m-0">
            Check your E-mail
          </Title>
          <Text className="text-center block">
            Enter the 6-digit security code sent to {email}.
          </Text>

          {/* OTP Form */}
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item>
              <div className="flex justify-center gap-2">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Form.Item
                    name={`digit${idx}`}
                    key={idx}
                    rules={[{ required: true, message: '' }]}>
                    <Input
                      maxLength={1}
                      ref={el => ((inputRefs.current[idx] as any) = el) as any}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 4,
                        borderColor: '#CCCCCC',
                        textAlign: 'center',
                      }}
                      onChange={e => {
                        const val = e.target.value;
                        otpArray[idx] = val;
                        if (val.length === 1 && idx < 5) {
                          inputRefs.current[idx + 1]?.focus();
                        }
                      }}
                      onKeyDown={e => {
                        const val = (e.target as HTMLInputElement).value;
                        if (
                          (e.key === 'Backspace' || e.key === 'Delete') &&
                          val === '' &&
                          idx > 0
                        ) {
                          e.preventDefault();
                          inputRefs.current[idx - 1]?.focus();
                        }
                      }}
                    />
                  </Form.Item>
                ))}
              </div>
            </Form.Item>

            {/* Resend link */}
            <button
              disabled={isResendOtpLoading}
              onClick={() => resendOtp(email)}
              className="flex text-blue-500 cursor-pointer justify-start my-4 transition-transform duration-200 ease-out hover:scale-[1.03] text-sm">
              Resend Code
            </button>

            {/* Continue button */}
            <Form.Item className="mt-2">
              <Button
                htmlType="submit"
                disabled={isLoading || isForgotLoading}
                loading={isLoading || isForgotLoading}
                className="w-full h-10 transition-transform duration-200 ease-out hover:scale-[1.03]">
                Continue
              </Button>
            </Form.Item>
          </Form>

          {/* Back to Sign In */}
          <div className="text-center mt-4 transition-transform duration-200 ease-out hover:scale-[1.03]">
            <Link to="/login" className="text-blue-500 text-sm">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
