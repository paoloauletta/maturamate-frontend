import { Link, useLocation } from 'react-router-dom';
import { Menu, UserCircle, BookOpen, BrainCircuit, ClipboardCheck, Home } from 'lucide-react';
import { useUser } from '../../context/UserContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useUser();

  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 md:px-6">
        <button 
          onClick={onMenuClick}
          className="mr-4 rounded-md p-2 text-muted-foreground hover:bg-muted transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        
        <Link to="/" className="flex items-center">
          <BrainCircuit className="h-6 w-6 text-primary mr-2" />
          <span className="text-xl font-bold text-foreground">MaturaMate</span>
        </Link>
        
        <nav className="hidden md:flex items-center ml-10 space-x-4">
          <Link 
            to="/" 
            className={`flex items-center px-3 py-2 text-sm rounded-md ${
              location.pathname === '/' 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
            }`}
          >
            <Home size={18} className="mr-2" />
            Dashboard
          </Link>
          
          <Link 
            to="/exercises" 
            className={`flex items-center px-3 py-2 text-sm rounded-md ${
              location.pathname.includes('/exercises') 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
            }`}
          >
            <BookOpen size={18} className="mr-2" />
            Esercizi
          </Link>
          
          <Link 
            to="/simulations" 
            className={`flex items-center px-3 py-2 text-sm rounded-md ${
              location.pathname.includes('/simulations') 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
            }`}
          >
            <ClipboardCheck size={18} className="mr-2" />
            Simulazioni
          </Link>
          
          <Link 
            to="/tutor" 
            className={`flex items-center px-3 py-2 text-sm rounded-md ${
              location.pathname === '/tutor' 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
            }`}
          >
            <BrainCircuit size={18} className="mr-2" />
            Tutor Virtuale
          </Link>
        </nav>
        
        <div className="ml-auto flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center">
              <div className="mr-4 hidden md:block">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.plan === 'premium' ? 'Piano Premium' : user?.plan === 'classe' ? 'Piano Classe' : 'Piano Free'}</div>
              </div>
              
              <Link to="/profile" className="relative">
                <UserCircle className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                  {user?.progress.streak}
                </span>
              </Link>
            </div>
          ) : (
            <button className="btn-primary">
              Accedi
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;