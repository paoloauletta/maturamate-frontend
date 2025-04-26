import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { 
  getUserProfile, 
  createUserProfile, 
  updateUserProfile,
  getUserCompletedExercises,
  getSavedExercises,
  getUserCompletedSimulations
} from '../lib/supabase';
import { Exercise } from '../data/exercises';
import { Tables } from '../lib/database.types';

type SubscriptionPlan = 'free' | 'premium';

interface SavedExercise extends Exercise {
  savedAt: string;
}

interface CompletedExercise extends Exercise {
  completedAt: string;
}

interface CompletedSimulation {
  id: string;
  completedAt: string;
}

interface UserProgress {
  completedExercises: string[];
  savedExercises: string[];
  completedSimulations: string[];
  savedExerciseDetails: SavedExercise[];
  completedExerciseDetails: CompletedExercise[];
  completedSimulationDetails: CompletedSimulation[];
  streak: number;
  lastActive: string;
}

interface User {
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

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProgress: (progress: Partial<UserProgress>) => Promise<void>;
  completeExercise: (exerciseId: string) => Promise<void>;
  completeSimulation: (simulationId: string) => Promise<void>;
  useAiCredit: () => boolean;
  toggleSavedExercise: (exerciseId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        setIsLoading(true);
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      setIsLoading(true);
      // Get user profile
      let profile;
      try {
        profile = await getUserProfile(userId);
      } catch (error: any) {
        // Check if the error is because the profile doesn't exist
        if (error.code === 'PGRST116') {
          // If profile doesn't exist, create one
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser?.user) {
            try {
              profile = await createUserProfile(
                userId,
                authUser.user.email?.split('@')[0] || 'user',
                authUser.user.email || ''
              );
            } catch (createError: any) {
              // If creation fails due to duplicate key, try to get the profile again
              if (createError.code === '23505') {
                profile = await getUserProfile(userId);
              } else {
                throw createError;
              }
            }
          } else {
            throw new Error('No authenticated user found');
          }
        } else {
          throw error;
        }
      }
      
      // Initialize progress in memory
      const initialProgress = {
        completedExercises: [],
        completedSimulations: [],
        savedExercises: [],
        savedExerciseDetails: [],
        completedExerciseDetails: [],
        completedSimulationDetails: [],
        streak: 0,
        lastActive: new Date().toISOString()
      };

      // Get additional progress data
      const [completedExercises, savedExercises, completedSimulations] = await Promise.all([
        getUserCompletedExercises(userId),
        getSavedExercises(userId),
        getUserCompletedSimulations(userId)
      ]);

      // Type assertion for savedExercises
      const typedSavedExercises = savedExercises as unknown as (Exercise & { savedAt: string })[];

      // Merge progress with fetched data
      const mergedProgress = {
        ...initialProgress,
        completedExercises: completedExercises.map(ex => ex.exercise_id),
        completedSimulations: completedSimulations.map(sim => sim.simulation_id),
        savedExercises: typedSavedExercises.map(ex => ex.id),
        savedExerciseDetails: typedSavedExercises,
        completedExerciseDetails: completedExercises.map(ex => ({
          ...ex.exercise,
          completedAt: ex.completed_at
        })),
        completedSimulationDetails: completedSimulations.map(sim => ({
          id: sim.simulation_id,
          completedAt: sim.completed_at
        })),
        lastActive: new Date().toISOString()
      };

      setUser({
        id: userId,
        name: profile.username,
        email: profile.email,
        plan: 'free', // TODO: Implement subscription plan logic
        progress: mergedProgress,
        aiCreditsRemaining: 20, // TODO: Implement AI credits logic
        profile: {
          username: profile.username,
          avatar_url: profile.avatar_url,
        },
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        await loadUserData(data.user.id);
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const updateProgress = async (progress: Partial<UserProgress>) => {
    if (!user) return;
    
    try {
      // Update local state only
      const updatedProgress = {
        ...user.progress,
        ...progress,
      };
      
      setUser({
        ...user,
        progress: updatedProgress,
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  const completeExercise = async (exerciseId: string) => {
    if (!user) return;
    
    if (!user.progress.completedExercises.includes(exerciseId)) {
      const updatedExercises = [...user.progress.completedExercises, exerciseId];
      await updateProgress({ completedExercises: updatedExercises });
    }
  };

  const completeSimulation = async (simulationId: string) => {
    if (!user) return;
    
    if (!user.progress.completedSimulations.includes(simulationId)) {
      const updatedSimulations = [...user.progress.completedSimulations, simulationId];
      await updateProgress({ completedSimulations: updatedSimulations });
    }
  };

  const useAiCredit = () => {
    if (!user) return false;
    
    if (user.plan === 'premium') {
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

  const toggleSavedExercise = async (exerciseId: string) => {
    if (!user) return;
    
    const currentSaved = user.progress.savedExercises;
    const isCurrentlySaved = currentSaved.includes(exerciseId);
    
    const updatedSaved = isCurrentlySaved
      ? currentSaved.filter(id => id !== exerciseId)
      : [...currentSaved, exerciseId];
    
    await updateProgress({ savedExercises: updatedSaved });
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateProgress,
        completeExercise,
        completeSimulation,
        useAiCredit,
        toggleSavedExercise,
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