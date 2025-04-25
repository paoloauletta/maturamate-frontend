import { useState, useRef, useEffect } from 'react';
import { Send, BookOpen, Plus, RotateCw, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: Date;
  isLoading?: boolean;
  relatedExercise?: string;
}

const mockTutorResponses: { [key: string]: string } = {
  "derivate": "La derivata di una funzione $f(x)$ nel punto $x_0$ è definita come:\n\n$$f'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h) - f(x_0)}{h}$$\n\nEsempi comuni:\n- $\\frac{d}{dx}(x^n) = nx^{n-1}$\n- $\\frac{d}{dx}(e^x) = e^x$\n- $\\frac{d}{dx}(\\ln x) = \\frac{1}{x}$",
  
  "integrali": "L'integrale indefinito di una funzione $f(x)$ è:\n\n$$\\int f(x) dx = F(x) + C$$\n\ndove $F'(x) = f(x)$ e $C$ è una costante arbitraria.\n\nL'integrale definito è dato da:\n\n$$\\int_{a}^{b} f(x) dx = F(b) - F(a)$$",
  
  "limiti": "Per calcolare il limite di una funzione $f(x)$ quando $x$ si avvicina a un valore $a$, scriviamo:\n\n$$\\lim_{x \\to a} f(x) = L$$\n\nDove $L$ è il valore limite. Ricorda le forme indeterminate come $\\frac{0}{0}$, $\\frac{\\infty}{\\infty}$, $0 \\cdot \\infty$, ecc.",
  
  "default": "Sono il tuo tutor virtuale per la matematica! Posso aiutarti con argomenti come:\n\n1. Algebra\n2. Geometria\n3. Analisi matematica (limiti, derivate, integrali)\n4. Probabilità e statistica\n\nCome posso aiutarti oggi?"
};

const generateMockResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('derivat')) {
    return mockTutorResponses.derivate;
  } else if (lowerQuery.includes('integral')) {
    return mockTutorResponses.integrali;
  } else if (lowerQuery.includes('limit')) {
    return mockTutorResponses.limiti;
  }
  
  return mockTutorResponses.default;
};

const VirtualTutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'tutor',
      text: 'Ciao! Sono il tuo tutor virtuale di matematica. Come posso aiutarti oggi con la preparazione per la maturità?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, useAiCredit } = useUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    // Check if user has AI credits
    if (!useAiCredit()) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'user',
          text: inputValue,
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: 'Mi dispiace, hai esaurito i tuoi crediti AI per oggi. Aggiorna il tuo piano per continuare a usare il tutor virtuale.',
          timestamp: new Date(),
        }
      ]);
      
      setInputValue('');
      return;
    }
    
    // Add user message
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        text: inputValue,
        timestamp: new Date(),
      },
      {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: '',
        timestamp: new Date(),
        isLoading: true,
      }
    ]);
    
    setInputValue('');
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Simulate response delay
    setTimeout(() => {
      const response = generateMockResponse(inputValue);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading 
            ? { ...msg, text: response, isLoading: false } 
            : msg
        )
      );
      
      setIsTyping(false);
    }, 1500);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'tutor',
        text: 'Ciao! Sono il tuo tutor virtuale di matematica. Come posso aiutarti oggi con la preparazione per la maturità?',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-10rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Tutor Virtuale</h1>
        <p className="text-muted-foreground">
          Il tuo assistente personale per la preparazione alla maturità. Fai domande specifiche e ricevi aiuto immediato.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 flex-1">
        {/* Main chat area */}
        <div className="flex flex-col flex-1 md:w-3/4 border rounded-lg shadow-sm overflow-hidden bg-card">
          {/* Chat header */}
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                <BrainCircuit size={18} />
              </div>
              <div>
                <div className="font-medium">Tutor Virtuale</div>
                <div className="text-xs text-muted-foreground">
                  {user?.aiCreditsRemaining} crediti AI rimanenti oggi
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleNewChat}
                className="btn-ghost p-2"
                title="Nuova chat"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[70%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-muted'
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  ) : (
                    <div className="latex-container whitespace-pre-wrap">
                      <Latex>{message.text}</Latex>
                    </div>
                  )}
                  
                  {message.relatedExercise && (
                    <div className="mt-2 pt-2 border-t border-white/20 flex items-center text-xs">
                      <BookOpen size={12} className="mr-1" />
                      <span>Da esercizio: {message.relatedExercise}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Scrivi la tua domanda..."
                className="input flex-1"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className={`p-2 rounded-md ${
                  !inputValue.trim() || isTyping
                    ? 'bg-muted text-muted-foreground'
                    : 'bg-primary text-white'
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Sidebar with suggestions */}
        <div className="md:w-1/4">
          <div className="border rounded-lg shadow-sm p-4 bg-card">
            <h3 className="font-medium mb-3">Argomenti Suggeriti</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setInputValue("Puoi spiegarmi come calcolare le derivate?")}
                className="w-full text-left p-2 rounded-md text-sm hover:bg-muted transition-colors flex items-center"
              >
                <span className="mr-2 text-primary">→</span> Come si calcolano le derivate?
              </button>
              <button 
                onClick={() => setInputValue("Aiutami con gli integrali definiti")}
                className="w-full text-left p-2 rounded-md text-sm hover:bg-muted transition-colors flex items-center"
              >
                <span className="mr-2 text-primary">→</span> Integrali definiti
              </button>
              <button 
                onClick={() => setInputValue("Trova il limite di (e^x - 1)/x quando x tende a 0")}
                className="w-full text-left p-2 rounded-md text-sm hover:bg-muted transition-colors flex items-center"
              >
                <span className="mr-2 text-primary">→</span> Limite di (e^x - 1)/x per x→0
              </button>
              <button 
                onClick={() => setInputValue("Come risolvere equazioni differenziali?")}
                className="w-full text-left p-2 rounded-md text-sm hover:bg-muted transition-colors flex items-center"
              >
                <span className="mr-2 text-primary">→</span> Equazioni differenziali
              </button>
            </div>
          </div>
          
          <div className="border rounded-lg shadow-sm p-4 mt-4 bg-card">
            <h3 className="font-medium mb-3">I Tuoi Esercizi Recenti</h3>
            <div className="space-y-2">
              <button className="w-full text-left p-2 rounded-md text-sm hover:bg-muted transition-colors flex items-center">
                <BookOpen size={14} className="mr-2 text-muted-foreground" />
                Limiti di funzioni razionali
              </button>
              <button className="w-full text-left p-2 rounded-md text-sm hover:bg-muted transition-colors flex items-center">
                <BookOpen size={14} className="mr-2 text-muted-foreground" />
                Studio di funzione logaritmica
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTutor;