import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, notification } from 'antd';
import { AuthWrapper } from '../../components/layouts';
import { LogoIcon } from '../../assets';
import { useEffect } from 'react';
import { useForgotPasswordMutation } from '../../redux/services/authApi';

const { Title } = Typography;

export default function ForgotPassword() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [forgotPassword, { isLoading, isSuccess }] =
    useForgotPasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      notification.success({ message: 'OTP has been sent.' });
      navigate('/reset-otp', {
        replace: true,
        state: {
          email: form.getFieldValue('email'),
          type: 'forgot',
        },
      });
    }
  }, [isSuccess]);

  const onFinish = (values: any) => {
    const { email } = values;
    forgotPassword(email);
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
            Forgot Password
          </Title>

          {/* Form */}
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Email */}
            <Form.Item
              label="Email address"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email.' },
                { type: 'email', message: 'Please enter a valid email.' },
              ]}>
              <Input
                placeholder="Email address"
                className="h-10 rounded text-black"
              />
            </Form.Item>

            {/* Submit */}
            <Form.Item className="mt-2">
              <Button
                htmlType="submit"
                disabled={isLoading}
                loading={isLoading}
                className="w-full h-10 transition-transform duration-200 ease-out hover:scale-[1.03]">
                Send Reset Code
              </Button>
            </Form.Item>
          </Form>

          {/* Back to Sign In */}
          <div className="text-center mt-4 transition-transform duration-200 ease-out hover:scale-[1.03] text-sm">
            <Link to="/login" className="text-blue-500">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
