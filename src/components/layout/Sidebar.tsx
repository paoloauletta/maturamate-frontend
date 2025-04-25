import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, BrainCircuit, ClipboardCheck, User, X, Star, BarChart } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();
  const { user } = useUser();

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      
      <motion.aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-background border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
      >
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link to="/" className="flex items-center">
            <BrainCircuit className="h-6 w-6 text-primary mr-2" />
            <span className="text-xl font-bold text-foreground">MaturaMate</span>
          </Link>
          
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-2 text-muted-foreground hover:bg-muted transition-colors md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="py-4 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="px-4 mb-8">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{user?.name}</div>
                <div className="text-sm text-muted-foreground">{user?.plan === 'premium' ? 'Piano Premium' : user?.plan === 'classe' ? 'Piano Classe' : 'Piano Free'}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="rounded-md bg-muted p-2 text-center">
                <div className="text-sm font-medium">{user?.progress.streak}</div>
                <div className="text-xs text-muted-foreground">Giorni</div>
              </div>
              <div className="rounded-md bg-muted p-2 text-center">
                <div className="text-sm font-medium">{user?.aiCreditsRemaining}</div>
                <div className="text-xs text-muted-foreground">Crediti AI</div>
              </div>
            </div>
          </div>
          
          <nav className="space-y-1 px-2">
            <Link
              to="/"
              className={`flex items-center px-4 py-3 rounded-md text-base ${
                location.pathname === '/'
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
              }`}
            >
              <Home size={20} className="mr-3" />
              Dashboard
            </Link>
            
            <Link
              to="/exercises"
              className={`flex items-center px-4 py-3 rounded-md text-base ${
                location.pathname.includes('/exercises')
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
              }`}
            >
              <BookOpen size={20} className="mr-3" />
              Esercizi
            </Link>
            
            <Link
              to="/simulations"
              className={`flex items-center px-4 py-3 rounded-md text-base ${
                location.pathname.includes('/simulations')
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
              }`}
            >
              <ClipboardCheck size={20} className="mr-3" />
              Simulazioni
            </Link>
            
            <Link
              to="/tutor"
              className={`flex items-center px-4 py-3 rounded-md text-base ${
                location.pathname === '/tutor'
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
              }`}
            >
              <BrainCircuit size={20} className="mr-3" />
              Tutor Virtuale
            </Link>
          </nav>
          
          <div className="mt-8 px-2">
            <div className="px-4 mb-2 text-xs font-semibold text-muted-foreground">Il Tuo Studio</div>
            <Link
              to="/profile"
              className={`flex items-center px-4 py-3 rounded-md text-base ${
                location.pathname === '/profile'
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
              }`}
            >
              <User size={20} className="mr-3" />
              Il Tuo Profilo
            </Link>
            
            <Link
              to="/saved"
              className={`flex items-center px-4 py-3 rounded-md text-base text-muted-foreground hover:bg-muted hover:text-foreground transition-colors`}
            >
              <Star size={20} className="mr-3" />
              Esercizi Salvati
            </Link>
            
            <Link
              to="/progress"
              className={`flex items-center px-4 py-3 rounded-md text-base text-muted-foreground hover:bg-muted hover:text-foreground transition-colors`}
            >
              <BarChart size={20} className="mr-3" />
              Statistiche
            </Link>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;