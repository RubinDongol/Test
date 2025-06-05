// frontend/src/components/home/PostSection.tsx
import { useState } from 'react';
import { Typography, notification } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UserIcon } from '../../assets';
import PostCard from './PostCard';
import {
  useGetAllPostsQuery,
  useGetFollowingPostsQuery,
  useCreatePostMutation,
} from '../../redux/services/postApi';

const PostSection = () => {
  const [isFollowing, setFollowing] = useState(false);
  const [postContent, setPostContent] = useState('');

  // API queries
  const { data: allPosts = [], isLoading: isLoadingAll } = useGetAllPostsQuery(
    undefined,
    {
      skip: isFollowing,
    },
  );
  const { data: followingPosts = [], isLoading: isLoadingFollowing } =
    useGetFollowingPostsQuery(undefined, {
      skip: !isFollowing,
    });
  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();

  const currentPosts = isFollowing ? followingPosts : allPosts;
  const isLoading = isFollowing ? isLoadingFollowing : isLoadingAll;

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
        <div className="flex gap-[40px] md:gap-[90px] xl:gap-[128px] justify-center items-center pb-4 border-b border-b-[#A6A3A3]">
          {['For You', 'Following'].map((label, index) => {
            const isActive =
              (index === 1 && isFollowing) || (index === 0 && !isFollowing);
            return (
              <div
                key={label}
                className="relative cursor-pointer"
                onClick={() => setFollowing(index === 1)}>
                <Typography className="!text-base">{label}</Typography>
                <div
                  className={`absolute left-0 -bottom-1 h-[2px] bg-black transition-all duration-300 ${
                    isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </div>
            );
          })}
        </div>
        <div className="overflow-y-auto flex-1">
          {!isFollowing && (
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
          )}

          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Typography>Loading posts...</Typography>
            </div>
          ) : currentPosts.length === 0 ? (
            <div className="flex justify-center items-center p-8">
              <Typography>
                {isFollowing
                  ? 'No posts from people you follow yet'
                  : 'No posts available'}
              </Typography>
            </div>
          ) : (
            currentPosts.map(post => <PostCard key={post.id} data={post} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default PostSection;
