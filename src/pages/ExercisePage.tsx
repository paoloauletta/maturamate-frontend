import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye, EyeOff, Check, X, Bookmark, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { useUser } from '../context/UserContext';
import { exercises, Exercise } from '../data/exercises';

const ExercisePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    user, 
    completeExercise, 
    saveExercise, 
    useAiCredit 
  } = useUser();
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'tutor', text: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [userSolution, setUserSolution] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Find the exercise in our data
    const currentExercise = exercises.find(ex => ex.id === id);
    
    if (currentExercise) {
      setExercise(currentExercise);
      setIsSaved(user?.progress.savedExercises.includes(currentExercise.id) || false);
    }
    
    setLoading(false);
  }, [id, user?.progress.savedExercises]);

  const handleNext = () => {
    // Find index of current exercise and navigate to next
    const currentIndex = exercises.findIndex(ex => ex.id === id);
    if (currentIndex < exercises.length - 1) {
      navigate(`/exercises/${exercises[currentIndex + 1].id}`);
      resetExerciseState();
    } else {
      navigate('/exercises');
    }
  };

  const handlePrevious = () => {
    // Find index of current exercise and navigate to previous
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
    
    // Add congratulatory message if chat is open
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
    // Open chat if not already open
    if (!chatOpen) {
      handleOpenChat();
    }
  };

  const handleOpenChat = () => {
    // Check if user has AI credits
    if (!useAiCredit()) {
      alert('Hai esaurito i crediti AI per oggi. Aggiorna il tuo piano per continuare a usare il tutor virtuale.');
      return;
    }
    
    setChatOpen(true);
    
    if (chatMessages.length === 0) {
      setChatMessages([
        { 
          sender: 'tutor', 
          text: `Sono qui per aiutarti con questo esercizio su "${exercise?.title}". Prima di tutto, qual è stata la tua risposta? Così posso vedere dove potresti aver avuto difficoltà.` 
        }
      ]);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: inputValue }
    ]);
    
    // Check if this is the first user message (their solution)
    if (chatMessages.length === 1) {
      setUserSolution(inputValue);
    }
    
    // Generate AI response
    setTimeout(() => {
      let response = '';
      
      if (chatMessages.length === 1) {
        // First user message - compare their solution
        response = `Grazie per aver condiviso la tua soluzione. Confrontandola con la soluzione corretta, noto che ${
          isCorrect === false 
            ? 'ci sono alcuni punti da chiarire. ' 
            : 'stai procedendo bene, ma possiamo approfondire. '
        }
        
Ecco un suggerimento utile: ${exercise?.hints[0]}

Vuoi che ti spieghi passo per passo come risolvere questo problema?`;
      } else {
        // Follow-up responses
        response = `Ecco come affronterei questo esercizio:
        
${exercise?.solution.substring(0, 150)}...

Se hai domande specifiche su qualche passaggio, sentiti libero di chiedere!`;
      }
      
      setChatMessages(prev => [
        ...prev,
        { sender: 'tutor', text: response }
      ]);
    }, 1000);
    
    setInputValue('');
  };

  const handleToggleSaved = () => {
    saveExercise(id || '');
    setIsSaved(!isSaved);
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
          <h1 className="text-2xl font-bold">{exercise.title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            exercise.difficulty === 'easy' 
              ? 'bg-success/20 text-success' 
              : exercise.difficulty === 'medium'
                ? 'bg-warning/20 text-warning'
                : 'bg-error/20 text-error'
          }`}>
            {exercise.difficulty === 'easy' ? 'Facile' : exercise.difficulty === 'medium' ? 'Medio' : 'Difficile'}
          </span>
          
          <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
            {exercise.category === 'algebra' ? 'Algebra' : 
             exercise.category === 'geometry' ? 'Geometria' : 
             exercise.category === 'analysis' ? 'Analisi' : 'Probabilità'}
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
                <Latex>{exercise.content}</Latex>
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
                      <Latex>{exercise.solution}</Latex>
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