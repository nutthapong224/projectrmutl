import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles'; 
import Searchbadminton from "./pages/Searchbadmintons";
import Footer from "./components/Footer"
import Searchbasketball from "./pages/Searchbasketball";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Systermcard from "./pages/Systemcard";
import NotFoundPage from "./pages/Notfoundpage";
import ProtectedRoute from "./pages/Protectedroutes";
import RegisterAdmin from "./pages/Registeradmin";
import Loginadmin from "./pages/Loginadmin";
import Updatemedalplayer from "./pages/Updatemedalplayer";
import Dashboardadmin from "./component/Admindashboard";
import Approvefootball from "./pages/Approveplayer";
import Searchplayer from "./pages/Searchplayer";
import Reportstudentorganization  from "./pages/Reportstudentorganization";
import Searchesport from "./pages/Searchdirector";
import Reportcoach from "./pages/Reportcoach";
import EsportForm from "./pages/Registerplayer";
import Addplayer from "./pages/Addplayer"
import Managemedal from "./pages/Managemedal";
import Reportdirector from "./pages/Reportdirectors";
import SportList from "./components/SportList";
import Manageplayer from "./pages/Manageplayer";
import Registerplayers from "./pages/Addplayer";
import Updateplayer from "./pages/Updateplayer";
import './App.css';
import Overview from "./pages/Overview";
import Navbar from "./components/Navbar";
import Schedule from "./pages/Schedule";
import Registercoach from "./pages/Registercoach";
import Approvecoach from "./pages/Approvecoach";
import Managecoach from "./pages/Managecoach";
import Updatecoach from "./pages/Updatecoach";
import Addcoach from "./pages/Addcoach";
import Registerstudentorganization from "./pages/Registerstudentorganization";
import Approvestudentorganization from "./pages/Approvestudentorganization";
import Addstudentorganization from "./pages/Addstudentorganization";
import Managestudentorgranization from "./pages/Managestudentorgranization";
import Updatestudentorganization from "./pages/Updatestudentorganization";
import Registerdirector from "./pages/Registerdirector";
import Approvedirector from "./pages/Approvedirector";
import Adddirector from "./pages/Adddirector";
import Reportplayer from "./pages/Reportplayer";
import Managedirector from "./pages/Managedirector";
import Updatedirector from "./pages/Updatedirector";
import Report from "./pages/Report";
import Searchcoach from "./pages/Searchcoach";
import Coachinfo from "./pages/Coachinfo";
import Searchstudentorganization from "./pages/Searchstudentorganization";
import Studentorganizationinfo from "./pages/Studentorganizationinfo";
import { Stadium } from "@mui/icons-material";
import Playerinfo from "./pages/Playerinfo";
import Directorinfo from "./pages/Directorinfo";
import Addnews from "./pages/Addnews";
import Updatenews from "./pages/Updatenews";
import Managenews from "./pages/Managenews";
import Addresultsport from "./pages/Addresultsport";
import Managematchresult from "./pages/Managematchresult";
import Updatematchresult from "./pages/Updatematchresult";
import Resultsport from "./pages/Resultsport";
import Addmedalsport from "./pages/Addmedalsport";
import Directordashboard from "./component/Directordashboard";
import Logindirector from "./pages/Logindirector";
import Loginpage from "./pages/Loginpage"
import Updatematchresultwithdirector from "./pages/Updatematchresultwithdirector"; 
import Managematchresultwithdirector from "./pages/Managematchresultwithdirector";
import Unauthorized from "./pages/Unauthorized";
import Addresultsportwithdirector from "./pages/Addresultsportwithdirector";
import Registeradmindirector from "./pages/Registeradmindirector";
import Agenda from "./pages/Agenda"
import NewsDetail from "./pages/Newdetail";
import Matchresult from "./pages/Matchresult";
import UpdateMedalComponent from "./pages/๊Updatemedalsport";
import Tablemedal from "./pages/Tablemedal";
import Managemedalwithdirector from "./pages/Managemedalwithdirector";
import Updatemedalplayerwithdirector from "./pages/Updatemedalplayerwithdirector";

import Addteam from "./pages/Addteam";
import Addteamwithdirector from "./pages/Addteamwithdirector";
import Addmedalsportwithdirector from "./pages/Addmedalsportwithdirector";

