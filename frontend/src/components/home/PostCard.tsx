// frontend/src/components/home/PostCard.tsx
import { notification, Typography, Modal, Input, Popconfirm } from 'antd';
import { BookmarkIcon, ChatIcon, FlagIcon, HeartIcon } from '../../assets';
import { UserNameWithIcon } from '../common';
import { useLocation } from 'react-router-dom';
import {
  useToggleLikePostMutation,
  useToggleBookmarkPostMutation,
  useAddCommentMutation,
  useGetCommentsByPostIdQuery,
  useDeletePostMutation,
  IPost,
} from '../../redux/services/postApi';
import { useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const PostCard = ({
  hideReportBtn,
  data,
}: {
  hideReportBtn?: boolean;
  data: IPost;
}) => {
  const location = useLocation();
  const locationUser = location?.state?.name;
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');

  const [toggleLike] = useToggleLikePostMutation();
  const [toggleBookmark] = useToggleBookmarkPostMutation();
  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();
  const [deletePost, { isLoading: isDeletingPost }] = useDeletePostMutation();
  const { data: comments = [] } = useGetCommentsByPostIdQuery(data.id, {
    skip: !commentModalVisible,
  });

  const handleLike = async () => {
    try {
      const result = await toggleLike(data.id).unwrap();
      notification.success({
        message: result.liked ? 'Post liked!' : 'Post unliked!',
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const result = await toggleBookmark(data.id).unwrap();
      notification.success({
        message: result.bookmarked
          ? 'Post saved to your collection!'
          : 'Post removed from collection!',
        description: result.bookmarked
          ? 'You can find it in your Saved Collection.'
          : '',
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      notification.error({
        message: 'Failed to save post',
        description: 'Please try again later.',
      });
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      notification.warning({ message: 'Please enter a comment' });
      return;
    }

    try {
      await addComment({ postId: data.id, text: commentText }).unwrap();
      setCommentText('');
      notification.success({ message: 'Comment added successfully!' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(data.id).unwrap();
      notification.success({ message: 'Post deleted successfully!' });

      // Force refetch of user profile if we're on profile page
      if (window.location.pathname === '/profile') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      notification.error({ message: 'Failed to delete post' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col pt-8 pb-4 px-8 gap-4 border-b border-b-[#A6A3A3]">
      <div className="flex items-center justify-between">
        <UserNameWithIcon
          userName={locationUser || data.full_name}
          userId={data.user_id}
          disabled={hideReportBtn}
        />
        <Typography className="!text-sm text-gray-500">
          {formatDate(data.created_at)}
        </Typography>
      </div>

      <Typography className="!text-base">{data.content}</Typography>

      <div className="flex justify-between items-center gap-6">
        <div className="flex justify-between items-center gap-4">
          <button
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => setCommentModalVisible(true)}>
            <img
              src={ChatIcon}
              alt="comment"
              className="w-6 h-6 object-contain"
            />
            <Typography className="!text-sm">{data.comment_count}</Typography>
          </button>

          <button
            className="flex gap-1 items-center cursor-pointer transition-colors duration-200"
            onClick={handleLike}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={data.is_liked ? '#ef4444' : 'none'}
              xmlns="http://www.w3.org/2000/svg"
              className={`w-6 h-6 transition-colors duration-200 ${
                data.is_liked
                  ? 'text-red-500'
                  : 'text-gray-600 hover:text-red-400'
              }`}>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.25003 8.28028C2.27927 5.42838 4.54489 3 7.45687 3C9.24426 3 10.559 3.88475 11.398 4.71777C11.6316 4.94972 11.8321 5.18108 12 5.39441C12.1679 5.18108 12.3683 4.94972 12.602 4.71777C13.441 3.88475 14.7557 3 16.5431 3C19.4551 3 21.7207 5.42838 21.75 8.28028C21.8054 13.8425 17.3361 17.6908 12.8437 20.7403C12.5949 20.9095 12.3009 21.0001 12 21.0001C11.699 21.0001 11.4051 20.9095 11.1562 20.7403C6.66343 17.6908 2.19407 13.8426 2.25003 8.28028Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <Typography className="!text-sm">{data.like_count}</Typography>
          </button>

          <button
            className="flex gap-1 items-center cursor-pointer transition-colors duration-200 hover:bg-gray-50 p-1 rounded"
            onClick={handleBookmark}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={data.is_bookmarked ? '#3b82f6' : 'none'}
              xmlns="http://www.w3.org/2000/svg"
              className={`w-6 h-6 transition-colors duration-200 ${
                data.is_bookmarked
                  ? 'text-blue-500'
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
            <Typography
              className={`!text-sm ${data.is_bookmarked ? 'text-blue-600' : ''}`}>
              {data.is_bookmarked ? 'Saved' : ''}
            </Typography>
          </button>

          {/* Delete Button - Only show if user owns the post */}
          {data.is_owner && (
            <Popconfirm
              title="Delete Post"
              description="Are you sure you want to delete this post?"
              onConfirm={handleDeletePost}
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{
                danger: true,
                loading: isDeletingPost,
              }}
              placement="topRight">
              <button
                className="flex gap-1 items-center cursor-pointer transition-colors duration-200 text-red-500 hover:text-red-700"
                disabled={isDeletingPost}>
                <DeleteOutlined className="w-5 h-5" />
                <Typography className="!text-sm text-red-500">
                  {isDeletingPost ? 'Deleting...' : ''}
                </Typography>
              </button>
            </Popconfirm>
          )}
        </div>

        {!hideReportBtn && (
          <button
            className="flex justify-between items-center gap-2 cursor-pointer"
            onClick={() =>
              notification.success({ message: 'Post has been reported' })
            }>
            <Typography className="!text-base text-[#807F7F]">
              Report
            </Typography>
            <img src={FlagIcon} alt="flag" className="w-5 h-5 object-contain" />
          </button>
        )}
      </div>

      {/* Comments Modal */}
      <Modal
        title="Comments"
        open={commentModalVisible}
        onCancel={() => setCommentModalVisible(false)}
        footer={null}
        width={600}>
        <div className="max-h-96 overflow-y-auto mb-4">
          {comments.map(comment => (
            <div key={comment.id} className="mb-4 p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Typography className="font-medium">
                  {comment.full_name}
                </Typography>
                <Typography className="text-xs text-gray-500">
                  {formatDate(comment.created_at)}
                </Typography>
              </div>
              <Typography>{comment.text}</Typography>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <TextArea
            placeholder="Write a comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded self-end"
            onClick={handleAddComment}
            disabled={isAddingComment}>
            {isAddingComment ? 'Adding...' : 'Comment'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PostCard;
