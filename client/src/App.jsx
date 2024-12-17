import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

const theme = createTheme({
  typography: {
    fontFamily: "'Kanit', sans-serif",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}> 
      <Router>
        <Navbar />
        <Container>
          <Routes>
          <Route path="/" element={<Home />} />  
            <Route path="/createbadminton" element={<BadmintonForm />} />   
            <Route path="/loginadmin" element={<Loginadmin/>} />    
            <Route path="/registeradmin" element={<RegisterAdmin/>} />     
            <Route path="/dashboard"  element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } /> 
            <Route path="/createbasketball" element={<BasketballForm />} />  
            <Route path="/createstudentorganizationform" element={<OrganizationForm />} />  
            <Route path="/searchbadminton" element={<Searchbadminton />} />  
            <Route path="/searchbasketball" element={<Searchbasketball />} />  
            <Route path="/searchstudentorganization" element={<SearchOrganizations />} /> 
            <Route path="/playerbadminton/:id" element={<Playerbadminton />} /> 
            <Route path="/playerbasketball/:id" element={<Playerbasketball />} />  
            <Route path="/studentorgranization/:id" element={<Organizationscard />} /> 
            <Route path="/register" element={<Register />} /> 
            <Route path="/sporttypecard" element={<Sporttypecard/>} />  
            <Route path="/sporttyperegister" element={<SporttypeRegister/>} /> 
            <Route path="/systemcard" element={<Systermcard />} /> 
            <Route path="*" element={<NotFoundPage />} /> 
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
