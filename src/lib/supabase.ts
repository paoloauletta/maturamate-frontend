import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'
import { Exercise } from '../data/exercises'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Exercise-related functions
export async function getExercises(): Promise<Exercise[]> {
  try {
    console.log('Fetching exercises...');
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }

    if (!data) {
      console.log('No exercises found');
      return [];
    }

    // Transform the data to ensure difficulty is in Italian
    const transformedData = data.map(exercise => ({
      ...exercise,
      question_data: {
        ...exercise.question_data,
        difficulty: exercise.question_data.difficulty === 'easy' ? 'facile' :
                   exercise.question_data.difficulty === 'medium' ? 'media' : 'difficile'
      }
    }));

    console.log('Fetched exercises:', transformedData);
    return transformedData as Exercise[];
  } catch (error) {
    console.error('Error in getExercises:', error);
    throw error;
  }
}

export async function getExerciseById(id: string) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// Simulation-related functions
export async function getSimulations() {
  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getSimulationById(id: string) {
  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

// User progress tracking functions
export async function markExerciseCompleted(
  userId: string,
  exerciseId: string,
  isCorrect: boolean,
  timeSpentSec: number,
  answerData?: any
) {
  const { data, error } = await supabase
    .from('completed_exercises')
    .upsert({
      user_id: userId,
      exercise_id: exerciseId,
      completed_at: new Date().toISOString(),
      is_correct: isCorrect,
      time_spent_sec: timeSpentSec,
      answer_data: answerData,
      attempt_count: 1
    })
  
  if (error) throw error
  return data
}

export async function toggleExerciseSaved(userId: string, exerciseId: string) {
  try {
    // First check if already saved using count instead of select
    const { count, error: countError } = await supabase
      .from('saved_exercises')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId);

    if (countError) throw countError;

    if (count && count > 0) {
      // Remove from saved
      const { error } = await supabase
        .from('saved_exercises')
        .delete()
        .eq('user_id', userId)
        .eq('exercise_id', exerciseId);

      if (error) throw error;
      return false; // Return false to indicate it's no longer saved
    } else {
      // Add to saved
      const { error } = await supabase
        .from('saved_exercises')
        .insert({
          user_id: userId,
          exercise_id: exerciseId,
          created_at: new Date().toISOString() // Explicitly set created_at
        });

      if (error) throw error;
      return true; // Return true to indicate it's now saved
    }
  } catch (error) {
    console.error('Error toggling exercise saved status:', error);
    throw error;
  }
}

export async function getSavedExercises(userId: string) {
  try {
    const { data, error } = await supabase
      .from('saved_exercises')
      .select('*, exercise:exercises!exercise_id(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform the data to match the Exercise type
    return data?.map(item => ({
      ...item.exercise,
      savedAt: item.created_at
    })) || [];
  } catch (error) {
    console.error('Error fetching saved exercises:', error);
    throw error;
  }
}

// User progress retrieval functions
export async function getUserCompletedExercises(userId: string) {
  const { data, error } = await supabase
    .from('completed_exercises')
    .select('*, exercise:exercises!exercise_id(*)')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getUserCompletedSimulations(userId: string) {
  const { data, error } = await supabase
    .from('completed_simulations')
    .select('*, simulation:simulations!simulation_id(*)')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
  
  if (error) throw error
  return data
}

// Profile-related functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function updateUserProfile(
  userId: string,
  updates: {
    username?: string
    email?: string
  }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
  
  if (error) throw error
  return data
}

export async function createUserProfile(
  userId: string,
  username: string,
  email: string
) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      username,
      email,
      updated_at: new Date().toISOString()
    })
  
  if (error) throw error
  return data
} 