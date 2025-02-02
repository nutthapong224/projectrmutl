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
        title: 'กรรมการ',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'ผู้ประสานงาน',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'ผู้คุมทีม',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาฟุตบอล',
        path: '/admindashboard/approve/football',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาฟุตซอล',
        path: '/admindashboard/approve/futsal',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาบาสเกตบอล',
        path: '/admindashboard/approve/basketball',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาแบดมินตัน',
        path: '/admindashboard/approve/badminton',
        icon: <IoIcons.IoIosPaper />
      },
   
      {
        title: 'นักกีฬาE-Sport',
        path: '/admindashboard/approve/esport',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาเซปักตะกร้อ',
        path: '/admindashboard/approve/takraw',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาวอลเลย์บอล',
        path: '/admindashboard/approve/volleyball',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาเทเบิลเทนิส',
        path: '/admindashboard/approve/tabletenis',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาเปตอง',
        path: '/admindashboard/approve/petanque',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาเซปักตะกร้อลอดห่วง',
        path: '/admindashboard/approve/hooptakraw',
        icon: <IoIcons.IoIosPaper />
      },
    ]
  },
  {
    title: 'ข้อมูลผู้เข้าร่วม',
    path: '#',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: 'กรรมการ',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'ผู้ประสานงาน',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'ผู้คุมทีม',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาฟุตบอล',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาฟุตซอล',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาบาสเกตบอล',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาแบดมินตัน',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
   
      {
        title: 'นักกีฬาE-Sport',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาตะกร้อ',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาบอลเลย์บอล',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาเทเบิลเทนิส',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาเปตอง',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'ตะกร้อลอดห่วง',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
    ]
  },
  {
    title: 'ระบบจัดการข้อมูลข่าวสาร',
    path: '/products',
    icon: <FaIcons.FaCartPlus />
  },
  {
    title: 'ระบบจัดการข้อมูลเกียรติบัตร',
    path: '/team',
    icon: <IoIcons.IoMdPeople />
  },
  {
    title: 'ระบบจัดการข้อมูลผลการแข่งขัน',
    path: '/admindashboard',
    icon: <FaIcons.FaEnvelopeOpenText />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: 'นักกีฬาฟุตบอล',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาฟุตซอล',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาบาสเกตบอล',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาแบดมินตัน',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
   
      {
        title: 'นักกีฬาE-Sport',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาตะกร้อ',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาบอลเลย์บอล',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาเทเบิลเทนิส',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาเปตอง',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'ตะกร้อลอดห่วง',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      }
    ]
  },
  {
    title: 'ระบบจัดการเหรียญรางวัล',
    path: '/admindashboard/overview',
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: 'กรรมการ',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'ผู้ประสานงาน',
        path: '/overview/revenue',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'ผู้คุมทีม',
        path: '/overview/users',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาฟุตบอล',
        path: '/admindashboard/updatemedal/football',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาฟุตซอล',
        path: '/admindashboard/updatemedal/futsal',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาบาสเกตบอล',
        path: '/admindashboard/updatemedal/basketball',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาแบดมินตัน',
        path: '/admindashboard/updatemedal/badminton',
        icon: <IoIcons.IoIosPaper />
      },
   
      {
        title: 'นักกีฬาE-Sport',
        path: '/admindashboard/updatemedal/esport',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาเซปักตะกร้อ',
        path: '/admindashboard/updatemedal/takraw',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาวอลเลย์บอล',
        path: '/admindashboard/updatemedal/volleyball',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาเทเบิลเทนิส',
        path: '/admindashboard/updatemedal/tabletenis',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาเปตอง',
        path: '/admindashboard/updatemedal/petanque',
        icon: <IoIcons.IoIosPaper />
      },
      {
        title: 'นักกีฬาเซปักตะกร้อลอดห่วง',
        path: '/admindashboard/updatemedal/hooptakraw',
        icon: <IoIcons.IoIosPaper />
      },
    ]
  },
  
  {
    title: 'ออกจากระบบ',
    path: '#', // No navigation for logout
    icon: <FaIcons.FaSignOutAlt />,
    action: 'logout' // Custom action for logout
  }
];
