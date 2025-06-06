// frontend/src/components/header/AnnouncementPopover.tsx
import { Divider, Popover, Typography, Spin } from 'antd';
import { MikeIcon } from '../../assets';
import { useAppSelector } from '../../redux/hook';
import { useState, useEffect } from 'react';

interface Notification {
  like_id: number;
  liked_at: string;
  user_id: number;
  full_name: string;
  photo: string | null;
  post_id: number;
  content: string;
  type: 'like';
}

const AnnouncementPopover = () => {
  const { accessToken } = useAppSelector(state => state.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        if (!accessToken) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await fetch(
          'http://localhost:8080/api/notifications',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications');
        // Fallback to mock data
        setNotifications(MOCK_NOTIFICATIONS);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [accessToken]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const truncateContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const content = (
    <div className="bg-white items-center flex flex-col rounded-[20px] max-w-[300px]">
      {loading ? (
        <div className="py-8 px-4 flex justify-center items-center">
          <Spin size="small" />
          <Typography className="!text-sm ml-2">Loading...</Typography>
        </div>
      ) : error && notifications.length === 0 ? (
        <div className="py-4 px-4 text-center">
          <Typography className="!text-sm text-gray-500">
            No notifications available
          </Typography>
        </div>
      ) : notifications.length === 0 ? (
        <div className="py-4 px-4 text-center">
          <Typography className="!text-sm text-gray-500">
            No notifications yet
          </Typography>
        </div>
      ) : (
        <>
          {notifications.slice(0, 5).map((notification, index) => (
            <div key={notification.like_id}>
              <div className="py-3 px-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium">
                      {notification.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="!text-sm !leading-relaxed">
                      <span className="font-medium">
                        {notification.full_name}
                      </span>{' '}
                      liked your post
                      {notification.content && (
                        <>: "{truncateContent(notification.content)}"</>
                      )}
                    </Typography>
                    <Typography className="!text-xs text-gray-500 mt-1">
                      {formatTimeAgo(notification.liked_at)}
                    </Typography>
                  </div>
                </div>
              </div>
              {index < notifications.slice(0, 5).length - 1 && (
                <Divider className="bg-[#A6A3A3] !m-0" />
              )}
            </div>
          ))}

          {notifications.length > 5 && (
            <>
              <Divider className="bg-[#A6A3A3] !m-0" />
              <div className="py-2 px-4 text-center">
                <Typography className="!text-xs text-gray-500">
                  +{notifications.length - 5} more notifications
                </Typography>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <div className="flex gap-2 cursor-pointer transform transition-transform duration-200 ease-out hover:scale-[1.06] relative">
        <img src={MikeIcon} alt="mike" className="w-5 h-5 object-contain" />
        <Typography className="xl:!text-base">Announcement</Typography>

        {/* Notification badge */}
        {notifications.length > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-medium">
              {notifications.length > 9 ? '9+' : notifications.length}
            </span>
          </div>
        )}
      </div>
    </Popover>
  );
};

export default AnnouncementPopover;

// Mock data for fallback
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    like_id: 1,
    liked_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    user_id: 2,
    full_name: 'Chef Dongol',
    photo: null,
    post_id: 1,
    content: 'Want to become a better chef? Here are a few essential tips...',
    type: 'like',
  },
  {
    like_id: 2,
    liked_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    user_id: 3,
    full_name: 'Jane Smith',
    photo: null,
    post_id: 2,
    content: 'Just made the most amazing pasta dish today!',
    type: 'like',
  },
];
