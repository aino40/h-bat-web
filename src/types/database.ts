// Database types for H-BAT Web Application
// Generated from Supabase schema - BST Perception only

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
      profiles: {
        Row: {
          id: string
          age: number
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          age: number
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          age?: number
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          created_at?: string
          updated_at?: string
        }
      }
      tests: {
        Row: {
          id: string
          user_id: string
          kind: 'audiometry' | 'bst_perception'
          started_at: string
          finished_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          kind: 'audiometry' | 'bst_perception'
          started_at?: string
          finished_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          kind?: 'audiometry' | 'bst_perception'
          started_at?: string
          finished_at?: string | null
          created_at?: string
        }
      }
      audiometry_results: {
        Row: {
          id: string
          test_id: string
          frequency_hz: 1000 | 2000 | 4000
          threshold_db: number
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          frequency_hz: 1000 | 2000 | 4000
          threshold_db: number
          created_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          frequency_hz?: 1000 | 2000 | 4000
          threshold_db?: number
          created_at?: string
        }
      }
      bst_results: {
        Row: {
          id: string
          test_id: string
          trial_number: number
          pattern_type: '2beat' | '3beat'
          presented_pattern: '2beat' | '3beat'
          user_response: '2beat' | '3beat'
          db_difference: number
          is_correct: boolean
          reaction_time_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          trial_number: number
          pattern_type: '2beat' | '3beat'
          presented_pattern: '2beat' | '3beat'
          user_response: '2beat' | '3beat'
          db_difference: number
          is_correct: boolean
          reaction_time_ms?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          trial_number?: number
          pattern_type?: '2beat' | '3beat'
          presented_pattern?: '2beat' | '3beat'
          user_response?: '2beat' | '3beat'
          db_difference?: number
          is_correct?: boolean
          reaction_time_ms?: number | null
          created_at?: string
        }
      }
      bst_thresholds: {
        Row: {
          id: string
          test_id: string
          perception_threshold_db: number
          reversal_points: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          test_id: string
          perception_threshold_db: number
          reversal_points?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          test_id?: string
          perception_threshold_db?: number
          reversal_points?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      test_kind: 'audiometry' | 'bst_perception'
      gender_type: 'male' | 'female' | 'other' | 'prefer_not_to_say'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Test = Database['public']['Tables']['tests']['Row']
export type TestInsert = Database['public']['Tables']['tests']['Insert']
export type TestUpdate = Database['public']['Tables']['tests']['Update']

export type AudiometryResult = Database['public']['Tables']['audiometry_results']['Row']
export type AudiometryResultInsert = Database['public']['Tables']['audiometry_results']['Insert']
export type AudiometryResultUpdate = Database['public']['Tables']['audiometry_results']['Update']

export type BSTResult = Database['public']['Tables']['bst_results']['Row']
export type BSTResultInsert = Database['public']['Tables']['bst_results']['Insert']
export type BSTResultUpdate = Database['public']['Tables']['bst_results']['Update']

export type BSTThreshold = Database['public']['Tables']['bst_thresholds']['Row']
export type BSTThresholdInsert = Database['public']['Tables']['bst_thresholds']['Insert']
export type BSTThresholdUpdate = Database['public']['Tables']['bst_thresholds']['Update']

// Test kinds
export type TestKind = Database['public']['Enums']['test_kind']
export type GenderType = Database['public']['Enums']['gender_type']

// Beat patterns
export type BeatPattern = '2beat' | '3beat'

// Frequency types for audiometry
export type AudiometryFrequency = 1000 | 2000 | 4000

// Analysis types
export interface AudiometryThresholds {
  freq1000: number
  freq2000: number
  freq4000: number
}

export interface BSTPerceptionThreshold {
  threshold: number
  reversalPoints: number[]
  trials: BSTResult[]
}

// Complete test results
export interface CompleteTestResults {
  profile: Profile
  audiometry?: {
    test: Test
    results: AudiometryResult[]
    thresholds: AudiometryThresholds
  }
  bst?: {
    test: Test
    results: BSTResult[]
    threshold: BSTThreshold
  }
}

// Staircase algorithm types
export interface StaircaseState {
  currentLevel: number
  stepSize: number
  direction: 'up' | 'down'
  reversalCount: number
  reversalPoints: number[]
  consecutiveCorrect: number
  isFinished: boolean
}

// UI component types
export interface TestProgressState {
  currentTest: 'intro' | 'audiometry' | 'bst_perception' | 'results'
  totalSteps: number
  currentStep: number
  isLoading: boolean
  error?: string
} 