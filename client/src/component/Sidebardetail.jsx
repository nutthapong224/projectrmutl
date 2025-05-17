import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import * as FaIcons from 'react-icons/fa';


export const SidebarData = [
  {
    title: 'อนุมัติลงทะเบียน',
    path: '#',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: 'นักกีฬา',
        path: '/admindashboard/approve/football',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'กรรมการ',
        path: '/admindashboard/approve/director',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'ผู้ประสานงาน',
        path: '/admindashboard/approve/studentorganization',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'ผู้คุมทีม',
        path: '/admindashboard/approve/coach',
        icon: <IoIcons.IoIosPaper />
      },
    
    
    ]
  },
  {
    title: 'จัดการข้อมูลผู้เข้าร่วม',
    path: '#',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: 'นักกีฬา',
        path: '/admindashboard/manage/player',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'กรรมการ',
        path: '/admindashboard/manage/director',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'ผู้ประสานงาน',
        path: '/admindashboard/manage/studentorgranization',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'ผู้คุมทีม',
        path: '/admindashboard/manage/coach',
        icon: <IoIcons.IoIosPaper />
      },
    ]
  },
  {
    title: 'ระบบจัดการข้อมูลข่าวสาร',
    path: '/admindashboard/manage/news',
    icon: <FaIcons.FaCartPlus />
  },

  {
    title: 'ระบบจัดการข้อมูลผลการแข่งขัน',
    path: '/admindashboard/managematchresult',
    icon: <FaIcons.FaEnvelopeOpenText />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    
  },
  {
    title: 'ระบบจัดการสถานะนักแข่ง',
    path: '/admindashboard/updatemedal/player',
    icon: <IoIcons.IoMdPeople />
  },  {
    title: 'ระบบจัดการเหรียญรางวัล',
    path: '/admindashboard/manage/medal',
    icon: <IoIcons.IoMdPeople />
  },
  
  {
    title: 'ออกจากระบบ',
    path: '#', // No navigation for logout
    icon: <FaIcons.FaSignOutAlt />,
    action: 'logout' // Custom action for logout
  }
];
