// frontend/src/components/home/RecommendedProfile.tsx
import { Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserIcon } from '../../assets';
import { useAppSelector } from '../../redux/hook';
import { useState, useEffect } from 'react';

const RecommendedProfile = () => {
  const navigate = useNavigate();
  const { user: currentUser, accessToken } = useAppSelector(
    state => state.auth,
  );
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        if (!accessToken) {
          // Fallback to mock data if no token
          setUsers(
            MOCK_USERS.filter(user => user.id !== currentUser?.id).slice(0, 5),
          );
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8080/api/users/all', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        // Filter out current user and limit to first 5 users
        const filteredUsers = data
          .filter((user: any) => user.id !== currentUser?.id)
          .slice(0, 5);
        setUsers(filteredUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        // Fallback to mock data if API fails
        setUsers(
          MOCK_USERS.filter(user => user.id !== currentUser?.id).slice(0, 5),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [accessToken, currentUser?.id]);

  const handleView = (userId: number, userName: string) => {
    navigate(`/user-profile/${userId}`, {
      state: {
        name: userName,
        userId: userId,
      },
    });
  };

  if (loading) {
    return (
      <div className="w-[215px] bg-white border !border-black !rounded-2xl py-8 px-4 flex flex-col gap-6">
        <Typography className="!text-base text-center">
          Recommended Profile
        </Typography>
        <div className="flex justify-center items-center py-8">
          <Spin size="small" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[215px] bg-white border !border-black !rounded-2xl py-8 px-4 flex flex-col gap-6">
      <Typography className="!text-base text-center">
        Recommended Profile
      </Typography>
      <div className="overflow-y-auto flex-1 space-y-6">
        {users.map(user => (
          <div
            className="flex gap-1 items-center justify-between"
            key={user.id}>
            <div className="flex gap-1 items-center flex-1 min-w-0">
              <img
                src={user.photo || UserIcon}
                alt={user.full_name}
                className="w-5 h-5 object-cover rounded-full shrink-0"
                onError={e => {
                  // Fallback to default icon if image fails to load
                  (e.target as HTMLImageElement).src = UserIcon;
                }}
              />
              <Typography
                className="!text-base truncate"
                title={user.full_name}>
                {user.full_name}
              </Typography>
            </div>
            <button
              onClick={() => handleView(user.id, user.full_name)}
              className="bg-black rounded-full px-2 py-1 min-w-[52px] cursor-pointer hover:bg-gray-800 transition-colors">
              <Typography className="!text-xs !text-white text-center">
                View
              </Typography>
            </button>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-4">
            <Typography className="!text-sm text-gray-500">
              No users found
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendedProfile;

// Mock data for now - you can replace this with real API data later
const MOCK_USERS = [
  { id: 2, full_name: 'John Doe', photo: null },
  { id: 3, full_name: 'Jane Smith', photo: null },
  { id: 4, full_name: 'Michael Scott', photo: null },
  { id: 5, full_name: 'David Lee', photo: null },
  { id: 6, full_name: 'Emily Clark', photo: null },
  { id: 7, full_name: 'Chef Maria', photo: null },
  { id: 8, full_name: 'Chef Raj', photo: null },
  { id: 9, full_name: 'Sarah Johnson', photo: null },
];
