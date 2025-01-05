import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from '../component/Sidebardetail';
import SubMeNus from '../component/SubMeNus';

const Nav = styled.div`
  background: #15171c;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavIcon = styled(Link)`
  margin-left: 1rem;
  font-size: 1.5rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #fff;

  &:hover {
    color: #4caf50;
    transition: all 0.3s ease;
  }
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const SidebarWrap = styled.div`
  width: 100%;
  padding: 1rem;
  overflow-y: auto; // Enable vertical scrolling
  max-height: 100vh; // Limit height to viewport
`;

const Admindashboard = () => {
  const [sidebar, setSidebar] = useState(false);
  const navigate = useNavigate();

  const showSidebar = () => setSidebar(!sidebar);

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    navigate('/loginadmin');
  };

  return (
    <>
      <Nav>
        <NavIcon to="#" onClick={showSidebar}>
          <FaIcons.FaBars />
        </NavIcon>
      </Nav>
      <SidebarNav sidebar={sidebar}>
        <SidebarWrap>
          <NavIcon to="#" onClick={showSidebar}>
            <AiIcons.AiOutlineClose />
          </NavIcon>
          {SidebarData.map((item, index) => (
            <SubMeNus
              item={item}
              key={index}
              logout={handleLogout} // Pass logout function as a prop
            />
          ))}
        </SidebarWrap>
      </SidebarNav>
      <div style={{ marginLeft: '250px', padding: '20px' }}>
        <Outlet />
      </div>
    </>
  );
};

export default Admindashboard;
