import { supabase } from './client'
import { Tables } from '../../types/database.types'

export type Simulation = Tables<'simulations'>
export type CompletedSimulation = Tables<'completed_simulations'>

export async function getSimulations(): Promise<Simulation[]> {
  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getSimulationById(id: string): Promise<Simulation> {
  const { data, error } = await supabase
    .from('simulations')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function getUserCompletedSimulations(userId: string): Promise<CompletedSimulation[]> {
  const { data, error } = await supabase
    .from('completed_simulations')
    .select('*, simulation:simulations!simulation_id(*)')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function markSimulationCompleted(
  userId: string,
  simulationId: string,
  durationMin: number,
  notes?: string,
  corrected: boolean = false
): Promise<void> {
  const { error } = await supabase
    .from('completed_simulations')
    .upsert({
      user_id: userId,
      simulation_id: simulationId,
      completed_at: new Date().toISOString(),
      duration_min: durationMin,
      notes,
      corrected
    })
  
  if (error) throw error
} 