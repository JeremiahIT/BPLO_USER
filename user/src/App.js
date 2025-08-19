import React from 'react';
import './dashboard/dashboard.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard/dashboard';
import NewPermit from './permit/newpermit';
import RenewalPermit from './permit/renewalpermit';
import Login from './LoginPage/login';
import Registration from './LoginPage/registration';
import Forgot from './LoginPage/forgotpassword';
import './App.css';

/**
 * Main application component that sets up the routing for different pages.
 * The root path '/' is now set to display the Login component.
 * @returns {JSX.Element} The application router.
 */
function App() {
  return (
    <Router>
      <Routes>
        
        {/* The home page ('/') now points to the Login component. */}
        <Route path="/" element={<Login />} />

        {/* Other routes remain the same. */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/newpermit" element={<NewPermit />} />
        <Route path="/renewalpermit" element={<RenewalPermit />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgotpassword" element={<Forgot />} />

        {/* You can remove the '/login' route as it is now redundant with the home route. */}
        {/* <Route path="/login" element={<Login />} /> */}

      </Routes>
    </Router>
  );
}

export default App;
