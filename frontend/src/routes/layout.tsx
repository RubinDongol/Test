import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div>
      {/* <header>
        <Link to="/">Home</Link>
      </header> */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
