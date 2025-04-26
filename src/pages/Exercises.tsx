import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, CheckCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Exercise } from '../types/exercises';
import { getExercises } from '../lib/supabase/exercises';

const difficultyColors = {
  facile: 'bg-success/20 text-success',
  media: 'bg-warning/20 text-warning',
  difficile: 'bg-error/20 text-error'
};

const Exercises = () => {
  const { user, isAuthenticated, toggleSavedExercise } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'Algebra' | 'Geometria' | 'Analisi' | 'Probabilità'>('all');
  const [difficulty, setDifficulty] = useState<'all' | 'facile' | 'media' | 'difficile'>('all');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        // Only start loading when auth state is determined
        if (!isAuthenticated) {
          return;
        }
        setLoading(true);
        setError(null);
        const data = await getExercises();
        setExercises(data);
      } catch (err) {
        console.error('Error fetching exercises:', err);
        setError('Errore nel caricamento degli esercizi. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [isAuthenticated]);

  const filteredExercises = exercises.filter(ex => {
    const matchesCategory = filter === 'all' ? true : ex.subject === filter;
    const matchesDifficulty = difficulty === 'all' ? true : ex.question_data.difficulty === difficulty;
    return matchesCategory && matchesDifficulty;
  });

  const isCompleted = (id: string) => user?.progress.completedExercises.includes(id) || false;
  const isSaved = (id: string) => user?.progress.savedExercises?.includes(id) || false;

  const handleSaveClick = async (e: React.MouseEvent, exerciseId: string) => {
    e.preventDefault(); // Prevent navigation
    await toggleSavedExercise(exerciseId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium mb-2">Errore</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Riprova
        </button>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium mb-2">Nessun esercizio trovato</h3>
        <p className="text-muted-foreground mb-4">
          Non ci sono esercizi disponibili al momento.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Esercizi</h1>
        <p className="text-muted-foreground">
          Pratica con esercizi di varia difficoltà divisi per argomento.
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
                {category === 'all' ? 'Tutti' : category}
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
      </div>

      {/* Exercises grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((exercise) => (
          <Link
            key={exercise.id}
            to={`/exercises/${exercise.id}`}
            className="border rounded-lg overflow-hidden shadow-sm bg-card hover:border-primary/50 transition-colors"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium">{exercise.topic}</h3>
                <div className="flex items-center gap-2">
                  <div className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[exercise.question_data.difficulty]}`}>
                    {exercise.question_data.difficulty.charAt(0).toUpperCase() + exercise.question_data.difficulty.slice(1)}
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <BookOpen size={16} className="mr-2" />
                <span>{exercise.subject}</span>
              </div>

              <div className="flex items-center gap-3">
                {isCompleted(exercise.id) && (
                  <span className="text-sm text-success flex items-center">
                    <CheckCircle size={14} className="mr-1" />
                    Completato
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <BookOpen size={48} className="mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">Nessun esercizio trovato</h3>
          <p className="text-muted-foreground mb-4">
            Non ci sono esercizi che corrispondono ai filtri selezionati.
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

export default Exercises;