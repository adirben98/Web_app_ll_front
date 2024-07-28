import { Outlet } from 'react-router-dom';
import Header from './Header';
import Background from './Background';

const HeaderLayout = () => {
  return (
    <div>
      <Header />
      <div style={{ marginTop: "100px" }}>
        <Background>
          <Outlet />
        </Background>
      </div>
    </div>
  );
};

export default HeaderLayout;
