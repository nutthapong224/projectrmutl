import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, Box, Collapse, IconButton } from '@mui/material';
import { Home, CheckCircle, Article, BarChart, ExitToApp, ExpandLess, ExpandMore, Menu } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const [openSport, setOpenSport] = useState(false);
  const [openApproval, setOpenApproval] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) {
      onLogout();
    }
    navigate('/loginadmin');
  };

  const toggleSportMenu = () => setOpenSport(!openSport);
  const toggleApprovalMenu = () => setOpenApproval(!openApproval);

  const menuItems = [
    { text: 'หน้าหลัก', icon: <Home />, path: '/dashboard' },
    { text: 'ระบบอนุมัติข้อมูลการแข่งขัน', icon: <CheckCircle />, path: '', dropdown: true, toggle: toggleApprovalMenu },
    { text: 'ระบบจัดการข้อมูลข่าวสาร', icon: <Article />, path: '/news-management' },
    { text: 'รายงานข้อมูลกีฬา', icon: <BarChart />, path: '', dropdown: true, toggle: toggleSportMenu },
  ];

  const sportSubMenuItems = [
    { text: 'บาสเกตบอล', path: 'sports/basketball' },
    { text: 'ฟุตบอล', path: 'sports/football' },
    { text: 'เทเบิลเทนิส', path: 'sports/tabletennis' },
    { text: 'E-sport', path: 'sports/esport' },
    { text: 'ฟุตซอล', path: 'sports/futsal' },
    { text: 'วอลเลย์บอล', path: 'sports/volleyball' },
    { text: 'ตะกร้อ', path: 'sports/sportball' },
    { text: 'ตะกร้อลอดห่วง', path: 'sports/basketball_ring' },
    { text: 'เปตอง', path: 'sports/petanque' },
    // Other sports...
  ];

  const approvalSubMenuItems = [
    { text: 'อนุมัติบาสเกตบอล', path: 'approval/basketball' },
    { text: 'อนุมัติฟุตบอล', path: 'approval/football' },
    { text: 'อนุมัติเทเบิลเทนิส', path: 'approval/tabletennis' },
    { text: 'อนุมัติE-sport', path: 'approval/esport' },
    { text: 'อนุมัติฟุตซอล', path: 'approval/futsal' },
    { text: 'อนุมัติวอลเลย์บอล', path: 'approval/volleyball' },
    { text: 'อนุมัติตะกร้อ', path: 'approval/sportball' },
    { text: 'อนุมัติตะกร้อลอดห่วง', path: 'approval/basketball_ring' },
    { text: 'อนุมัติเปตอง', path: 'approval/petanque' },
  ];

  return (
    <>
      {/* Mobile Drawer Toggle Icon */}
      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1201, '@media (min-width:600px)': { display: 'none' } }}>
        <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
          <Menu />
        </IconButton>
      </Box>

      <Drawer
        variant="temporary"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
          '@media (min-width:600px)': { display: 'none' }, // Hide drawer on larger screens
        }}
      >
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h6" noWrap sx={{ fontSize: { xs: '1rem', sm: '1.5rem' } }}>
            Admin Panel
          </Typography>
        </Box>
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={item.dropdown ? item.toggle : () => navigate(item.path)} sx={{ cursor: 'pointer' }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
              {item.dropdown && (openApproval || openSport ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
          ))}
          <Collapse in={openApproval} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {approvalSubMenuItems.map((subItem, index) => (
                <ListItem button key={index} onClick={() => navigate(subItem.path)} sx={{ pl: 4,cursor: 'pointer' }}>
                  <ListItemText primary={subItem.text} />
                </ListItem>
              ))}
            </List>
          </Collapse>
          <Collapse in={openSport} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {sportSubMenuItems.map((subItem, index) => (
                <ListItem button key={index} onClick={() => navigate(subItem.path)} sx={{ pl: 4 ,cursor: 'pointer'}}>
                  <ListItemText primary={subItem.text} />
                </ListItem>
              ))}
            </List>
          </Collapse>
          <ListItem button onClick={handleLogout} sx={{ cursor: 'pointer'}}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="ออกจากระบบ" />
          </ListItem>
        </List>
      </Drawer>

      {/* Always show Drawer on larger screens */}
      <Drawer
        variant="persistent"
        open
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
          '@media (max-width:600px)': { display: 'none' }, // Hide persistent drawer on smaller screens
        }}
      >
        <Box sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h6" noWrap sx={{ fontSize: { xs: '1rem', sm: '1.5rem' } }}>
            Admin Panel
          </Typography>
        </Box>
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} onClick={item.dropdown ? item.toggle : () => navigate(item.path)} sx={{ cursor: 'pointer' }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
              {item.dropdown && (openApproval || openSport ? <ExpandLess /> : <ExpandMore />)}
            </ListItem>
          ))}
          <Collapse in={openApproval} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {approvalSubMenuItems.map((subItem, index) => (
                <ListItem button key={index} onClick={() => navigate(subItem.path)} sx={{ pl: 4 ,cursor: 'pointer'}}>
                  <ListItemText primary={subItem.text} />
                </ListItem>
              ))}
            </List>
          </Collapse>
          <Collapse in={openSport} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {sportSubMenuItems.map((subItem, index) => (
                <ListItem button key={index} onClick={() => navigate(subItem.path)} sx={{ pl: 4,cursor: 'pointer' }}>
                  <ListItemText primary={subItem.text} />
                </ListItem>
              ))}
            </List>
          </Collapse>
          <ListItem button onClick={handleLogout} sx={{ cursor: 'pointer' }}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="ออกจากระบบ" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
