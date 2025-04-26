import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Check, X, Bookmark, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { useUser } from '../context/UserContext';
import { Exercise } from '../types/exercises';
import { getExercises, toggleExerciseSaved } from '../lib/supabase/exercises';

const difficultyColors = {
  facile: 'bg-success/20 text-success',
  media: 'bg-warning/20 text-warning',
  difficile: 'bg-error/20 text-error'
};

const ExercisePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    user,
    isAuthenticated,
    completeExercise,
    useAiCredit,
    updateProgress
  } = useUser();
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'tutor', text: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [userSolution, setUserSolution] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      if (!isAuthenticated || exercises.length > 0) return;
      
      try {
        setLoading(true);
        const data = await getExercises();
        setExercises(data);
        const currentExercise = data.find(ex => ex.id === id);
        if (currentExercise) {
          setExercise(currentExercise);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [id, isAuthenticated, exercises.length]);

  useEffect(() => {
    if (exercises.length > 0 && id) {
      const currentExercise = exercises.find(ex => ex.id === id);
      if (currentExercise) {
        setExercise(currentExercise);
      }
    }
  }, [id, exercises]);

  useEffect(() => {
    if (user?.progress?.savedExercises && id) {
      const isSavedExercise = user.progress.savedExercises.includes(id);
      setIsSaved(isSavedExercise);
    }
  }, [user?.progress?.savedExercises, id]);

  const handleNext = () => {
    const currentIndex = exercises.findIndex(ex => ex.id === id);
    if (currentIndex < exercises.length - 1) {
      navigate(`/exercises/${exercises[currentIndex + 1].id}`);
      resetExerciseState();
    } else {
      navigate('/exercises');
    }
  };

  const handlePrevious = () => {
    const currentIndex = exercises.findIndex(ex => ex.id === id);
    if (currentIndex > 0) {
      navigate(`/exercises/${exercises[currentIndex - 1].id}`);
      resetExerciseState();
    }
  };

  const resetExerciseState = () => {
    setShowSolution(false);
    setIsCorrect(null);
    setChatOpen(false);
    setChatMessages([]);
    setUserSolution('');
  };

  const handleToggleSolution = () => {
    setShowSolution(!showSolution);
  };

  const handleMarkAsCorrect = () => {
    setIsCorrect(true);
    completeExercise(id || '');
    
    if (chatOpen) {
      setChatMessages(prev => [
        ...prev,
        { 
          sender: 'tutor', 
          text: 'Ottimo lavoro! Hai completato correttamente questo esercizio.' 
        }
      ]);
    }
  };

  const handleMarkAsIncorrect = () => {
    setIsCorrect(false);
    if (!chatOpen) {
      handleOpenChat();
    }
  };

  const handleOpenChat = () => {
    if (!useAiCredit()) {
      alert('Hai esaurito i crediti AI per oggi. Aggiorna il tuo piano per continuare a usare il tutor virtuale.');
      return;
    }
    
    setChatOpen(true);
    
    if (chatMessages.length === 0) {
      setChatMessages([
        { 
          sender: 'tutor', 
          text: `Ciao! Sono qui per aiutarti con questo esercizio di ${exercise?.subject}. Mi mostri come hai provato a risolverlo? Così posso capire dove posso esserti più utile.` 
        }
      ]);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: inputValue }
    ]);
    
    if (chatMessages.length === 1) {
      setUserSolution(inputValue);
    }
    
    setTimeout(() => {
      let response = '';
      
      if (chatMessages.length === 1) {
        response = `Ho dato un'occhiata alla tua soluzione. ${
          isCorrect === false 
            ? 'Vedo alcuni punti che possiamo migliorare insieme. ' 
            : 'Stai procedendo nella giusta direzione, ma possiamo approfondire alcuni aspetti. '
        }
        
Ecco un suggerimento: ${exercise?.solution_data.steps[0]}

Vuoi che ti guidi passo per passo nella risoluzione?`;
      } else {
        response = `Ecco come procederei per risolvere questo esercizio:
        
${exercise?.solution_data.final_answer.substring(0, 150)}...

Se hai dubbi su qualche passaggio, chiedimi pure!`;
      }
      
      setChatMessages(prev => [
        ...prev,
        { sender: 'tutor', text: response }
      ]);
    }, 1000);
    
    setInputValue('');
  };

  const handleToggleSaved = async () => {
    if (!user || !id || isToggling) return;
    
    setIsToggling(true);
    const newSavedState = !isSaved;
    
    try {
      // Update local state immediately for better UX
      setIsSaved(newSavedState);
      
      // Call the API
      const isNowSaved = await toggleExerciseSaved(user.id, id);
      
      // Get current saved exercises
      const currentSaved = user.progress.savedExercises || [];
      
      // Prepare the updated list
      const updatedSaved = isNowSaved
        ? [...new Set([...currentSaved, id])] // Use Set to prevent duplicates
        : currentSaved.filter(savedId => savedId !== id);
      
      // Update the user context with the new list
      await updateProgress({
        ...user.progress,
        savedExercises: updatedSaved
      });
      
      // Update local state to match the server state
      setIsSaved(isNowSaved);
      
    } catch (error) {
      console.error('Error toggling exercise saved status:', error);
      // Revert the local state in case of error
      setIsSaved(!newSavedState);
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Esercizio non trovato</h2>
        <p className="text-muted-foreground mb-4">
          L'esercizio che stai cercando non esiste o è stato rimosso.
        </p>
        <button 
          onClick={() => navigate('/exercises')}
          className="btn-primary"
        >
          Torna agli Esercizi
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation and header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/exercises')}
            className="mr-4 p-2 rounded-md hover:bg-muted transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">{exercise.topic}</h1>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 text-xs rounded-full ${difficultyColors[exercise.question_data.difficulty]}`}>
            {exercise.question_data.difficulty.charAt(0).toUpperCase() + exercise.question_data.difficulty.slice(1)}
          </div>
          
          <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
            {exercise.subject}
          </span>
          
          <button
            onClick={handleToggleSaved}
            className={`p-2 rounded-md ${isSaved ? 'text-primary' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
            title={isSaved ? 'Rimuovi dai salvati' : 'Salva esercizio'}
          >
            <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main exercise area */}
        <div className="lg:col-span-2">
        <div className="border rounded-lg shadow-sm bg-card mb-6">
            {/* Exercise content */}
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Esercizio</h2>
              <div className="latex-container">
                <Latex>{exercise.question_data.question}</Latex>
              </div>
            </div>
            
            {/* Answer section */}
            <div className="border-t p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Soluzione</h3>
                <button
                  onClick={handleToggleSolution}
                  className="btn-ghost"
                >
                  {showSolution ? (
                    <div className="flex items-center">
                      <EyeOff size={16} className="mr-2" />
                      <span>Nascondi</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Eye size={16} className="mr-2" />
                      <span>Mostra</span>
                    </div>
                  )}
                </button>
              </div>
              
              <AnimatePresence>
                {showSolution && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-muted rounded-md p-4 latex-container">
                      <Latex>{exercise.solution_data.steps}</Latex>
                      <Latex>{exercise.solution_data.final_answer}</Latex>
                    </div>
                    
                    {isCorrect === null && (
                      <div className="mt-4 flex items-center justify-center gap-4">
                        <p className="text-muted-foreground mr-2">
                          La tua risposta era corretta?
                        </p>
                        <button
                          onClick={handleMarkAsCorrect}
                          className="btn-outline bg-success/10 text-success border-success/30 hover:bg-success/20"
                        >
                          <Check size={16} className="mr-2" />
                          Corretta
                        </button>
                        <button
                          onClick={handleMarkAsIncorrect}
                          className="btn-outline bg-error/10 text-error border-error/30 hover:bg-error/20"
                        >
                          <X size={16} className="mr-2" />
                          Sbagliata
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {!showSolution && isCorrect === null && (
                <div className="rounded-md border border-dashed border-muted-foreground/30 p-6 flex flex-col items-center justify-center text-center text-muted-foreground">
                  <p className="mb-4">Prova a risolvere l'esercizio prima di vedere la soluzione.</p>
                  <p className="text-sm">Quando sei pronto, clicca "Mostra" per verificare la tua risposta.</p>
                </div>
              )}
              
              {isCorrect === true && !chatOpen && (
                <div className="mt-4 p-4 rounded-md bg-success/10 border border-success/30 text-success flex items-center">
                  <Check size={18} className="mr-2" />
                  <span>Ottimo lavoro! Hai completato questo esercizio correttamente.</span>
                </div>
              )}
              
              {isCorrect === false && !chatOpen && (
                <div className="mt-4 p-4 rounded-md bg-error/10 border border-error/30 text-error flex items-center">
                  <X size={18} className="mr-2" />
                  <span>
                    La tua risposta non è corretta. 
                    <button 
                      onClick={handleOpenChat}
                      className="underline ml-1 font-medium"
                    >
                      Chiedi aiuto al tutor
                    </button>
                  </span>
                </div>
              )}
            </div>
          </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              className="btn-outline flex items-center"
              disabled={exercises.findIndex(ex => ex.id === id) === 0}
            >
              <ChevronLeft size={16} className="mr-2" />
              Precedente
            </button>
            
            <button
              onClick={handleNext}
              className="btn-primary flex items-center"
            >
              Successivo
              <ChevronRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
        
        {/* Chat with tutor */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg shadow-sm bg-card h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                  <MessageSquare size={16} />
                </div>
                <h3 className="font-medium">Tutor Virtuale</h3>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {user?.aiCreditsRemaining} crediti rimasti
              </div>
            </div>
            
            {!chatOpen ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                <MessageSquare size={48} className="mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Hai bisogno di aiuto?</h3>
                <p className="mb-6">Il tutor virtuale può aiutarti a capire meglio questo esercizio.</p>
                <button
                  onClick={handleOpenChat}
                  className="btn-primary"
                >
                  Chiedi al Tutor
                </button>
              </div>
            ) : (
              <>
                {/* Chat messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">
                          <Latex>{msg.text}</Latex>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Chat input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Scrivi un messaggio..."
                      className="input flex-1"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className={`p-2 rounded-md ${
                        !inputValue.trim()
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-primary text-white'
                      }`}
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;