const App = () => {
  return (
    <Router>
      <NavbarWrapper />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matchresult" element={<Matchresult/>} />

        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/registerplayer" element={<EsportForm />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/tablemedal" element={<Tablemedal />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/registercoach" element={<Registercoach />} />
        <Route path="/registerstudentorganization" element={<Registerstudentorganization />} />
        <Route path="/registerdirector" element={<Registerdirector />} />
        <Route path="/sportlist" element={<SportList />} />
        <Route path="/loginpage" element={<Loginpage />} />
        <Route path="/loginadmin" element={<Loginadmin />} />
        <Route path="/logindirector" element={<Logindirector />} />
        <Route path="/registeradmin" element={<RegisterAdmin />} />
        <Route path="/report" element={<Report/>} />
        <Route
  path="/admindashboard"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <Dashboardadmin />
    </ProtectedRoute>
  }
>
  <Route index element={<Overview />} />
  <Route path="overview" element={<Overview />} />
  <Route path="approve/coach" element={<Approvecoach />} />
  <Route path="approve/football" element={<Approvefootball />} />
  <Route path="approve/studentorganization" element={<Approvestudentorganization />} />
  <Route path="approve/director" element={<Approvedirector />} />
  <Route path="approve/organization" element={<Overview />} />
  <Route path="registeradmindirector" element={<Registeradmindirector/>} />
  <Route path="updatemedal/player" element={<Updatemedalplayer />} />
  <Route path="addteam" element={<Addteam/>} />
  <Route path="manage/coach" element={<Managecoach />} />
  <Route path="manage/player" element={<Manageplayer />} />
  <Route path="manage/studentorgranization" element={<Managestudentorgranization />} />
  <Route path="manage/director" element={<Managedirector />} />
  <Route path="manage/medal" element={<Managemedal />} />
  <Route path="manage/news" element={<Managenews />} />

  <Route path="addplayer" element={<Registerplayers />} />
  <Route path="addcoach" element={<Addcoach />} />
  <Route path="adddirector" element={<Adddirector />} />
  <Route path="addstudentorgranization" element={<Addstudentorganization />} />
  <Route path="addnews" element={<Addnews />} />
  <Route path="addresultsport" element={<Addresultsport />} />
  <Route path="updatemedalplayer/:id" element={<UpdateMedalComponent />} />
  <Route path="updateplayer/:id" element={<Updateplayer />} />
  <Route path="updatecoach/:id" element={<Updatecoach />} />
  <Route path="updatedirector/:id" element={<Updatedirector />} />
  <Route path="updatenews/:id" element={<Updatenews />} />
  <Route path="updatestudentorgranization/:id" element={<Updatestudentorganization />} />
  <Route path="updatematchresult/:id" element={<Updatematchresult />} />
  <Route path="managematchresult" element={<Managematchresult />} />
  <Route path="addmedal" element={<Addmedalsport />} />
</Route>

        <Route path="/directordashboard" element={<ProtectedRoute allowedRoles={["director"]}><Directordashboard /></ProtectedRoute>}>
        <Route path="updatemedal/player" element={<Updatemedalplayer />} />
        
        <Route path="updatemedal/:id" element={<Updatemedalplayerwithdirector />} />
          <Route path="manage/player" element={<Manageplayer />} />
          <Route path="manage/studentorgranization" element={<Managestudentorgranization />} />
          <Route path="manage/director" element={<Managedirector/>} />
          <Route path="manage/news" element={<Managenews />} />
          <Route path="manage/medal" element={<Managemedalwithdirector />} />
          <Route path="addteam" element={<Addteamwithdirector />} />
          <Route path="addplayer" element={<Addplayer />} />
          <Route path="addcoach" element={<Addcoach />} />
          <Route path="adddirector" element={<Adddirector />} />
        
          <Route path="addresultsport" element={<Addresultsportwithdirector />} />
          <Route path="updateplayer/:id" element={<Updateplayer />} />
          <Route path="updatecoach/:id" element={<Updatecoach />} />
          <Route path="updatedirector/:id" element={<Updatedirector/>} />
          <Route path="updatenews/:id" element={<Updatenews />} />
          <Route path="updatestudentorgranization/:id" element={<Updatestudentorganization />} />
          <Route path="updatematchresult/:id" element={<Updatematchresultwithdirector />} />
          <Route path="managematchresult" element={<Managematchresultwithdirector/>} />
          <Route path="addmedal" element={<Addmedalsportwithdirector/>} />
          <Route path="updatemedalplayer/:id" element={<Updatemedalplayerwithdirector />} />
        </Route>



        
        <Route path="/resultsport" element={<Resultsport/>} />
        <Route path="/unauthorized" element={<Unauthorized/>} />
        <Route path="/reportplayer" element={<Reportplayer/>} />
        <Route path="/reportstudentorganization" element={<Reportstudentorganization/>} />
        <Route path="/reportdirector" element={<Reportdirector/>} />
        <Route path="/reportcoach" element={<Reportcoach/>} />
        <Route path="/searchcoach" element={<Searchcoach />} />
    
   
        <Route path="/searchstudentorganization" element={<Searchstudentorganization />} />
     

        <Route path="/searchplayer" element={<Searchplayer />} />
        <Route path="/searchdirector" element={<Searchesport />} />

      
        <Route path="/studentorganization/:id" element={<Stadium />} />



        <Route path="/director/:id" element={<Directorinfo />} />
        <Route path="/coach/:id" element={<Coachinfo />} />
        <Route path="/player/:id" element={<Playerinfo />} />
 
        <Route path="/studentorgranization/:id" element={<Studentorganizationinfo/>} />
        <Route path="/register" element={<Register />} />

        <Route path="/systemcard" element={<Systermcard />} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
      <FooterWrapper />
    </Router>
  );
};

