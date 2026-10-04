import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext";

import "./index.css";
import "./App.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
  <ThemeProvider>
    <AuthProvider>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </AuthProvider>
  </ThemeProvider>
</BrowserRouter>
  </React.StrictMode>
);