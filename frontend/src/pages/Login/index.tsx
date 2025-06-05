import { Link } from 'react-router-dom';
import { Form, Input, Button, Typography, notification } from 'antd';
import { AuthWrapper } from '../../components/layouts';
import { LogoIcon } from '../../assets';
import { useEffect } from 'react';
import { useLoginMutation } from '../../redux/services/authApi';

const { Title } = Typography;

export default function Login() {
  const [form] = Form.useForm();

  const [login, { isLoading, isSuccess }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      notification.success({ message: 'Login successful.' });
    }
  }, [isSuccess]);

  const onFinish = (values: any) => {
    const { email, password } = values;
    login({ email, password });
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

          {/* Header */}
          <Title level={4} className="text-center !m-0">
            Sign In
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

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password.' },
                {
                  pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
                  message:
                    'Must contain an uppercase letter, a number, and a symbol.',
                },
              ]}>
              <Input.Password placeholder="Password" className="h-10 rounded" />
            </Form.Item>

            {/* Forgot link */}
            <div className="flex justify-start my-5 transition-transform duration-200 ease-out hover:scale-[1.03]">
              <Link to="/forgot-password" className="text-blue-500">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Form.Item className="mt-2">
              <Button
                htmlType="submit"
                disabled={isLoading}
                loading={isLoading}
                className="w-full h-10 transition-transform duration-200 ease-out hover:scale-[1.03]">
                Sign in
              </Button>
            </Form.Item>
          </Form>

          {/* Signup link */}
          <div className="text-center transition-transform duration-200 ease-out hover:scale-[1.03]">
            <Link to="/signup" className="text-blue-500">
              Create a Cookify Account
            </Link>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
