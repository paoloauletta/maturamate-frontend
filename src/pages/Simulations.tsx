import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Clock, Award, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import { simulations } from '../data/simulations';

const Simulations = () => {
  const { user } = useUser();
  const [filter, setFilter] = useState<'all' | 'official' | 'ai'>('all');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  
  const filteredSimulations = simulations.filter(sim => {
    const matchesType = filter === 'all' ? true : 
                     filter === 'official' ? sim.isOfficial : 
                     !sim.isOfficial;
    
    const matchesDifficulty = difficulty === 'all' ? true : 
                           sim.difficulty === difficulty;
    
    return matchesType && matchesDifficulty;
  });
  
  const hasCompletedSimulation = (id: string) => {
    return user?.progress.completedSimulations.includes(id) || false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Simulazioni d'Esame</h1>
        <p className="text-muted-foreground">
          Preparati all'esame di maturità con simulazioni complete in condizioni realistiche.
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-sm font-medium mb-2">Tipo</h2>
          <div className="flex rounded-md overflow-hidden border border-border">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 px-3 text-sm ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-card hover:bg-muted transition-colors'
              }`}
            >
              Tutte
            </button>
            <button
              onClick={() => setFilter('official')}
              className={`flex-1 py-2 px-3 text-sm ${
                filter === 'official'
                  ? 'bg-primary text-white'
                  : 'bg-card hover:bg-muted transition-colors'
              }`}
            >
              Ufficiali
            </button>
            <button
              onClick={() => setFilter('ai')}
              className={`flex-1 py-2 px-3 text-sm ${
                filter === 'ai'
                  ? 'bg-primary text-white'
                  : 'bg-card hover:bg-muted transition-colors'
              }`}
            >
              Generate AI
            </button>
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-sm font-medium mb-2">Difficoltà</h2>
          <div className="flex rounded-md overflow-hidden border border-border">
            <button
              onClick={() => setDifficulty('all')}
              className={`flex-1 py-2 px-3 text-sm ${
                difficulty === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-card hover:bg-muted transition-colors'
              }`}
            >
              Tutte
            </button>
            <button
              onClick={() => setDifficulty('easy')}
              className={`flex-1 py-2 px-3 text-sm ${
                difficulty === 'easy'
                  ? 'bg-primary text-white'
                  : 'bg-card hover:bg-muted transition-colors'
              }`}
            >
              Facile
            </button>
            <button
              onClick={() => setDifficulty('medium')}
              className={`flex-1 py-2 px-3 text-sm ${
                difficulty === 'medium'
                  ? 'bg-primary text-white'
                  : 'bg-card hover:bg-muted transition-colors'
              }`}
            >
              Media
            </button>
            <button
              onClick={() => setDifficulty('hard')}
              className={`flex-1 py-2 px-3 text-sm ${
                difficulty === 'hard'
                  ? 'bg-primary text-white'
                  : 'bg-card hover:bg-muted transition-colors'
              }`}
            >
              Difficile
            </button>
          </div>
        </div>
      </div>
      
      {/* Simulations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSimulations.map((simulation) => (
          <motion.div
            key={simulation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="border rounded-lg overflow-hidden shadow-sm bg-card flex flex-col"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-lg">{simulation.title}</h3>
                {simulation.isOfficial ? (
                  <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                    <Award size={12} className="mr-1" />
                    Ufficiale
                  </div>
                ) : (
                  <div className="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded-full flex items-center">
                    <FileText size={12} className="mr-1" />
                    AI
                  </div>
                )}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <CalendarClock size={16} className="mr-2" />
                <span>Anno {simulation.year}</span>
                <span className="mx-2">•</span>
                <Clock size={16} className="mr-2" />
                <span>{Math.floor(simulation.duration / 60)}h {simulation.duration % 60 > 0 ? `${simulation.duration % 60}m` : ''}</span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Difficoltà:</span>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${
                    simulation.difficulty === 'easy' 
                      ? 'bg-success/20 text-success' 
                      : simulation.difficulty === 'medium'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-error/20 text-error'
                  }`}>
                    {simulation.difficulty === 'easy' ? 'Facile' : 
                     simulation.difficulty === 'medium' ? 'Media' : 'Difficile'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Problemi:</span>
                  <span className="text-sm">{simulation.sections.reduce((acc, section) => acc + section.problems.length, 0)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stato:</span>
                  {hasCompletedSimulation(simulation.id) ? (
                    <span className="text-sm text-success flex items-center">
                      <CheckCircle size={14} className="mr-1" />
                      Completata
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Non completata</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-auto border-t p-4">
              <Link
                to={`/simulations/${simulation.id}`}
                className="btn-primary w-full flex items-center justify-center"
              >
                {hasCompletedSimulation(simulation.id) ? 'Rivedi Simulazione' : 'Inizia Simulazione'}
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredSimulations.length === 0 && (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <FileText size={48} className="mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">Nessuna simulazione trovata</h3>
          <p className="text-muted-foreground mb-4">
            Non ci sono simulazioni che corrispondono ai filtri selezionati.
          </p>
          <button
            onClick={() => {
              setFilter('all');
              setDifficulty('all');
            }}
            className="btn-outline"
          >
            Reimposta filtri
          </button>
        </div>
      )}
    </div>
  );
};

export default Simulations;