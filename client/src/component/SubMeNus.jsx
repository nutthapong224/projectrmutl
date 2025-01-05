import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
const SidebarLink = styled(Link)`
  display: flex;
  color: #f5f5f5;
  justify-content: space-between;
  align-items: center;
  padding: 15px; /* Reduced padding */
  text-decoration: none;
  font-size: 15px; /* Reduced font size */

  &:hover {
    background: #252831;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 12px; /* Adjusted margin */
  font-size: 15px; /* Reduced font size */
`;

const SubMeNus = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    // Navigate to login page
    navigate('/loginadmin');
  };

  const handleClick = () => {
    if (item.action === 'logout') {
      handleLogout();
    }
  };

  return (
    <>
      <SidebarLink
        to={item.path}
        onClick={
          item.action === 'logout'
            ? (e) => {
                e.preventDefault(); // Prevent default link behavior for logout
                handleClick();
              }
            : item.subNav && (() => setSubnav(!subnav))
        }
      >
        <div>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </div>
      </SidebarLink>
      {subnav &&
        item.subNav?.map((subItem, index) => (
          <SidebarLink to={subItem.path} key={index}>
            {subItem.icon}
            <SidebarLabel>{subItem.title}</SidebarLabel>
          </SidebarLink>
        ))}
    </>
  );
};

export default SubMeNus;
