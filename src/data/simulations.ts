export interface Simulation {
  id: string;
  title: string;
  year: number;
  duration: number; // in minutes
  pdfUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isOfficial: boolean; // true if it's an official exam, false if AI-generated
  sections: SimulationSection[];
}

export interface SimulationSection {
  id: string;
  title: string;
  problems: SimulationProblem[];
}

export interface SimulationProblem {
  id: string;
  text: string;
  solution: string;
  maxScore: number;
}

export const simulations: Simulation[] = [
  {
    id: 'sim1',
    title: 'Seconda Prova Matematica 2023',
    year: 2023,
    duration: 360, // 6 hours
    pdfUrl: 'https://example.com/exams/maturita-2023-matematica.pdf',
    difficulty: 'hard',
    isOfficial: true,
    sections: [
      {
        id: 'sec1',
        title: 'Problema 1 - Studio di Funzione',
        problems: [
          {
            id: 'prob1',
            text: `Data la funzione:

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
            maxScore: 10
          },
          {
            id: 'prob2',
            text: `Studiare la derivabilità della funzione e individuare eventuali punti di massimo, minimo o flesso.`,
            solution: `Analizziamo la derivabilità e i punti critici della funzione:

1. Derivata prima:
   Dato che $f(x) = x - 3$ per $x \\neq 1$, la derivata prima è:
   
   $$f'(x) = 1$$
   
   per $x \\neq 1$

2. Analisi della derivata:
   - La funzione è quindi crescente in tutto il suo dominio
   - Non ci sono punti di massimo o minimo relativi poiché la derivata non si annulla mai
   - La funzione non è derivabile in $x = 1$ perché non è definita in quel punto

3. Derivata seconda:
   La derivata seconda è:
   
   $$f''(x) = 0$$
   
   per $x \\neq 1$

4. Conclusioni:
   - Non ci sono punti di flesso a tangente non verticale
   - La funzione è una retta (escludendo il punto $x = 1$)
   - Il grafico è una retta con un "buco" in $x = 1$`,
            maxScore: 8
          }
        ]
      },
      {
        id: 'sec2',
        title: 'Problema 2 - Calcolo Integrale',
        problems: [
          {
            id: 'prob3',
            text: `Calcolare l'integrale definito:

$$\\int_{0}^{1} x \\cdot e^{x^2} dx$$`,
            solution: `Risolviamo l'integrale utilizzando la sostituzione:

1. Sostituzione:
   Poniamo $u = x^2$, da cui:
   - $du = 2x\\,dx$
   - quindi $x\\,dx = \\frac{du}{2}$

2. Limiti di integrazione:
   - Per $x = 0$: $u = 0$
   - Per $x = 1$: $u = 1$

3. Riscrittura dell'integrale:

   $$\\int_{0}^{1} x \\cdot e^{x^2} dx = \\int_{0}^{1} e^u \\cdot \\frac{du}{2}$$
   
   $$= \\frac{1}{2} \\int_{0}^{1} e^u du = \\frac{1}{2} [e^u]_{0}^{1}$$
   
   $$= \\frac{1}{2} (e^1 - e^0) = \\frac{1}{2} (e - 1)$$

Quindi il valore dell'integrale è $\\frac{e - 1}{2}$.`,
            maxScore: 10
          },
          {
            id: 'prob4',
            text: `Calcolare l'integrale indefinito:

$$\\int \\frac{1}{x^2 - 9} dx$$`,
            solution: `Risolviamo l'integrale usando la scomposizione in fratti semplici:

1. Scomposizione del denominatore:
   $$x^2 - 9 = (x-3)(x+3)$$

2. Scomposizione in fratti semplici:
   $$\\frac{1}{(x-3)(x+3)} = \\frac{A}{x-3} + \\frac{B}{x+3}$$

3. Determinazione dei coefficienti:
   Moltiplicando per $(x-3)(x+3)$:
   
   $$1 = A(x+3) + B(x-3)$$

   - Per $x = 3$: $1 = A \\cdot 6 \\Rightarrow A = \\frac{1}{6}$
   - Per $x = -3$: $1 = B \\cdot (-6) \\Rightarrow B = -\\frac{1}{6}$

4. Integrazione:
   $$\\int \\frac{1}{x^2 - 9} dx = \\int \\left(\\frac{1}{6(x-3)} - \\frac{1}{6(x+3)}\\right) dx$$
   
   $$= \\frac{1}{6} \\ln|x-3| - \\frac{1}{6} \\ln|x+3| + C$$
   
   $$= \\frac{1}{6} \\ln\\left|\\frac{x-3}{x+3}\\right| + C$$`,
            maxScore: 12
          }
        ]
      }
    ]
  },
  {
    id: 'sim2',
    title: 'Simulazione AI Maturità Matematica',
    year: 2024,
    duration: 300, // 5 hours
    pdfUrl: 'https://example.com/exams/simulazione-ai-2024.pdf',
    difficulty: 'medium',
    isOfficial: false,
    sections: [
      {
        id: 'sec1',
        title: 'Problema 1 - Calcolo Differenziale',
        problems: [
          {
            id: 'prob1',
            text: `Data la funzione:

$$f(x) = x\\ln(x) - x$$

Studiare il comportamento agli estremi del dominio e calcolare i punti stazionari.`,
            solution: `Analizziamo la funzione passo per passo:

1. Dominio:
   Il dominio è $(0, +\\infty)$ poiché $\\ln(x)$ è definito solo per $x > 0$.

2. Comportamento per $x \\to 0^+$:
   $$\\lim_{x \\to 0^+} (x\\ln(x) - x) = \\lim_{x \\to 0^+} x\\ln(x) - \\lim_{x \\to 0^+} x$$
   
   Per $\\lim_{x \\to 0^+} x\\ln(x)$, abbiamo una forma indeterminata $0 \\cdot (-\\infty)$.
   Poniamo $y = x\\ln(x)$ e usiamo la regola di de l'Hospital:
   
   $$\\lim_{x \\to 0^+} \\frac{\\ln(x)}{\\frac{1}{x}} = \\lim_{x \\to 0^+} \\frac{\\frac{1}{x}}{-\\frac{1}{x^2}} = \\lim_{x \\to 0^+} -x = 0$$
   
   Quindi $\\lim_{x \\to 0^+} f(x) = 0 - 0 = 0$

3. Comportamento per $x \\to +\\infty$:
   $$\\lim_{x \\to +\\infty} (x\\ln(x) - x) = \\lim_{x \\to +\\infty} x(\\ln(x) - 1)$$
   
   Poiché $\\ln(x) \\to +\\infty$ per $x \\to +\\infty$, abbiamo $\\ln(x) - 1 \\to +\\infty$,
   quindi $\\lim_{x \\to +\\infty} f(x) = +\\infty$

4. Punti stazionari:
   Calcoliamo la derivata:
   
   $$f'(x) = \\ln(x) + x \\cdot \\frac{1}{x} - 1 = \\ln(x) + 1 - 1 = \\ln(x)$$
   
   Poniamo $f'(x) = 0$:
   $$\\ln(x) = 0 \\Rightarrow x = 1$$

5. Natura del punto stazionario:
   Calcoliamo la derivata seconda:
   
   $$f''(x) = \\frac{1}{x}$$
   
   In $x = 1$: $f''(1) = 1 > 0$
   
   Quindi $x = 1$ è un punto di minimo relativo, con valore:
   $$f(1) = 1 \\cdot \\ln(1) - 1 = 0 - 1 = -1$$`,
            maxScore: 12
          }
        ]
      }
    ]
  }
];