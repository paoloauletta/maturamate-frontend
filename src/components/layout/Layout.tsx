import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useState } from 'react';
import { useUser } from '../../context/UserContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useUser();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && (
        <>
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <MobileNav onMenuClick={toggleSidebar} />
        </>
      )}
      
      <div className={`flex-1 ${isAuthenticated ? 'md:ml-72' : ''} pt-16 md:pt-0`}>
        <main className="p-4 md:p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
        
        <footer className="py-4 px-6 border-t border-border mt-8">
          <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-2 sm:mb-0">
              © {new Date().getFullYear()} MaturaMate. Tutti i diritti riservati.
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Termini
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contatti
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;