const NavbarWrapper = () => {
  const location = useLocation();
  const showNavbar = 
    location.pathname === "/registeradmin" || 
    location.pathname === "/admindashboard" ||
    location.pathname === "/admindashboard/overview" ||
    location.pathname === "/admindashboard/approve/badminton" ||
    location.pathname === "/admindashboard/updatemedal/badminton" ||
    location.pathname === "/admindashboard/approve/basketball" ||
    location.pathname === "/admindashboard/updatemedal/basketball" ||
    location.pathname === "/admindashboard/approve/football" ||
    location.pathname === "/admindashboard/updatemedal/football" ||
    location.pathname === "/admindashboard/approve/futsal" ||
    location.pathname === "/admindashboard/approve/coach" ||
    location.pathname === "/admindashboard/approve/director" ||
    location.pathname === "/admindashboard/approve/studentorganization" ||
    location.pathname === "/admindashboard/updatemedal/futsal" ||
    location.pathname === "/admindashboard/approve/esport" ||
    location.pathname === "/admindashboard/updatemedal/esport" ||
    location.pathname === "/admindashboard/approve/takraw" ||
    location.pathname === "/admindashboard/updatemedal/takraw" ||
    location.pathname === "/admindashboard/approve/hooptakraw" ||
    location.pathname === "/admindashboard/updatemedal/hooptakraw" ||
    location.pathname === "/admindashboard/approve/volleyball" ||
    location.pathname === "/admindashboard/updatemedal/volleyball" ||
    location.pathname === "/admindashboard/approve/tabletenis" ||
    location.pathname === "/admindashboard/updatemedal/tabletenis" ||
    location.pathname === "/admindashboard/approve/petanque" ||
    location.pathname === "/admindashboard/updatemedal/petanque" ||
    location.pathname === "/admindashboard/manage/player" ||

    location.pathname === "/admindashboard/manage/studentorgranization" ||
    location.pathname === "/admindashboard/manage/coach" ||
    location.pathname === "/admindashboard/manage/director" ||
    location.pathname === "/admindashboard/addplayer" ||
    location.pathname === "/admindashboard/addcoach" ||
    location.pathname === "/admindashboard/adddirector" ||
    location.pathname === "/admindashboard/managematchresult" ||
    location.pathname.startsWith("/admindashboard/")||
 
    location.pathname === "/admindashboard/addstudentorgranization" ||
    location.pathname.startsWith("/admindashboard/studentorgranization/")||
    location.pathname.startsWith("/admindashboard/updatecoach/")||
    location.pathname.startsWith("/admindashboard/updatestudentorgranization/")||
    location.pathname.startsWith("/admindashboard/updatedirector/")||
    location.pathname === "/directordashboard" ||
    // Exclude updateplayer/:id route
location.pathname.startsWith("/directordashboard/updateplayer/")
||
    location.pathname.startsWith("/directordashboard/studentorgranization/")||  
    location.pathname.startsWith("/directordashboard/updatecoach/")||
    location.pathname.startsWith("/directordashboard/")||
    location.pathname.startsWith("/directordashboard/updatemedal")||
    location.pathname.startsWith("/directordashboard/updatedirector/")||
    location.pathname === "/directordashboard/managematchresult" ||
 

    // Exclude updateplayer/:id route
location.pathname.startsWith("/directordashboard/updateplayer/")

;


  return !showNavbar ? <Navbar /> : null;
};



