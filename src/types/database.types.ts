export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      exercises: {
        Row: {
          id: string
          subject: string
          topic: string
          question_data: Json
          solution_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          subject: string
          topic: string
          question_data: Json
          solution_data: Json
          created_at?: string
        }
        Update: {
          id?: string
          subject?: string
          topic?: string
          question_data?: Json
          solution_data?: Json
          created_at?: string
        }
      }
      simulations: {
        Row: {
          id: string
          title: string
          description: string
          pdf_url: string
          solution_pdf_url: string
          text_content?: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          pdf_url: string
          solution_pdf_url: string
          text_content?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          pdf_url?: string
          solution_pdf_url?: string
          text_content?: string
          created_at?: string
        }
      }
      completed_exercises: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          completed_at: string
          is_correct: boolean
          time_spent_sec: number
          answer_data?: Json
          attempt_count: number
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          completed_at?: string
          is_correct: boolean
          time_spent_sec: number
          answer_data?: Json
          attempt_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          completed_at?: string
          is_correct?: boolean
          time_spent_sec?: number
          answer_data?: Json
          attempt_count?: number
        }
      }
      saved_exercises: {
        Row: {
          user_id: string
          exercise_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          exercise_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          exercise_id?: string
          created_at?: string
        }
      }
      completed_simulations: {
        Row: {
          id: string
          user_id: string
          simulation_id: string
          completed_at: string
          duration_min: number
          notes?: string
          corrected: boolean
        }
        Insert: {
          id?: string
          user_id: string
          simulation_id: string
          completed_at?: string
          duration_min: number
          notes?: string
          corrected: boolean
        }
        Update: {
          id?: string
          user_id?: string
          simulation_id?: string
          completed_at?: string
          duration_min?: number
          notes?: string
          corrected?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          email: string
          updated_at: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          username: string
          email: string
          updated_at?: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          username?: string
          email?: string
          updated_at?: string
          avatar_url?: string | null
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updateable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'] 