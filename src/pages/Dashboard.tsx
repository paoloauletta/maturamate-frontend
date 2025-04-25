import { useState } from 'react';
import { BookOpen, BrainCircuit, ClipboardCheck, BarChart, Award, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold mb-2">
          Benvenuto, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          Continua la tua preparazione per la maturità di matematica.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Streak</div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Award size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{user?.progress.streak} giorni</div>
          <div className="text-xs text-muted-foreground">
            Continua così per mantenere il tuo streak!
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Esercizi Completati</div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {user?.progress.completedExercises.length}
          </div>
          <div className="text-xs text-muted-foreground">
            Su un totale di 150 esercizi
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Simulazioni</div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ClipboardCheck size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">
            {user?.progress.completedSimulations.length}
          </div>
          <div className="text-xs text-muted-foreground">
            Simulazioni completate
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Crediti AI</div>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <BrainCircuit size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{user?.aiCreditsRemaining}</div>
          <div className="text-xs text-muted-foreground">
            Crediti rimanenti oggi
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/exercises"
          className="group border rounded-lg p-6 bg-card hover:border-primary/50 transition-colors"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <BookOpen size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">Esercizi</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Pratica con esercizi di varia difficoltà divisi per argomento.
          </p>
          <span className="text-sm text-primary group-hover:underline">
            Vai agli esercizi →
          </span>
        </Link>

        <Link
          to="/simulations"
          className="group border rounded-lg p-6 bg-card hover:border-primary/50 transition-colors"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <ClipboardCheck size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">Simulazioni</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Mettiti alla prova con simulazioni complete d'esame.
          </p>
          <span className="text-sm text-primary group-hover:underline">
            Inizia una simulazione →
          </span>
        </Link>

        <Link
          to="/tutor"
          className="group border rounded-lg p-6 bg-card hover:border-primary/50 transition-colors"
        >
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <BrainCircuit size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">Tutor Virtuale</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Ottieni aiuto personalizzato dal nostro tutor virtuale.
          </p>
          <span className="text-sm text-primary group-hover:underline">
            Chiedi al tutor →
          </span>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium">Attività Recente</h2>
        </div>
        
        <div className="divide-y">
          {user?.progress.completedExercises.slice(-3).map((exerciseId, index) => (
            <div key={exerciseId} className="p-4 flex items-center">
              <div className="h-8 w-8 rounded-full bg-success/10 text-success flex items-center justify-center mr-4">
                <CheckCircle size={16} />
              </div>
              <div>
                <div className="font-medium">Esercizio Completato</div>
                <div className="text-sm text-muted-foreground">
                  Hai completato l'esercizio {exerciseId}
                </div>
              </div>
            </div>
          ))}

          {user?.progress.completedExercises.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <BarChart size={32} className="mx-auto mb-2 text-muted-foreground/50" />
              <p>Nessuna attività recente</p>
            </div>
          )}
        </div>
      </div>

      {/* Saved Exercises */}
      <div className="border rounded-lg bg-card overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium">Esercizi Salvati</h2>
        </div>
        
        <div className="divide-y">
          {user?.progress.savedExercises.slice(-3).map((exerciseId, index) => (
            <div key={exerciseId} className="p-4 flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
                <Star size={16} />
              </div>
              <div>
                <div className="font-medium">Esercizio Salvato</div>
                <div className="text-sm text-muted-foreground">
                  Hai salvato l'esercizio {exerciseId}
                </div>
              </div>
            </div>
          ))}

          {user?.progress.savedExercises.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Star size={32} className="mx-auto mb-2 text-muted-foreground/50" />
              <p>Nessun esercizio salvato</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;