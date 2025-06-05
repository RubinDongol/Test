// frontend/src/pages/SavedCollection/index.tsx
import { Typography } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { PostCard } from '../../components/home';
import { useGetBookmarkedPostsQuery } from '../../redux/services/postApi';

const SavedCollection = () => {
  const {
    data: bookmarkedPosts = [],
    isLoading,
    error,
  } = useGetBookmarkedPostsQuery();

  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white py-8 px-8 gap-8">
        <Typography className="!text-2xl">Saved Collection</Typography>

        {isLoading ? (
          <div className="flex justify-center items-center flex-1">
            <Typography>Loading your saved posts...</Typography>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center flex-1">
            <Typography className="text-red-500">
              Error loading saved posts
            </Typography>
          </div>
        ) : bookmarkedPosts.length === 0 ? (
          <div className="flex justify-center items-center flex-1">
            <Typography>
              No saved posts yet. Start bookmarking posts you like!
            </Typography>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {bookmarkedPosts.map(post => (
              <PostCard key={post.id} data={post} />
            ))}
          </div>
        )}
      </div>
    </AppWrapper>
  );
};

export default SavedCollection;
