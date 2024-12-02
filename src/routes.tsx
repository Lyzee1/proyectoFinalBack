import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import App from "./App";
import AppHeroes from "./componentes/sesion";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} /> {}
        <Route path="/sesion" element={<AppHeroes />} /> {}
        <Route path="*" element={<Navigate to="/" />} /> {}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
