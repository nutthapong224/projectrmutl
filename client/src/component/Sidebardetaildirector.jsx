import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as FaIcons from 'react-icons/fa';


export const SidebarData = [
 


  {
    title: 'ระบบจัดการข้อมูลผลการแข่งขัน',
    path: '/directordashboard/managematchresult',
    icon: <FaIcons.FaEnvelopeOpenText />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    
  },
  {
    title: 'ระบบจัดการสถานะผู้เข้าแข่งขัน',
    path: '/directordashboard/updatemedal/player',
    icon: <IoIcons.IoMdPeople />
  },

  {
    title: 'ระบบจัดการเหรียญ',
    path: '/directordashboard/manage/medal',
    icon: <IoIcons.IoMdPeople />
  },
  
  {
    title: 'ออกจากระบบ',
    path: '#', // No navigation for logout
    icon: <FaIcons.FaSignOutAlt />,
    action: 'logout' // Custom action for logout
  }
];
