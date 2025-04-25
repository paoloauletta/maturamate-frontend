import { Link, useLocation } from 'react-router-dom';
import { Menu, UserCircle, BrainCircuit } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileNavProps {
  onMenuClick: () => void;
}

const MobileNav = ({ onMenuClick }: MobileNavProps) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border md:hidden">
      <div className="flex h-16 items-center px-4">
        <button 
          onClick={onMenuClick}
          className="mr-4 rounded-md p-3 text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        
        <Link to="/" className="flex items-center">
          <BrainCircuit className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold text-foreground">MaturaMate</span>
        </Link>
        
        <div className="ml-auto">
          {isAuthenticated ? (
            <Link to="/profile" className="relative p-2">
              <UserCircle className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                {user?.progress.streak}
              </span>
            </Link>
          ) : (
            <button className="btn-primary text-base px-5 py-2.5">
              Accedi
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileNav;