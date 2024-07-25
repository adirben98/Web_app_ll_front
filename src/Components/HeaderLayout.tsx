import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Background from './Background';

const HeaderLayout = () => {
  return (
    <div>
    <Background>
        
      <Header />
      <Outlet />
    </Background>

    </div>
  );
};

export default HeaderLayout;
