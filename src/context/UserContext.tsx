import React, { createContext, useContext, useState, ReactNode } from 'react';

type SubscriptionPlan = 'free' | 'premium' | 'classe';

interface UserProgress {
  completedExercises: string[];
  savedExercises: string[];
  completedSimulations: string[];
  streak: number;
  lastActive: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  plan: SubscriptionPlan;
  progress: UserProgress;
  aiCreditsRemaining: number;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProgress: (progress: Partial<UserProgress>) => void;
  completeExercise: (exerciseId: string) => void;
  saveExercise: (exerciseId: string) => void;
  completeSimulation: (simulationId: string) => void;
  useAiCredit: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  name: 'Marco Rossi',
  email: 'marco@example.com',
  plan: 'premium',
  progress: {
    completedExercises: ['ex1', 'ex3', 'ex7'],
    savedExercises: ['ex2', 'ex5'],
    completedSimulations: ['sim1'],
    streak: 5,
    lastActive: new Date(),
  },
  aiCreditsRemaining: 20,
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const isAuthenticated = !!user;

  const login = async (email: string, password: string) => {
    // Mock login - in a real app, this would make an API call
    console.log(`Attempting login with: ${email} / ${password}`);
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProgress = (progress: Partial<UserProgress>) => {
    if (!user) return;
    
    setUser({
      ...user,
      progress: {
        ...user.progress,
        ...progress,
      },
    });
  };

  const completeExercise = (exerciseId: string) => {
    if (!user) return;
    
    if (!user.progress.completedExercises.includes(exerciseId)) {
      const updatedExercises = [...user.progress.completedExercises, exerciseId];
      updateProgress({ completedExercises: updatedExercises });
    }
  };

  const saveExercise = (exerciseId: string) => {
    if (!user) return;
    
    if (!user.progress.savedExercises.includes(exerciseId)) {
      const updatedSaved = [...user.progress.savedExercises, exerciseId];
      updateProgress({ savedExercises: updatedSaved });
    } else {
      const updatedSaved = user.progress.savedExercises.filter(id => id !== exerciseId);
      updateProgress({ savedExercises: updatedSaved });
    }
  };

  const completeSimulation = (simulationId: string) => {
    if (!user) return;
    
    if (!user.progress.completedSimulations.includes(simulationId)) {
      const updatedSimulations = [...user.progress.completedSimulations, simulationId];
      updateProgress({ completedSimulations: updatedSimulations });
    }
  };

  const useAiCredit = () => {
    if (!user) return false;
    
    if (user.plan === 'premium' || user.plan === 'classe') {
      if (user.aiCreditsRemaining > 0) {
        setUser({
          ...user,
          aiCreditsRemaining: user.aiCreditsRemaining - 1,
        });
        return true;
      }
    }
    
    return false;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        updateProgress,
        completeExercise,
        saveExercise,
        completeSimulation,
        useAiCredit,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};