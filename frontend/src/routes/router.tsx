import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import Layout from './layout';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import ResetOtp from '../pages/ResetOtp';
import ConfirmationPassword from '../pages/ConfirmationPassword';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import Recipes from '../pages/Recipes';
import RecipeDetail from '../pages/Recipes/detail';
import Chefs from '../pages/Chefs';
import ChefDetail from '../pages/Chefs/detail';
import Subscription from '../pages/Subscription';
import Payment from '../pages/Subscription/payment';
import Classes from '../pages/Classes';
import SavedCollection from '../pages/SavedCollection';
import ClassDetail from '../pages/Classes/detail';
import UserProfile from '../pages/Profile/user-profile';
import PreJoin from '../pages/PreJoin';
import LiveClasses from '../pages/LiveClasses';
import PublicRoute from './PublicRoute';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-otp" element={<ResetOtp />} />
        <Route
          path="/confirmation-password"
          element={<ConfirmationPassword />}
        />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route index element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/recipe" element={<Recipes />} />
        <Route path="/recipe-detail" element={<RecipeDetail />} />
        <Route path="/chefs" element={<Chefs />} />
        <Route path="/chef-detail" element={<ChefDetail />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/classes-detail" element={<ClassDetail />} />
        <Route path="/collections" element={<SavedCollection />} />
        <Route path="/live-classes/:groupId" element={<PreJoin />} />
        <Route path="/room/:groupId" element={<LiveClasses />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default AppRouter;
