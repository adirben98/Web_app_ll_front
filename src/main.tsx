import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import Header from "./Components/Header.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="573846018719-v4i54h2q3amau5ib272gnu250d5roobl.apps.googleusercontent.com">
    <React.StrictMode>
      <BrowserRouter>
        <Header/>
          <App />
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
