import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const SidebarLink = styled(Link)`
  display: flex;
  color: #f5f5f5;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  text-decoration: none;
  font-size: 15px;
  
  &:hover {
    background: #252831;
    border-left: 4px solid #632ce4;
    color: yellow;
    cursor: pointer;
  }
`;

// Reduced margin-left to make title closer to the icon
const SidebarLabel = styled.span`
  margin-left: 5px; /* Reduced from 12px to 5px */
  font-size: 15px;
`;

// Adding style for the div that contains the icon and label to ensure proper alignment
const IconLabelContainer = styled.div`
  display: flex;
  align-items: center;
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
        <IconLabelContainer>
          {item.icon}
          <SidebarLabel>{item.title}</SidebarLabel>
        </IconLabelContainer>
        {item.subNav && (
          subnav ? item.iconOpened : item.iconClosed
        )}
      </SidebarLink>
      {subnav &&
        item.subNav?.map((subItem, index) => (
          <SidebarLink to={subItem.path} key={index}>
            <IconLabelContainer>
              {subItem.icon}
              <SidebarLabel>{subItem.title}</SidebarLabel>
            </IconLabelContainer>
          </SidebarLink>
        ))}
    </>
  );
};

export default SubMeNus;