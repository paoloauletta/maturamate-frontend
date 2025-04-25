import { useState } from 'react';
import { BarChart, LineChart, PieChart, Activity, TrendingUp, Clock, Target, Brain } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';

const Statistics = () => {
  const { user } = useUser();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Mock data - in a real app, this would come from the backend
  const mockData = {
    weeklyProgress: [
      { day: 'Lun', exercises: 5 },
      { day: 'Mar', exercises: 7 },
      { day: 'Mer', exercises: 4 },
      { day: 'Gio', exercises: 8 },
      { day: 'Ven', exercises: 6 },
      { day: 'Sab', exercises: 3 },
      { day: 'Dom', exercises: 5 }
    ],
    subjectPerformance: {
      algebra: 85,
      geometry: 70,
      analysis: 90,
      probability: 75
    },
    timeSpent: {
      total: 24, // hours
      bySubject: {
        algebra: 8,
        geometry: 5,
        analysis: 7,
        probability: 4
      }
    },
    successRate: {
      overall: 78,
      byDifficulty: {
        easy: 90,
        medium: 75,
        hard: 60
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Statistiche</h1>
        <p className="text-muted-foreground">
          Monitora i tuoi progressi e identifica le aree di miglioramento.
        </p>
      </div>

      {/* Time range selector */}
      <div className="flex gap-2">
        {[
          { value: 'week', label: 'Settimana' },
          { value: 'month', label: 'Mese' },
          { value: 'year', label: 'Anno' }
        ].map((range) => (
          <button
            key={range.value}
            onClick={() => setTimeRange(range.value as any)}
            className={`px-4 py-2 rounded-md text-sm ${
              timeRange === range.value
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Esercizi Completati</div>
            <Activity size={20} className="text-primary" />
          </div>
          <div className="text-2xl font-bold">{user?.progress.completedExercises.length}</div>
          <div className="text-xs text-muted-foreground">
            +12 questa settimana
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Tasso di Successo</div>
            <TrendingUp size={20} className="text-success" />
          </div>
          <div className="text-2xl font-bold">{mockData.successRate.overall}%</div>
          <div className="text-xs text-muted-foreground">
            +5% dal mese scorso
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Ore di Studio</div>
            <Clock size={20} className="text-primary" />
          </div>
          <div className="text-2xl font-bold">{mockData.timeSpent.total}h</div>
          <div className="text-xs text-muted-foreground">
            Media di 3.5h al giorno
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Streak</div>
            <Target size={20} className="text-primary" />
          </div>
          <div className="text-2xl font-bold">{user?.progress.streak} giorni</div>
          <div className="text-xs text-muted-foreground">
            Record personale: 15 giorni
          </div>
        </div>
      </div>

      {/* Performance charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-medium mb-4">Progresso Settimanale</h2>
          <div className="h-64 flex items-end justify-between px-2">
            {mockData.weeklyProgress.map((day, index) => (
              <div key={day.day} className="flex flex-col items-center">
                <div 
                  className="w-8 bg-primary/20 rounded-t-md transition-all duration-500"
                  style={{ 
                    height: `${(day.exercises / 10) * 100}%`,
                    backgroundColor: index === 4 ? 'hsl(var(--primary))' : undefined
                  }}
                />
                <div className="mt-2 text-sm text-muted-foreground">{day.day}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-medium mb-4">Performance per Materia</h2>
          <div className="space-y-4">
            {Object.entries(mockData.subjectPerformance).map(([subject, score]) => (
              <div key={subject}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">
                    {subject === 'algebra' ? 'Algebra' :
                     subject === 'geometry' ? 'Geometria' :
                     subject === 'analysis' ? 'Analisi' : 'Probabilità'}
                  </span>
                  <span className="font-medium">{score}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Suggerimenti del Tutor</h2>
          <Brain size={24} className="text-primary" />
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Analisi Matematica</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Hai mostrato difficoltà con i limiti di funzioni razionali. Ti suggerisco di:
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                Rivedere la scomposizione in fattori
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                Praticare con limiti che presentano forme indeterminate
              </li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Geometria</h3>
            <p className="text-sm text-muted-foreground mb-3">
              I tuoi risultati in geometria solida sono migliorati. Per continuare:
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                Affronta esercizi più complessi di geometria solida
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                Prova a combinare concetti di geometria con l'analisi
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;