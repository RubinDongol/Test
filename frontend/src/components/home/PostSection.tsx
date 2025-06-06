// frontend/src/components/home/PostSection.tsx - Updated without Following tab
import { useState } from 'react';
import { Typography, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UserIcon } from '../../assets';
import PostCard from './PostCard';
import {
  useGetAllPostsQuery,
  useCreatePostMutation,
} from '../../redux/services/postApi';

const PostSection = () => {
  const [postContent, setPostContent] = useState('');

  // API queries - only using "For You" posts now
  const { data: allPosts = [], isLoading } = useGetAllPostsQuery();
  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      notification.warning({
        message: 'Please enter some content for your post',
      });
      return;
    }

    try {
      await createPost({ content: postContent }).unwrap();
      setPostContent('');
      notification.success({ message: 'Post created successfully!' });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="bg-white border border-black flex flex-col flex-1 pt-8">
      <div className="flex flex-col min-h-0">
        {/* Simplified header - just "For You" */}
        <div className="flex justify-center items-center pb-4 border-b border-b-[#A6A3A3]">
          <div className="relative">
            <Typography className="!text-base">For You</Typography>
            <div className="absolute left-0 -bottom-1 h-[2px] bg-black w-full" />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Create Post Section */}
          <div className="px-8 pt-8 pb-4 flex flex-col border-b border-b-[#A6A3A3]">
            <div className="flex gap-2">
              <img
                src={UserIcon}
                alt="user"
                className="w-5 h-5 object-contain"
              />
              <TextArea
                placeholder="Add Your Post?"
                autoSize={{ minRows: 3, maxRows: 3 }}
                className="!border-none !shadow-none"
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
              />
            </div>
            <button
              className="bg-[#B5B5B5] px-4 rounded-full flex self-end cursor-pointer"
              onClick={handleCreatePost}
              disabled={isCreatingPost}>
              <Typography className="text-black !text-base">
                {isCreatingPost ? 'Posting...' : 'Post'}
              </Typography>
            </button>
          </div>

          {/* Posts Display */}
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Typography>Loading posts...</Typography>
            </div>
          ) : allPosts.length === 0 ? (
            <div className="flex justify-center items-center p-8">
              <Typography>No posts available</Typography>
            </div>
          ) : (
            allPosts.map(post => <PostCard key={post.id} data={post} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default PostSection;
