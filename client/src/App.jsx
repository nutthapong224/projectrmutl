import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles'; 
import Approvebadminton from "./pages/Approvebadminton";

import BadmintonForm from "./pages/BadmintonForm";
import Searchbadminton from "./pages/Searchbadmintons";
import Playerbadminton from "./pages/Playerbadmintons";

import Searchbasketball from "./pages/Searchbasketball";
import Playerbasketball from "./pages/Playerbasketball";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Systermcard from "./pages/Systemcard";
import NotFoundPage from "./pages/Notfoundpage";
import Sporttypecard from "./pages/Sporttypecard";
import SporttypeRegister from "./pages/SporttypeRegister";
import SearchOrganizations from "./pages/SearchOrganizations";
import OrganizationForm from "./pages/OrganizationsForm";
import Organizationscard from "./pages/Organizationscard";
import ProtectedRoute from "./pages/Protectedroutes";
import RegisterAdmin from "./pages/Registeradmin";
import Loginadmin from "./pages/Loginadmin";
import Reportbadminton from "./pages/Reportbadminton";
import Updatamedalbadminton from "./pages/Updatemedalbadminton";
import BasketballForm from "./pages/BasketballForm";
import HomePage from "./pages/Homepage";
import UsersPage from "./pages/Userspage";
import SettingsPage from "./pages/Settingspage";
import BasketballPage from "./pages/BasketballPage";
import FootballPage from "./pages/FootballPage";
import TableTennisPage from "./pages/TableTennisPage";
import Dashboardadmin from "./component/Admindashboard";
import Approvebasketball from "./pages/Approvebasketball";
import Updatemedalbasketball from "./pages/Updatemedalbasketball"; 
import Approvefootball from "./pages/Approvefootball";
import FootballForm from "./pages/FootballForm";
import Searchfootball from "./pages/Searchfootball";
import Updatemedalfootball from "./pages/Updatemedalfootball";
import Reportfootball from "./pages/Reportfootball";
import Approvefutsal from "./pages/Approvefutsal";
import Updatemedalfutsal from "./pages/Updatemedalfutsal";
import FutsalForm from "./pages/FutsalForm";
import Searchfutsal from "./pages/Searchfutsal";
import Reportfutsal from "./pages/Reportfutsal";
import Searchesport from "./pages/Searchesport";
import Updatemedalesport from "./pages/Updatemedalesport";
import Approveesport from "./pages/Approveesport";
import Reportesport from "./pages/Reportesport";
import EsportForm from "./pages/EsportForm";
import TakrawForm from "./pages/TakrawForm";
import Updatemedaltakraw from "./pages/Updatemedaltakraw"; 
import Searchtakraw from "./pages/Searchtakraw";
import Approvetakraw from "./pages/Approvetakraw";
import Reporttakraw from "./pages/Reporttakraw";
import HooptakrawForm from "./pages/HooptakrawForm";
import Searchhooptakraw from "./pages/Searchhooptakraw";
import Updatemedalhooptakraw from "./pages/Updatemedalhooptakraw";
import Approvehooptakraw from "./pages/Approvehooptakraw";
import Reporthooptakraw from "./pages/Reporthooptakraw";
import VolleyballForm from "./pages/VolleyballForm";
import Approvevolleyball from "./pages/Approvevolleyball";
import Updatemedalvolleyball from "./pages/Updatemedalvolleyball";
import Reportvolleyball from "./pages/Reportvolleyball";
import Searchvolleyball from "./pages/Searchvolleyball";
import Searchtabletenis from "./pages/Searchtabletenis";
import Reporttabletenis from "./pages/Reporttabletenis";
import Approvetabletenis from "./pages/Approvetabletenis";
import Updatemedaltabletenis from "./pages/Updatemedaltabletenis";
import TabletenisForm from "./pages/TabletenisForm";
import PetanqueForm from "./pages/PetanqueForm";
import Reportpetanque from "./pages/Reportpetanque";
import Approvepetanque from "./pages/Approvepetanque";
import Searchpetanque from "./pages/Searchpetanque";
import Updatemedalpetanque from "./pages/Updatemedalpetanque";
import Playerfootball from "./pages/Playerfootball";
import Playerfutsal from "./pages/Playerfutsal";
import Playervolleyball from "./pages/Playervolleyball";
import Playertabletenis from "./pages/Playertabletenis";
import Playeresport from "./pages/Playeresport";
import Playertakraw from "./pages/Playertakraw";
import Playerpetanque from "./pages/Playerpetanque";
import Reportbasketball from "./pages/Reportbasketball";




import './App.css';

import Overview from "./pages/Overview";
import Navbar from "./components/Navbar";
import Playerhooptakraw from "./pages/Playerhooptakraw";

