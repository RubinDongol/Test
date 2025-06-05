// frontend/src/components/common/InteractiveButtons.tsx
import React, { useState } from 'react';
import { Typography } from 'antd';

interface HeartButtonProps {
  isLiked?: boolean;
  likeCount?: number;
  onLike?: () => void;
  size?: number;
}

interface BookmarkButtonProps {
  isBookmarked?: boolean;
  onBookmark?: () => void;
  size?: number;
}

export const HeartButton: React.FC<HeartButtonProps> = ({
  isLiked = false,
  likeCount,
  onLike,
  size = 24,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount || 0);

  const handleClick = () => {
    if (onLike) {
      onLike();
    } else {
      // Local state management for demo purposes
      setLiked(!liked);
      setCount(prev => (liked ? prev - 1 : prev + 1));
    }
  };

  return (
    <button
      className="flex gap-1 items-center cursor-pointer transition-all duration-200 hover:scale-105"
      onClick={handleClick}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={liked ? '#ef4444' : 'none'}
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-all duration-200 ${
          liked ? 'text-red-500 scale-110' : 'text-gray-600 hover:text-red-400'
        }`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.25003 8.28028C2.27927 5.42838 4.54489 3 7.45687 3C9.24426 3 10.559 3.88475 11.398 4.71777C11.6316 4.94972 11.8321 5.18108 12 5.39441C12.1679 5.18108 12.3683 4.94972 12.602 4.71777C13.441 3.88475 14.7557 3 16.5431 3C19.4551 3 21.7207 5.42838 21.75 8.28028C21.8054 13.8425 17.3361 17.6908 12.8437 20.7403C12.5949 20.9095 12.3009 21.0001 12 21.0001C11.699 21.0001 11.4051 20.9095 11.1562 20.7403C6.66343 17.6908 2.19407 13.8426 2.25003 8.28028Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      {(likeCount !== undefined || count > 0) && (
        <Typography className="!text-sm font-medium">
          {onLike ? likeCount : count}
        </Typography>
      )}
    </button>
  );
};

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked = false,
  onBookmark,
  size = 24,
}) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleClick = () => {
    if (onBookmark) {
      onBookmark();
    } else {
      // Local state management for demo purposes
      setBookmarked(!bookmarked);
    }
  };

  return (
    <button
      className="flex gap-1 items-center cursor-pointer transition-all duration-200 hover:scale-105"
      onClick={handleClick}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={bookmarked ? '#3b82f6' : 'none'}
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-all duration-200 ${
          bookmarked
            ? 'text-blue-500 scale-110'
            : 'text-gray-600 hover:text-blue-400'
        }`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.37868 2.37868C5.94129 1.81607 6.70435 1.5 7.5 1.5H16.5C17.2956 1.5 18.0587 1.81607 18.6213 2.37868C19.1839 2.94129 19.5 3.70435 19.5 4.5V21.75C19.5 22.0453 19.3267 22.3132 19.0572 22.4342C18.7878 22.5552 18.4725 22.5068 18.2517 22.3106L12 16.7535L5.74827 22.3106C5.52753 22.5068 5.21218 22.5552 4.94276 22.4342C4.67333 22.3132 4.5 22.0453 4.5 21.75V4.5C4.5 3.70435 4.81607 2.94129 5.37868 2.37868Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
};

// Comment Button (non-interactive, just for display)
export const CommentButton: React.FC<{
  commentCount?: number;
  onClick?: () => void;
  size?: number;
}> = ({ commentCount, onClick, size = 24 }) => {
  return (
    <button
      className="flex gap-1 items-center cursor-pointer transition-all duration-200 hover:scale-105 text-gray-600 hover:text-blue-500"
      onClick={onClick}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-colors duration-200">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.992 2C5.9941 2 1.98492 5.95015 1.99998 10.7792L1.99999 10.7804V10.7816C1.99993 12.4614 2.49092 14.1045 3.41234 15.5087C3.46497 15.5806 3.5142 15.655 3.55988 15.7315L3.5635 15.7375L3.56701 15.7437C3.64096 15.873 3.72865 16.0473 3.78908 16.2397C3.84438 16.4157 3.90808 16.7028 3.82484 17.0091L3.82441 17.0107L3.04976 19.8128L5.72858 18.846C5.99491 18.7365 6.28031 18.6805 6.56842 18.6814C6.56891 18.6814 6.56939 18.6814 6.56987 18.6814L6.56702 19.4314L6.56842 18.6814C6.56823 18.6814 6.56861 18.6814 6.56842 18.6814C6.83817 18.6818 7.10557 18.7316 7.35736 18.8284L7.35845 18.8288C7.51048 18.8875 8.11609 19.1125 8.71494 19.2801C9.30364 19.4449 10.3908 19.6447 11.1598 19.6447C16.1328 19.6447 19.9999 15.6518 20 10.7889C19.9998 10.1856 19.9359 9.58378 19.8095 8.99391L19.8091 8.99234C18.9657 5.01596 15.3473 2 10.992 2Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
      {commentCount !== undefined && (
        <Typography className="!text-sm font-medium">{commentCount}</Typography>
      )}
    </button>
  );
};
