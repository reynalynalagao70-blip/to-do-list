import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import ListItem from "./pages/ListItem.jsx";
import ListItemsDetail from "./pages/ListItemsDetail.jsx"; // 1. I-import mo ang details page
import "./css/globals.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/listitem" element={<ListItem />} />
        
        {/* 2. Idagdag itong route na may :id parameter */}
        <Route path="/list/:id" element={<ListItemsDetail />} /> 
      </Routes>
    </BrowserRouter>
  </StrictMode>
);