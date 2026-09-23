import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import AboutDesti from '../pages/AboutDesti';
import Register from '../pages/Register';
import Login from '../pages/Login';
import ProtectedAuth from './ProtectedAuth';
import Tours from '../pages/Tours';
import Planner from '../component/Planner';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/about"
        element={
          <ProtectedAuth>
            <AboutDesti />
          </ProtectedAuth>
        }
      />
      <Route
        path="/tours"
        element={
          <ProtectedAuth>
            <Tours />
          </ProtectedAuth>
        }
      />
      <Route
        path="/planner"
        element={
          <ProtectedAuth>
            <Planner />
          </ProtectedAuth>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedAuth>
            <Profile />
          </ProtectedAuth>
        }
      />

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;