import { supabase } from './client'
import { UserProfile } from '../../types/user'

export async function getUserProfile(userId: string): Promise<UserProfile> {
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
    avatar_url?: string | null
  }
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
  
  if (error) throw error
}

export async function createUserProfile(
  userId: string,
  username: string,
  email: string
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      username,
      email,
      updated_at: new Date().toISOString()
    })
  
  if (error) throw error
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback)
} 