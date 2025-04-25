import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, CheckCircle, AlertTriangle, MessageSquare, ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { useUser } from '../context/UserContext';
import { simulations, Simulation, SimulationProblem } from '../data/simulations';

const SimulationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, completeSimulation, useAiCredit } = useUser();
  
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'tutor', text: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentFocus, setCurrentFocus] = useState<SimulationProblem | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Find the simulation in our data
    const currentSimulation = simulations.find(sim => sim.id === id);
    
    if (currentSimulation) {
      setSimulation(currentSimulation);
      
      // Check if the user has already completed this simulation
      const isAlreadyCompleted = user?.progress.completedSimulations.includes(currentSimulation.id) || false;
      setIsCompleted(isAlreadyCompleted);
      
      if (isAlreadyCompleted) {
        setShowResults(true);
      }
    }
    
    setLoading(false);
  }, [id, user?.progress.completedSimulations]);
  
  useEffect(() => {
    // Handle timer logic
    if (isRunning && simulation && remainingTime !== null) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev === null || prev <= 0) {
            handleFinishSimulation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, simulation]);
  
  const handleStartSimulation = () => {
    if (!simulation) return;
    
    setStartTime(new Date());
    setRemainingTime(simulation.duration * 60); // Convert minutes to seconds
    setIsRunning(true);
  };
  
  const handleFinishSimulation = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setIsRunning(false);
    setIsCompleted(true);
    completeSimulation(id || '');
    setShowConfetti(true);
    
    // Hide confetti after a few seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleViewResults = () => {
    setShowResults(true);
  };
  
  const handleOpenChat = (problem: SimulationProblem) => {
    if (!useAiCredit()) {
      alert('Hai esaurito i crediti AI per oggi. Aggiorna il tuo piano per continuare a usare il tutor virtuale.');
      return;
    }
    
    setCurrentFocus(problem);
    setChatOpen(true);
    
    if (chatMessages.length === 0 || currentFocus?.id !== problem.id) {
      setChatMessages([
        { 
          sender: 'tutor', 
          text: `Sono qui per aiutarti a comprendere questo problema. Ecco il testo dell'esercizio:\n\n${problem.text}\n\nCosa vorresti approfondire riguardo questo problema?`
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
    
    // Generate AI response
    setTimeout(() => {
      let response = '';
      
      if (currentFocus) {
        if (inputValue.toLowerCase().includes('soluzione') || inputValue.toLowerCase().includes('risposta')) {
          response = `Ecco la soluzione dettagliata del problema:\n\n${currentFocus.solution}\n\nSpero questa spiegazione ti sia utile. Hai altre domande?`;
        } else if (inputValue.toLowerCase().includes('aiuto') || inputValue.toLowerCase().includes('suggerimento')) {
          response = `Per risolvere questo problema, ti consiglio di seguire questi passaggi:\n\n1. Analizza attentamente il testo e identifica chiaramente cosa ti viene chiesto\n2. Organizzia le informazioni date in modo sistematico\n3. Applica le formule e i teoremi appropriati\n\nPosso fornirti un inizio della soluzione, se vuoi.`;
        } else {
          response = `Riguardo alla tua domanda, posso spiegarti meglio questo aspetto del problema. \n\nIn matematica, quando affrontiamo questo tipo di esercizi, è importante ricordare che ${currentFocus.text.substring(0, 50)}...\n\nVuoi che ti mostri la soluzione completa o preferisci qualche suggerimento per procedere autonomamente?`;
        }
      } else {
        response = `Mi dispiace, ma sembra che ci sia stato un problema nel focus sul problema attuale. Puoi selezionare nuovamente un problema su cui vorresti ricevere aiuto?`;
      }
      
      setChatMessages(prev => [
        ...prev,
        { sender: 'tutor', text: response }
      ]);
    }, 1500);
    
    setInputValue('');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!simulation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Simulazione non trovata</h2>
        <p className="text-muted-foreground mb-4">
          La simulazione che stai cercando non esiste o è stata rimossa.
        </p>
        <button 
          onClick={() => navigate('/simulations')}
          className="btn-primary"
        >
          Torna alle Simulazioni
        </button>
      </div>
    );
  }
  
  // Flatten all problems for easy navigation
  const allProblems = simulation.sections.flatMap(section => 
    section.problems.map(problem => ({
      ...problem,
      sectionTitle: section.title
    }))
  );
  
  return (
    <div className="min-h-[calc(100vh-16rem)]">
      {showConfetti && (
        <div ref={confettiRef} className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
        </div>
      )}
      
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/simulations')}
            className="mr-4 p-2 rounded-md hover:bg-muted transition-colors"
            disabled={isRunning}
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">{simulation.title}</h1>
        </div>
        
        {isRunning && remainingTime !== null && (
          <div className={`flex items-center px-3 py-1 rounded-md border ${
            remainingTime < 600 ? 'border-error text-error' : 'border-muted text-foreground'
          }`}>
            <Clock size={16} className="mr-2" />
            <span className="font-mono font-medium">{formatTime(remainingTime)}</span>
          </div>
        )}
      </div>
      
      {/* Content based on state */}
      {!isRunning && !isCompleted && (
        <div className="border rounded-lg shadow-sm bg-card p-6 text-center">
          <h2 className="text-xl font-medium mb-4">Inizia la Simulazione</h2>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-muted-foreground mb-6">
              Stai per iniziare la simulazione d'esame "{simulation.title}". 
              La durata è di {Math.floor(simulation.duration / 60)} ore{simulation.duration % 60 > 0 ? ` e ${simulation.duration % 60} minuti` : ''}.
              Durante la simulazione avrai accesso solo all'esame, senza poter consultare altre risorse.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <div className="flex-1 flex items-center justify-center p-4 rounded-md bg-muted max-w-xs mx-auto">
                <Clock size={18} className="text-primary mr-2" />
                <span className="text-sm">{Math.floor(simulation.duration / 60)}h {simulation.duration % 60 > 0 ? `${simulation.duration % 60}m` : ''}</span>
              </div>
              
              <div className="flex-1 flex items-center justify-center p-4 rounded-md bg-muted max-w-xs mx-auto">
                <CheckCircle size={18} className="text-primary mr-2" />
                <span className="text-sm">{simulation.sections.reduce((acc, section) => acc + section.problems.length, 0)} Problemi</span>
              </div>
            </div>
            
            <div className="p-4 rounded-md bg-warning/10 border border-warning/30 text-warning mb-6 inline-flex items-start text-sm">
              <AlertTriangle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-left">
                Una volta iniziata, il timer partirà. Puoi terminare la simulazione in qualsiasi momento cliccando su "Termina", ma non potrai riprendere da dove hai lasciato.
              </span>
            </div>
            
            <button
              onClick={handleStartSimulation}
              className="btn-primary w-full sm:w-auto px-8"
            >
              Inizia Simulazione
            </button>
          </div>
        </div>
      )}
      
      {isRunning && (
        <div className="border rounded-lg shadow-sm bg-card">
          <div className="flex justify-between items-center border-b p-4">
            <h2 className="font-medium">Esame in corso</h2>
            <button
              onClick={handleFinishSimulation}
              className="btn-outline text-sm"
            >
              Termina
            </button>
          </div>
          
          <div className="p-6">
            {/* PDF Viewer would go here - for now just show a placeholder */}
            <div className="aspect-[1/1.414] w-full max-w-4xl mx-auto bg-muted border rounded-md flex items-center justify-center">
              <div className="text-center p-6">
                <p className="text-muted-foreground mb-4">
                  Qui verrebbe visualizzato il PDF dell'esame.
                  {/* In a real application, we would embed a PDF viewer here */}
                  {/* For example: <iframe src={simulation.pdfUrl} className="w-full h-full" /> */}
                </p>
                <p className="text-sm text-muted-foreground">
                  Testo dell'esame: {simulation.pdfUrl}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isCompleted && !showResults && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="border rounded-lg shadow-sm bg-card p-6 text-center"
        >
          <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          
          <h2 className="text-xl font-medium mb-2">Simulazione Completata!</h2>
          
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Hai completato con successo la simulazione d'esame "{simulation.title}".
            Ora puoi visualizzare le soluzioni corrette e ottenere assistenza dal tutor virtuale.
          </p>
          
          <button
            onClick={handleViewResults}
            className="btn-primary"
          >
            Visualizza Risultati
          </button>
        </motion.div>
      )}
      
      {showResults && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main results area */}
          <div className="lg:col-span-2">
            <div className="border rounded-lg shadow-sm bg-card mb-6">
              <div className="border-b p-4">
                <h2 className="font-medium">Soluzioni e Spiegazioni</h2>
              </div>
              
              <div className="divide-y">
                {simulation.sections.map((section) => (
                  <div key={section.id} className="p-6">
                    <h3 className="text-lg font-medium mb-4">{section.title}</h3>
                    
                    <div className="space-y-8">
                      {section.problems.map((problem) => (
                        <div key={problem.id} className="border-l-4 border-primary/50 pl-4">
                          <div className="mb-3">
                            <div className="latex-container">
                              <Latex>{problem.text}</Latex>
                            </div>
                          </div>
                          
                          <div className="mb-4 bg-muted rounded-md p-4 latex-container">
                            <h4 className="text-sm font-medium mb-2">Soluzione:</h4>
                            <Latex>{problem.solution}</Latex>
                          </div>
                          
                          <button
                            onClick={() => handleOpenChat(problem)}
                            className="text-sm text-primary flex items-center hover:underline"
                          >
                            <MessageSquare size={16} className="mr-1" />
                            Chiedi assistenza al tutor
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Chat with tutor */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg shadow-sm bg-card sticky top-20 h-[calc(100vh-10rem)]">
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
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground h-[calc(100%-4rem)]">
                  <MessageSquare size={48} className="mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">Hai bisogno di aiuto?</h3>
                  <p className="mb-6">Seleziona un problema a sinistra per ricevere assistenza dal tutor virtuale.</p>
                </div>
              ) : (
                <div className="flex flex-col h-[calc(100%-4rem)]">
                  {/* Selected problem */}
                  {currentFocus && (
                    <div className="p-3 border-b bg-muted">
                      <button
                        onClick={() => setChatOpen(false)}
                        className="flex items-center text-xs text-muted-foreground mb-2 hover:text-foreground transition-colors"
                      >
                        <ArrowLeft size={12} className="mr-1" />
                        Torna alla selezione
                      </button>
                      <div className="text-sm">
                        <h4 className="font-medium mb-1">Problema selezionato:</h4>
                        <p className="latex-container text-xs">
                          <Latex>{currentFocus.text.substring(0, 100)}...</Latex>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Chat messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    <AnimatePresence initial={false}>
                      {chatMessages.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.sender === 'user'
                                ? 'bg-primary text-white'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="latex-container whitespace-pre-wrap text-sm">
                              <Latex>{msg.text}</Latex>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  
                  {/* Chat input */}
                  <div className="p-4 border-t mt-auto">
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationPage;