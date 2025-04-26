import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Filter, CheckCircle, Clock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Exercise, Difficulty } from '../types/exercises';
import { getSavedExercises } from '../lib/supabase';
import { motion } from 'framer-motion';

interface SavedExercise extends Exercise {
  savedAt: string;
}

const difficultyColors = {
  facile: 'bg-success/20 text-success',
  media: 'bg-warning/20 text-warning',
  difficile: 'bg-error/20 text-error'
};

const SavedExercises = () => {
  const { user, isAuthenticated } = useUser();
  const [exercises, setExercises] = useState<SavedExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Algebra' | 'Geometria' | 'Analisi' | 'Probabilità'>('all');
  const [difficulty, setDifficulty] = useState<'all' | Difficulty>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'difficulty' | 'category'>('recent');

  useEffect(() => {
    const fetchSavedExercises = async () => {
      try {
        if (!isAuthenticated || !user) {
          return;
        }
        setLoading(true);
        const data = await getSavedExercises(user.id);
        console.log('Fetched exercises:', data);
        setExercises(data);
      } catch (error) {
        console.error('Error fetching saved exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedExercises();
  }, [user, isAuthenticated]);
  
  const filteredExercises = exercises.filter(ex => {
    const matchesCategory = filter === 'all' ? true : ex.subject === filter;
    const matchesDifficulty = difficulty === 'all' ? true : ex.question_data.difficulty === difficulty;
    return matchesCategory && matchesDifficulty;
  });

  const sortedExercises = [...filteredExercises].sort((a, b) => {
    if (sortBy === 'difficulty') {
      const difficultyOrder = { facile: 0, media: 1, difficile: 2 };
      return difficultyOrder[a.question_data.difficulty] - difficultyOrder[b.question_data.difficulty];
    }
    if (sortBy === 'category') {
      return a.subject.localeCompare(b.subject);
    }
    // 'recent' uses the savedAt timestamp
    return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
  });

  const isCompleted = (id: string) => user?.progress.completedExercises.includes(id) || false;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Esercizi Salvati</h1>
        <p className="text-muted-foreground">
          Rivedi e pratica con gli esercizi che hai salvato per dopo.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-sm font-medium mb-2">Categoria</h2>
          <div className="flex flex-wrap gap-2">
            {['all', 'Algebra', 'Geometria', 'Analisi', 'Probabilità'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category as any)}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  filter === category
                    ? 'bg-primary text-white border-primary'
                    : 'border-border hover:border-primary/50 transition-colors'
                }`}
              >
                {category === 'all' ? 'Tutte' : category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-medium mb-2">Difficoltà</h2>
          <div className="flex flex-wrap gap-2">
            {['all', 'facile', 'media', 'difficile'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level as any)}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  difficulty === level
                    ? 'bg-primary text-white border-primary'
                    : 'border-border hover:border-primary/50 transition-colors'
                }`}
              >
                {level === 'all' ? 'Tutte' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-medium mb-2">Ordina per</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'recent', label: 'Più recenti' },
              { value: 'difficulty', label: 'Difficoltà' },
              { value: 'category', label: 'Categoria' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as any)}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  sortBy === option.value
                    ? 'bg-primary text-white border-primary'
                    : 'border-border hover:border-primary/50 transition-colors'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercises grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedExercises.map((exercise) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="border rounded-lg overflow-hidden shadow-sm bg-card hover:border-primary/50 transition-colors"
          >
            <Link to={`/exercises/${exercise.id}`} className="block p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium">{exercise.topic}</h3>
                <div className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[exercise.question_data.difficulty]}`}>
                  {exercise.question_data.difficulty.charAt(0).toUpperCase() + exercise.question_data.difficulty.slice(1)}
                </div>
              </div>

              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <BookOpen size={16} className="mr-2" />
                <span>{exercise.subject}</span>
              </div>

              <div className="flex items-center gap-3">
                {isCompleted(exercise.id) ? (
                  <span className="text-sm text-success flex items-center">
                    <CheckCircle size={14} className="mr-1" />
                    Completato
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Clock size={14} className="mr-1" />
                    Da completare
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {sortedExercises.length === 0 && (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Star size={48} className="mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">Nessun esercizio salvato</h3>
          <p className="text-muted-foreground mb-4">
            Non hai ancora salvato nessun esercizio. Esplora gli esercizi disponibili e salva quelli che vuoi rivedere dopo.
          </p>
          <Link to="/exercises" className="btn-primary">
            Esplora Esercizi
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedExercises;