// Layout.jsx - CORREGIDO
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from "./ThemeContext";

const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`d-flex flex-column min-vh-100 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
      <Header />
      <main className="flex-grow-1" style={{ minHeight: "calc(100vh - 200px)" }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;