// frontend/src/components/home/PostCard.tsx
import { notification, Typography, Modal, Input } from 'antd';
import { BookmarkIcon, ChatIcon, FlagIcon, HeartIcon } from '../../assets';
import { UserNameWithIcon } from '../common';
import { useLocation } from 'react-router-dom';
import {
  useToggleLikePostMutation,
  useToggleBookmarkPostMutation,
  useAddCommentMutation,
  useGetCommentsByPostIdQuery,
  IPost,
} from '../../redux/services/postApi';
import { useState } from 'react';

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
        message: result.bookmarked ? 'Post bookmarked!' : 'Post unbookmarked!',
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
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
            className="flex gap-1 items-center cursor-pointer"
            onClick={handleLike}>
            <img
              src={HeartIcon}
              alt="heart"
              className={`w-6 h-6 object-contain ${data.is_liked ? 'text-red-500' : ''}`}
            />
            <Typography className="!text-sm">{data.like_count}</Typography>
          </button>

          <button
            className="flex gap-1 items-center cursor-pointer"
            onClick={handleBookmark}>
            <img
              src={BookmarkIcon}
              alt="bookmark"
              className={`w-6 h-6 object-contain ${data.is_bookmarked ? 'text-blue-500' : ''}`}
            />
          </button>
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
