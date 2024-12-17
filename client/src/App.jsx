import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { Container } from "@mui/material";

import BadmintonForm from "./pages/BadmintonForm"; 
import Searchbadminton from "./pages/Searchbadmintons";
import Playerbadminton from "./pages/Playerbadmintons"; 
import BasketballForm from "./pages/BasketballForm";
import Searchbasketball from "./pages/Searchbasketball";
import Playerbasketball from "./pages/Playerbasketball"; 
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
import Dashboard from "./pages/Dashboard"; 
import HomePage from "./pages/Homepage"; 
import UsersPage from "./pages/Userspage"; 
import SettingsPage from "./pages/Settingspage"; 
import BasketballPage from "./pages/BasketballPage"; 
import FootballPage from "./pages/FootballPage"; 
import TableTennisPage from "./pages/TableTennisPage";

const theme = createTheme({
  typography: {
    fontFamily: "'Kanit', sans-serif",
  },
});

const AppWithNavbar = ({ children }) => {
  const location = useLocation();
  
  // List of paths where Navbar should be hidden
  const noNavbarPaths = ["/dashboard"]; // Hide Navbar for any path that starts with /dashboard

  // Check if the current path matches one where the Navbar is hidden
  const shouldHideNavbar = location.pathname.startsWith(noNavbarPaths[0]);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}> 
      <Router>
        <AppWithNavbar>
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />  
              <Route path="/createbadminton" element={<BadmintonForm />} />   
              <Route path="/loginadmin" element={<Loginadmin />} />    
              <Route path="/registeradmin" element={<RegisterAdmin />} />     
              <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
>
  {/* Default route for /dashboard */}
  <Route index element={<HomePage />} />
  <Route path="sports/basketball" element={<BasketballPage />} />
  <Route path="sports/football" element={<FootballPage />} />
  <Route path="sports/tabletennis" element={<TableTennisPage />} />

  {/* Nested Routes */}
  <Route path="users" element={<UsersPage />} />
  <Route path="settings" element={<SettingsPage />} />
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
          </Container>
        </AppWithNavbar>
      </Router>
    </ThemeProvider>
  );
};

export default App;