const FooterWrapper = () => {
  const location = useLocation();
  const showFooter = 
    location.pathname === "/registeradmin" || 
    location.pathname === "/admindashboard" ||
    location.pathname === "/admindashboard/overview" ||
    location.pathname === "/admindashboard/approve/badminton" ||
    location.pathname === "/admindashboard/updatemedal/badminton" ||
    location.pathname === "/admindashboard/approve/basketball" ||
    location.pathname === "/admindashboard/updatemedal/basketball" ||
    location.pathname === "/admindashboard/approve/football" ||
    location.pathname === "/admindashboard/updatemedal/football" ||
    location.pathname === "/admindashboard/approve/futsal" ||
    location.pathname === "/admindashboard/approve/coach" ||
    location.pathname === "/admindashboard/approve/director" ||
    location.pathname === "/admindashboard/approve/studentorganization" ||
    location.pathname === "/admindashboard/updatemedal/futsal" ||
    location.pathname === "/admindashboard/approve/esport" ||
    location.pathname === "/admindashboard/updatemedal/esport" ||
    location.pathname === "/admindashboard/approve/takraw" ||
    location.pathname === "/admindashboard/updatemedal/takraw" ||
    location.pathname === "/admindashboard/approve/hooptakraw" ||
    location.pathname === "/admindashboard/updatemedal/hooptakraw" ||
    location.pathname === "/admindashboard/approve/volleyball" ||
    location.pathname === "/admindashboard/updatemedal/volleyball" ||
    location.pathname === "/admindashboard/approve/tabletenis" ||
    location.pathname === "/admindashboard/updatemedal/tabletenis" ||
    location.pathname === "/admindashboard/approve/petanque" ||
    location.pathname === "/admindashboard/updatemedal/petanque" ||
    location.pathname === "/admindashboard/manage/player" ||

    location.pathname === "/admindashboard/manage/studentorgranization" ||
    location.pathname === "/admindashboard/manage/coach" ||
    location.pathname === "/admindashboard/manage/director" ||
    location.pathname === "/admindashboard/addplayer" ||
    location.pathname === "/admindashboard/addcoach" ||
    location.pathname === "/admindashboard/adddirector" ||
    location.pathname === "/admindashboard/managematchresult" ||
    location.pathname.startsWith("/admindashboard/")||
 
    location.pathname === "/admindashboard/addstudentorgranization" ||
    location.pathname.startsWith("/admindashboard/studentorgranization/")||
    location.pathname.startsWith("/admindashboard/updatecoach/")||
    location.pathname.startsWith("/admindashboard/updatestudentorgranization/")||
    location.pathname.startsWith("/admindashboard/updatedirector/")||
    location.pathname === "/directordashboard" ||
    // Exclude updateplayer/:id route
location.pathname.startsWith("/directordashboard/updateplayer/")
||
    location.pathname.startsWith("/directordashboard/studentorgranization/")||  
    location.pathname.startsWith("/directordashboard/updatecoach/")||
    location.pathname.startsWith("/directordashboard/")||
    location.pathname.startsWith("/directordashboard/updatemedal")||
    location.pathname.startsWith("/directordashboard/updatedirector/")||
    location.pathname === "/directordashboard/managematchresult" ||
 

    // Exclude updateplayer/:id route
location.pathname.startsWith("/directordashboard/updateplayer/")

;


  return !showFooter ? <Footer /> : null;
};

export default App;
