import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdvancedOperations from './pages/AdvancedOperations';
import DirectoryViewer from "./pages/DirectoryViewer";
import LoginPage from "./pages/LoginPage";
import NavbarContext from "./context/NavbarContext";
import { NavbarState } from "./utils/Constants";
import { useState } from "react";
function App() {
  const [navbarState, setNavbarState] = useState(NavbarState.HOME);
  return (
    <NavbarContext.Provider value={{navbarState, setNavbarState}}>
      <BrowserRouter>
        <Routes>
          <Route path="/advanceoperations" element={<AdvancedOperations />} />
          <Route path="/directory" element={<DirectoryViewer />} />
          <Route path="/" element={<DirectoryViewer />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </NavbarContext.Provider>
  );
}

export default App;
