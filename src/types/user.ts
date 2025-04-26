import { SavedExercise, CompletedExercise } from './exercises';

export type SubscriptionPlan = 'free' | 'premium';

export interface CompletedSimulation {
  id: string;
  completedAt: string;
  duration_min: number;
  notes?: string;
  corrected: boolean;
}

export interface UserProgress {
  completedExercises: string[];
  savedExercises: string[];
  completedSimulations: string[];
  savedExerciseDetails: SavedExercise[];
  completedExerciseDetails: CompletedExercise[];
  completedSimulationDetails: CompletedSimulation[];
  streak: number;
  lastActive: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  plan: SubscriptionPlan;
  progress: UserProgress;
  aiCreditsRemaining: number;
  profile: {
    username: string;
    avatar_url: string | null;
  };
}

export interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProgress: (progress: Partial<UserProgress>) => Promise<void>;
  completeExercise: (exerciseId: string) => Promise<void>;
  completeSimulation: (simulationId: string) => Promise<void>;
  useAiCredit: () => boolean;
  toggleSavedExercise: (exerciseId: string) => Promise<void>;
} 