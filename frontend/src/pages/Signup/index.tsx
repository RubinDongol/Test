import { Link, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Typography,
  Select,
  Checkbox,
  notification,
} from 'antd';
import { AuthWrapper } from '../../components/layouts';
import LogoIcon from '../../assets/logo.svg';
import {
  useGetRolesQuery,
  useSignupMutation,
} from '../../redux/services/authApi';
import { useEffect } from 'react';

const { Title } = Typography;
const { Option } = Select;

export default function SignUp() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { isLoading: isRolesLoading, data } = useGetRolesQuery();

  const [signup, { isLoading, isSuccess, data: signupData }] =
    useSignupMutation();

  useEffect(() => {
    if (isSuccess) {
      notification.success({ message: 'User registered successfully.' });
      navigate('/reset-otp', {
        replace: true,
        state: {
          email: form.getFieldValue('email'),
          type: 'register',
          token: signupData.token,
        },
      });
    }
  }, [isSuccess]);

  const onFinish = (values: any) => {
    const { fullName, ...rest } = values;
    signup({ full_name: fullName, ...rest });
  };

  return (
    <AuthWrapper>
      <div className="flex items-center justify-center min-h-screen bg-gray-200 py-8">
        <div
          className="w-full max-w-sm bg-white border border-black rounded-2xl p-8 flex flex-col gap-6
                     max-h-[90vh] overflow-y-auto">
          {/* Logo */}
          <div className="flex justify-center transition-transform duration-200 ease-out hover:scale-[1.06]">
            <img src={LogoIcon} alt="Cookify" className="w-28 object-contain" />
          </div>

          {/* Header */}
          <Title level={4} className="text-center !m-0">
            Sign Up
          </Title>

          {/* Form */}
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Email */}
            <Form.Item
              label="Email address"
              name="email"
              rules={[
                { required: true, message: 'Email is required.' },
                { type: 'email', message: 'Enter a valid email.' },
              ]}>
              <Input
                placeholder="Email address"
                className="h-10 rounded text-black"
                style={{ borderColor: '#CCCCCC' }}
              />
            </Form.Item>

            {/* Full Name */}
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: 'Full name is required.' }]}>
              <Input
                placeholder="Full Name"
                className="h-10 rounded text-black"
                style={{ borderColor: '#CCCCCC' }}
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
              <Input.Password
                placeholder="Password"
                className="h-10 rounded text-black"
                style={{ borderColor: '#CCCCCC' }}
              />
            </Form.Item>

            <Form.Item
              label="Bio"
              name="bio"
              rules={[{ required: true, message: 'Bio is required.' }]}>
              <Input.TextArea
                placeholder="Bio"
                className="h-10 rounded text-black"
                style={{ borderColor: '#CCCCCC' }}
              />
            </Form.Item>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Address is required.' }]}>
              <Input
                placeholder="Address"
                className="h-10 rounded text-black"
                style={{ borderColor: '#CCCCCC' }}
              />
            </Form.Item>

            {/* Role */}
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: 'Please select a role.' }]}>
              <Select
                disabled={isRolesLoading}
                placeholder="Select role"
                className="h-10 rounded text-black"
                style={{ borderColor: '#CCCCCC' }}>
                {data?.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Forgot password link */}
            {/* <div className="flex justify-start my-2 text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div> */}

            {/* Terms & Conditions */}
            <Form.Item
              name="acceptedTOS"
              valuePropName="checked"
              className="!mb-1"
              rules={[
                {
                  validator: (_, v) =>
                    v
                      ? Promise.resolve()
                      : Promise.reject(new Error('You must accept our Terms')),
                },
              ]}>
              <Checkbox className="text-sm">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-500 hover:underline">
                  Terms & Conditions
                </Link>
              </Checkbox>
            </Form.Item>

            {/* Newsletter opt-in */}
            <Form.Item
              name="subscribeNewsletter"
              valuePropName="checked"
              className="!-mt-1 !mb-3">
              <Checkbox className="text-sm">
                Subscribe me to the Cookify newsletter
              </Checkbox>
            </Form.Item>

            {/* Sign Up button */}
            <Form.Item className="mt-2">
              <Button
                htmlType="submit"
                className="w-full h-10 transition-transform duration-200 ease-out hover:scale-[1.03]"
                disabled={isLoading}
                loading={isLoading}
                style={{
                  borderColor: '#000',
                  color: '#000',
                  backgroundColor: '#E0E0E0',
                }}>
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          {/* Already have an account */}
          <div className="text-black text-center mt-4 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
