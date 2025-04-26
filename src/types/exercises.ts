export type Difficulty = 'facile' | 'media' | 'difficile';

export interface Exercise {
  id: string;
  subject: string;
  topic: string;
  question_data: {
    question: string;
    type: string;
    difficulty: Difficulty;
  };
  solution_data: {
    steps: string[];
    final_answer: string;
  };
  created_at: string;
}

export interface SavedExercise extends Exercise {
  savedAt: string;
}

export interface CompletedExercise extends Exercise {
  completedAt: string;
  is_correct: boolean;
  time_spent_sec: number;
  answer_data?: any;
  attempt_count: number;
}

export interface ExerciseFilters {
  subject?: string;
  difficulty?: Difficulty;
  sortBy?: 'recent' | 'difficulty' | 'category';
} 