const App = () => {
  return (
    <Router>
      <NavbarWrapper />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createbadminton" element={<BadmintonForm />} />
        <Route path="/createbasketball" element={<BasketballForm />} />
        <Route path="/createfootball" element={<FootballForm />} />
        <Route path="/createtakraw" element={<TakrawForm />} />
        <Route path="/createfutsal" element={<FutsalForm />} />
        <Route path="/createesport" element={<EsportForm />} />
        <Route path="/createpetanque" element={<PetanqueForm />} />
        <Route path="/createvolleyball" element={<VolleyballForm/>} />
        <Route path="/createhooptakraw" element={<HooptakrawForm />} />
        <Route path="/createtabletenis" element={<TabletenisForm />} />
        <Route path="/loginadmin" element={<Loginadmin />} />
        <Route path="/registeradmin" element={<RegisterAdmin />} />
        <Route path="/admindashboard" element={  <ProtectedRoute><Dashboardadmin /></ProtectedRoute>}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="approve/coach" element={<Overview />} />
          <Route path="approve/director" element={<Overview />} />
          <Route path="approve/badminton" element={< Approvebadminton />} />
          <Route path="approve/football" element={< Approvefootball/>} />
          <Route path="approve/basketball" element={< Approvebasketball />} />
          <Route path="approve/takraw" element={< Approvetakraw />} />
          <Route path="approve/hooptakraw" element={< Approvehooptakraw />} />
          <Route path="approve/futsal" element={< Approvefutsal />} />
          <Route path="approve/esport" element={< Approveesport />} />
          <Route path="approve/tabletenis" element={< Approvetabletenis />} />
          <Route path="approve/volleyball" element={< Approvevolleyball />} />
          <Route path="approve/petanque" element={< Approvepetanque />} />
          <Route path="updatemedal/badminton" element={< Updatamedalbadminton />} />
          <Route path="updatemedal/volleyball" element={< Updatemedalvolleyball />} />
          <Route path="updatemedal/basketball" element={< Updatemedalbasketball />} />
          <Route path="updatemedal/futsal" element={< Updatemedalfutsal />} />
          <Route path="updatemedal/football" element={< Updatemedalfootball />} />
          <Route path="updatemedal/esport" element={< Updatemedalesport />} />
          <Route path="updatemedal/takraw" element={< Updatemedaltakraw />} />
          <Route path="updatemedal/hooptakraw" element={< Updatemedalhooptakraw />} />
          <Route path="updatemedal/tabletenis" element={< Updatemedaltabletenis />} />
          <Route path="updatemedal/petanque" element={< Updatemedalpetanque />} />
          <Route path="approve/organization" element={<Overview />} />
        </Route>
  
   

        <Route path="/reportbadminton" element={<Reportbadminton/>} />
        <Route path="/reportfutsal" element={<Reportfutsal/>} />
        <Route path="/reportfootball" element={<Reportfootball/>} />
        
        <Route path="/reportbasketball" element={<Reportbasketball/>} />
        <Route path="/reportesport" element={<Reportesport/>} />
        <Route path="/reporttakraw" element={<Reporttakraw/>} />
        <Route path="/reporthooptakraw" element={<Reporthooptakraw/>} />
        <Route path="/reporttabletenis" element={<Reporttabletenis/>} />
        <Route path="/reportvolleyball" element={<Reportvolleyball/>} />
        <Route path="/reportpetanque" element={<Reportpetanque/>} />
        <Route path="/createstudentorganizationform" element={<OrganizationForm />} />
        <Route path="/searchbadminton" element={<Searchbadminton />} />
        <Route path="/searchfootball" element={<Searchfootball />} />
        <Route path="/searchbasketball" element={<Searchbasketball />} />
        <Route path="/searchfutsal" element={<Searchfutsal />} />
        <Route path="/searchesport" element={<Searchesport />} />
        <Route path="/searchtakraw" element={<Searchtakraw />} />
        <Route path="/searchvolleyball" element={<Searchvolleyball/>} />
        <Route path="/searchhooptakraw" element={<Searchhooptakraw />} />
        <Route path="/searchtabletenis" element={<Searchtabletenis/>} />
        <Route path="/searchpetanque" element={<Searchpetanque/>} />
        <Route path="/searchstudentorganization" element={<SearchOrganizations />} />
        <Route path="/playerbadminton/:id" element={<Playerbadminton />} />
        <Route path="/playerbasketball/:id" element={<Playerbasketball />} />
        <Route path="/playerfootball/:id" element={<Playerfootball />} />
        <Route path="/playerfutsal/:id" element={<Playerfutsal />} />
        <Route path="/playertabletenis/:id" element={<Playertabletenis />} />
        <Route path="/playervolleyball/:id" element={<Playervolleyball />} />
        <Route path="/playeresport/:id" element={<Playeresport />} />
        <Route path="/playertakraw/:id" element={<Playertakraw />} />
        <Route path="/playerpetanque/:id" element={<Playerpetanque />} />
        <Route path="/playerhooptakraw/:id" element={<Playerhooptakraw />} />
        <Route path="/studentorgranization/:id" element={<Organizationscard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sporttypecard" element={<Sporttypecard />} />
        <Route path="/sporttyperegister" element={<SporttypeRegister />} />
        <Route path="/systemcard" element={<Systermcard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

const NavbarWrapper = () => {
  const location = useLocation();
  const showNavbar = location.pathname === "/loginadmin" || location.pathname === "/registeradmin"|| location.pathname === "/admindashboard"|| location.pathname === "/admindashboard/overview"|| location.pathname === "/admindashboard/approve/badminton"|| location.pathname === "/admindashboard/updatemedal/badminton"||location.pathname === "/admindashboard/approve/basketball"||location.pathname === "/admindashboard/updatemedal/basketball"||location.pathname === "/admindashboard/approve/football"||location.pathname === "/admindashboard/updatemedal/football"||location.pathname === "/admindashboard/approve/futsal"||location.pathname === "/admindashboard/updatemedal/futsal"||location.pathname === "/admindashboard/approve/esport"||location.pathname === "/admindashboard/updatemedal/esport"||location.pathname === "/admindashboard/approve/takraw"||location.pathname === "/admindashboard/updatemedal/takraw"||location.pathname === "/admindashboard/approve/hooptakraw"||location.pathname === "/admindashboard/updatemedal/hooptakraw"||location.pathname === "/admindashboard/approve/volleyball"||location.pathname === "/admindashboard/updatemedal/volleyball"||location.pathname === "/admindashboard/approve/tabletenis"||location.pathname === "/admindashboard/updatemedal/tabletenis"||location.pathname === "/admindashboard/approve/petanque"||location.pathname === "/admindashboard/updatemedal/petanque"
  ;

  return !showNavbar ? <Navbar /> : null;
};

export default App;
