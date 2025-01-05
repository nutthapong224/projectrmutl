import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import BadmintonForm from "./pages/BadmintonForm";
import Searchbadminton from "./pages/Searchbadmintons";
import Playerbadminton from "./pages/Playerbadmintons";
import BasketballForm from "./pages/BasketballForm";
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

import HomePage from "./pages/Homepage";
import UsersPage from "./pages/Userspage";
import SettingsPage from "./pages/Settingspage";
import BasketballPage from "./pages/BasketballPage";
import FootballPage from "./pages/FootballPage";
import TableTennisPage from "./pages/TableTennisPage";
import Dashboardadmin from "./component/Admindashboard";

import './App.css';

import Overview from "./pages/Overview";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <NavbarWrapper />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/createbadminton" element={<BadmintonForm />} />
        <Route path="/loginadmin" element={<Loginadmin />} />
        <Route path="/registeradmin" element={<RegisterAdmin />} />
        <Route path="/admindashboard" element={  <ProtectedRoute><Dashboardadmin /></ProtectedRoute>}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="approve/coach" element={<Overview />} />
          <Route path="approve/director" element={<Overview />} />
          <Route path="approve/football" element={<Overview />} />
          <Route path="approve/organization" element={<Overview />} />
        </Route>
  
   
        <Route path="/createbasketball" element={<BasketballForm />} />
        <Route path="/createstudentorganizationform" element={<OrganizationForm />} />
        <Route path="/searchbadminton" element={<Searchbadminton />} />
        <Route path="/searchbasketball" element={<Searchbasketball />} />
        <Route path="/searchstudentorganization" element={<SearchOrganizations />} />
        <Route path="/playerbadminton/:id" element={<Playerbadminton />} />
        <Route path="/playerbasketball/:id" element={<Playerbasketball />} />
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
  const showNavbar = location.pathname === "/loginadmin" || location.pathname === "/registeradmin"|| location.pathname === "/admindashboard"|| location.pathname === "/admindashboard/overview";

  return !showNavbar ? <Navbar /> : null;
};

export default App;
