export interface Exercise {
  id: string;
  title: string;
  category: 'algebra' | 'geometry' | 'analysis' | 'probability';
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  solution: string;
  hints: string[];
}

export const exercises: Exercise[] = [
  {
    id: 'ex1',
    title: 'Calcolo dei Limiti',
    category: 'analysis',
    difficulty: 'medium',
    content: `Calcola il seguente limite:

$$\\lim_{x \\to 0} \\frac{\\sin(3x)}{5x}$$`,
    solution: `Per risolvere questo limite, possiamo usare il limite notevole:

$$\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1$$

Riscriviamo il nostro limite:

$$\\lim_{x \\to 0} \\frac{\\sin(3x)}{5x} = \\lim_{x \\to 0} \\frac{3}{5} \\cdot \\frac{\\sin(3x)}{3x}$$

$$= \\frac{3}{5} \\cdot \\lim_{x \\to 0} \\frac{\\sin(3x)}{3x} = \\frac{3}{5} \\cdot 1 = \\frac{3}{5}$$

Quindi il limite vale $\\frac{3}{5}$.`,
    hints: [
      "Ricorda il limite notevole sin(x)/x quando x tende a 0",
      "Puoi riscrivere l'espressione per isolare il limite notevole"
    ]
  },
  {
    id: 'ex2',
    title: 'Derivata di una Funzione Composta',
    category: 'analysis',
    difficulty: 'medium',
    content: `Calcola la derivata della seguente funzione:

$$f(x) = \\ln(x^2 + 1)$$`,
    solution: `Per calcolare la derivata di $f(x) = \\ln(x^2 + 1)$, utilizziamo la regola della catena poiché abbiamo una funzione composta.

Sia:
- $g(x) = x^2 + 1$
- $h(x) = \\ln(x)$
- quindi $f(x) = h(g(x))$

La derivata sarà: 

$$f'(x) = h'(g(x)) \\cdot g'(x)$$

Sappiamo che:
- $h'(x) = \\frac{1}{x}$, quindi $h'(g(x)) = \\frac{1}{x^2 + 1}$
- $g'(x) = 2x$

Quindi:

$$f'(x) = \\frac{1}{x^2 + 1} \\cdot 2x = \\frac{2x}{x^2 + 1}$$`,
    hints: [
      "Usa la regola della catena per le funzioni composte",
      "Ricorda che la derivata di ln(x) è 1/x",
      "Non dimenticare di derivare la funzione interna"
    ]
  },
  {
    id: 'ex3',
    title: 'Studio di Funzione Razionale',
    category: 'analysis',
    difficulty: 'hard',
    content: `Data la funzione:

$$f(x) = \\frac{x^2 - 4x + 3}{x - 1}$$

Determinare il dominio, gli asintoti e i punti di discontinuità.`,
    solution: `Analizziamo la funzione passo per passo:

1. Dominio:
   Il dominio della funzione è $\\mathbb{R} \\setminus \\{1\\}$ poiché il denominatore si annulla per $x = 1$.

2. Asintoto per $x \\to \\infty$:
   Dividiamo numeratore e denominatore per la potenza più alta di $x$:

   $$\\lim_{x \\to \\infty} \\frac{x^2 - 4x + 3}{x - 1} = \\lim_{x \\to \\infty} \\frac{x^2(1 - \\frac{4}{x} + \\frac{3}{x^2})}{x(1 - \\frac{1}{x})}$$
   
   $$= \\lim_{x \\to \\infty} \\frac{x(1 - \\frac{4}{x} + \\frac{3}{x^2})}{(1 - \\frac{1}{x})} = \\infty$$

3. Semplificazione:
   Dividendo per $(x-1)$ otteniamo:

   $$f(x) = \\frac{x^2 - 4x + 3}{x - 1} = \\frac{(x-1)(x-3)}{x-1} = x - 3$$
   
   per $x \\neq 1$

4. Asintoto obliquo:
   Dalla semplificazione, abbiamo trovato l'asintoto obliquo $y = x - 3$.

5. Punto di discontinuità:
   Per $x \\to 1$, abbiamo una forma indeterminata $\\frac{0}{0}$. Calcoliamo il limite:

   $$\\lim_{x \\to 1} f(x) = \\lim_{x \\to 1} \\frac{(x-1)(x-3)}{x-1} = \\lim_{x \\to 1} (x-3) = 1-3 = -2$$

   Non c'è un asintoto verticale in $x = 1$, ma un punto di discontinuità eliminabile con valore $-2$.`,
    hints: [
      "Analizza prima il dominio cercando i valori che annullano il denominatore",
      "Per gli asintoti, studia il comportamento per x→∞ e in prossimità dei punti di discontinuità",
      "Cerca di semplificare la funzione dividendo numeratore e denominatore per fattori comuni"
    ]
  }
];