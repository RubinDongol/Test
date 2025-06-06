import { Input, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';
// import { SearchOutlined } from '@ant-design/icons';
import { LogoIcon } from '../../assets';
import { AnnouncementPopover, ProfilePopover } from '../header';

const AppWrapper = ({ children }: { children: React.ReactElement }) => {
  const { pathname } = useLocation();
  return (
    <div className="h-[100dvh] bg-gray-primary">
      <div className="max-w-screen-xl mx-auto h-full pb-8 px-8 flex flex-col">
        <nav className="flex gap-4 xl:gap-8 py-[26px] items-center justify-between">
          <div className="flex gap-5 items-center">
            <img
              alt="logo"
              width={50}
              height={20}
              src={LogoIcon}
              className="transform transition-transform duration-200 ease-out hover:scale-[1.06] object-contain"
            />
            {/* <Input
              placeholder="Search"
              prefix={<SearchOutlined className="!text-[#3C3C4399]" />}
              className="!border-none min-w-[180px] xl:!w-[375px] h-9"
            /> */}
          </div>
          <div className="flex  gap-4 items-center">
            {NAVLINKS.map(item => {
              const isActive = pathname === item.route;
              return (
                <Link
                  to={item.route}
                  key={item.route}
                  className={
                    `transform transition-transform duration-200 ease-out hover:scale-[1.06] ` +
                    (isActive
                      ? 'underline underline-offset-4 decoration-black'
                      : '')
                  }>
                  <Typography className="xl:!text-base">{item.name}</Typography>
                </Link>
              );
            })}
          </div>
          <div className="flex gap-4">
            <AnnouncementPopover />
            <ProfilePopover />
          </div>
        </nav>
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default AppWrapper;

const NAVLINKS = [
  {
    route: '/',
    name: 'Home',
  },
  {
    route: '/recipe',
    name: 'Recipe',
  },
  {
    route: '/chefs',
    name: 'Chefs',
  },
  {
    route: '/classes',
    name: 'Classes',
  },
  {
    route: '/collections',
    name: 'Saved Collection',
  },
];
