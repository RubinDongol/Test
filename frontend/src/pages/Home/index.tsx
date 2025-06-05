import { AppWrapper } from '../../components/layouts';
import {
  PostSection,
  RecommendedProfile,
  UpcomingLiveClasses,
} from '../../components/home';

const Home = () => (
  <AppWrapper>
    <div className="flex gap-16 h-full">
      <UpcomingLiveClasses />
      <PostSection />
      <RecommendedProfile />
    </div>
  </AppWrapper>
);

export default Home;
