import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, notification } from 'antd';
import { AuthWrapper } from '../../components/layouts';
import LogoIcon from '../../assets/logo.svg';
import { useEffect } from 'react';
import { useResetPasswordMutation } from '../../redux/services/authApi';

const { Title, Text } = Typography;

export default function ResetPassword() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state?.email ?? '';

  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      notification.success({ message: 'Password changed successfully.' });
      navigate('/login', { replace: true });
    }
  }, [isSuccess]);

  const onFinish = (values: any) => {
    const { newPassword } = values;
    resetPassword({ email, newPassword });
  };

  return (
    <AuthWrapper>
      <div className="flex items-center justify-center h-full bg-gray-200">
        <div className="w-full max-w-sm bg-white border border-black rounded-2xl p-8 flex flex-col gap-6">
          {/* Logo */}
          <div className="flex justify-center">
            <img
              src={LogoIcon}
              alt="Cookify"
              className="w-28 object-contain transition-transform duration-200 ease-out hover:scale-[1.06]"
            />
          </div>

          {/* Main title */}
          <Title level={4} className="text-center !m-0">
            Reset your password
          </Title>

          {/* Subheading */}
          <Text className="block">Enter new password</Text>

          {/* Form */}
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* New password */}
            <Form.Item
              label="New password"
              name="newPassword"
              rules={[
                { required: true, message: 'Please enter a new password.' },
                {
                  pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
                  message:
                    'Must contain an uppercase letter, a number, and a symbol.',
                },
              ]}>
              <Input.Password
                placeholder="New password"
                className="h-10 rounded text-black"
                style={{ borderColor: '#CCCCCC' }}
              />
            </Form.Item>

            {/* Confirm password */}
            <Form.Item
              label="Confirm password"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your password.' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match.'));
                  },
                }),
              ]}>
              <Input.Password
                placeholder="Confirm password"
                className="h-10 rounded text-black"
                style={{ borderColor: '#CCCCCC' }}
              />
            </Form.Item>

            {/* Continue button */}
            <Form.Item className="mt-2">
              <Button
                htmlType="submit"
                disabled={isLoading}
                loading={isLoading}
                className="w-full h-10 transition-transform duration-200 ease-out hover:scale-[1.03]">
                Continue
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </AuthWrapper>
  );
}
