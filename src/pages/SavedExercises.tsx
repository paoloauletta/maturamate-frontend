import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Filter, CheckCircle, Clock } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { exercises, Exercise } from '../data/exercises';
import { motion } from 'framer-motion';

const SavedExercises = () => {
  const { user } = useUser();
  const [filter, setFilter] = useState<'all' | 'algebra' | 'geometry' | 'analysis' | 'probability'>('all');
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'difficulty' | 'category'>('recent');

  const savedExercises = exercises.filter(ex => user?.progress.savedExercises.includes(ex.id));
  
  const filteredExercises = savedExercises.filter(ex => {
    const matchesCategory = filter === 'all' ? true : ex.category === filter;
    const matchesDifficulty = difficulty === 'all' ? true : ex.difficulty === difficulty;
    return matchesCategory && matchesDifficulty;
  });

  const sortedExercises = [...filteredExercises].sort((a, b) => {
    if (sortBy === 'difficulty') {
      const difficultyOrder = { easy: 0, medium: 1, hard: 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    }
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    return 0; // 'recent' uses the default order
  });

  const isCompleted = (id: string) => user?.progress.completedExercises.includes(id) || false;

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
            {['all', 'algebra', 'geometry', 'analysis', 'probability'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category as any)}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  filter === category
                    ? 'bg-primary text-white border-primary'
                    : 'border-border hover:border-primary/50 transition-colors'
                }`}
              >
                {category === 'all' ? 'Tutte' :
                 category === 'algebra' ? 'Algebra' :
                 category === 'geometry' ? 'Geometria' :
                 category === 'analysis' ? 'Analisi' : 'Probabilità'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-medium mb-2">Difficoltà</h2>
          <div className="flex flex-wrap gap-2">
            {['all', 'easy', 'medium', 'hard'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level as any)}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  difficulty === level
                    ? 'bg-primary text-white border-primary'
                    : 'border-border hover:border-primary/50 transition-colors'
                }`}
              >
                {level === 'all' ? 'Tutte' :
                 level === 'easy' ? 'Facile' :
                 level === 'medium' ? 'Media' : 'Difficile'}
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
                <h3 className="font-medium">{exercise.title}</h3>
                <div className={`text-xs px-2 py-0.5 rounded-full ${
                  exercise.difficulty === 'easy'
                    ? 'bg-success/20 text-success'
                    : exercise.difficulty === 'medium'
                      ? 'bg-warning/20 text-warning'
                      : 'bg-error/20 text-error'
                }`}>
                  {exercise.difficulty === 'easy' ? 'Facile' :
                   exercise.difficulty === 'medium' ? 'Media' : 'Difficile'}
                </div>
              </div>

              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <BookOpen size={16} className="mr-2" />
                <span>
                  {exercise.category === 'algebra' ? 'Algebra' :
                   exercise.category === 'geometry' ? 'Geometria' :
                   exercise.category === 'analysis' ? 'Analisi' : 'Probabilità'}
                </span>
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
                <span className="text-sm text-primary flex items-center">
                  <Star size={14} className="mr-1" fill="currentColor" />
                  Salvato
                </span>
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