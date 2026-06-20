export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_usage: {
        Row: {
          created_at: string
          feature: string
          id: string
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feature: string
          id?: string
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          feature?: string
          id?: string
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ban_appeals: {
        Row: {
          appeal_text: string
          ban_id: string
          created_at: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appeal_text: string
          ban_id: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appeal_text?: string
          ban_id?: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      character_conversations: {
        Row: {
          character_id: string
          character_name: string
          created_at: string
          id: string
          messages: Json
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          character_id: string
          character_name: string
          created_at?: string
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          character_id?: string
          character_name?: string
          created_at?: string
          id?: string
          messages?: Json
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      comment_votes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
          vote_type: number
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
          vote_type: number
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
          vote_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_votes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "community_comments_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      community_bans: {
        Row: {
          ban_days: number
          banned_by: string
          banned_until: string
          created_at: string
          id: string
          is_permanent: boolean
          reason: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ban_days: number
          banned_by: string
          banned_until: string
          created_at?: string
          id?: string
          is_permanent?: boolean
          reason: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ban_days?: number
          banned_by?: string
          banned_until?: string
          created_at?: string
          id?: string
          is_permanent?: boolean
          reason?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_characters: {
        Row: {
          avatar_emoji: string
          avatar_image_url: string | null
          avatar_type: string
          created_at: string
          creator_user_id: string | null
          description: string
          greeting: string | null
          id: string
          is_private: boolean
          mood_tone: string | null
          name: string
          system_prompt: string
          updated_at: string
        }
        Insert: {
          avatar_emoji?: string
          avatar_image_url?: string | null
          avatar_type?: string
          created_at?: string
          creator_user_id?: string | null
          description?: string
          greeting?: string | null
          id?: string
          is_private?: boolean
          mood_tone?: string | null
          name: string
          system_prompt: string
          updated_at?: string
        }
        Update: {
          avatar_emoji?: string
          avatar_image_url?: string | null
          avatar_type?: string
          created_at?: string
          creator_user_id?: string | null
          description?: string
          greeting?: string | null
          id?: string
          is_private?: boolean
          mood_tone?: string | null
          name?: string
          system_prompt?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          post_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          post_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean
          post_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          created_at: string
          description: string
          id: string
          is_anonymous: boolean
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_anonymous?: boolean
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_anonymous?: boolean
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      community_reports: {
        Row: {
          content_id: string
          created_at: string
          details: string | null
          id: string
          reason: Database["public"]["Enums"]["report_reason"]
          report_type: Database["public"]["Enums"]["report_type"]
          reported_user_id: string | null
          reporter_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          updated_at: string
        }
        Insert: {
          content_id: string
          created_at?: string
          details?: string | null
          id?: string
          reason: Database["public"]["Enums"]["report_reason"]
          report_type: Database["public"]["Enums"]["report_type"]
          reported_user_id?: string | null
          reporter_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Update: {
          content_id?: string
          created_at?: string
          details?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["report_reason"]
          report_type?: Database["public"]["Enums"]["report_type"]
          reported_user_id?: string | null
          reporter_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          updated_at?: string
        }
        Relationships: []
      }
      conversation_history: {
        Row: {
          analyzed: boolean
          created_at: string
          id: string
          messages: Json
          user_id: string
        }
        Insert: {
          analyzed?: boolean
          created_at?: string
          id?: string
          messages: Json
          user_id: string
        }
        Update: {
          analyzed?: boolean
          created_at?: string
          id?: string
          messages?: Json
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          date: string
          id: string
          is_private: boolean
          mood: string
          timestamp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          date: string
          id?: string
          is_private?: boolean
          mood: string
          timestamp: number
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          date?: string
          id?: string
          is_private?: boolean
          mood?: string
          timestamp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_private_pins: {
        Row: {
          created_at: string
          failed_attempts: number
          locked_until: string | null
          pin_hash: string
          salt: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          failed_attempts?: number
          locked_until?: string | null
          pin_hash: string
          salt: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          failed_attempts?: number
          locked_until?: string | null
          pin_hash?: string
          salt?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mail_deleted: {
        Row: {
          deleted_at: string
          mail_id: string
          user_id: string
        }
        Insert: {
          deleted_at?: string
          mail_id: string
          user_id: string
        }
        Update: {
          deleted_at?: string
          mail_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_deleted_mail_id_fkey"
            columns: ["mail_id"]
            isOneToOne: false
            referencedRelation: "mail_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      mail_messages: {
        Row: {
          body_html: string
          category: string
          created_at: string
          id: string
          is_welcome: boolean
          recipient_user_id: string | null
          sender_user_id: string | null
          title: string
        }
        Insert: {
          body_html: string
          category?: string
          created_at?: string
          id?: string
          is_welcome?: boolean
          recipient_user_id?: string | null
          sender_user_id?: string | null
          title: string
        }
        Update: {
          body_html?: string
          category?: string
          created_at?: string
          id?: string
          is_welcome?: boolean
          recipient_user_id?: string | null
          sender_user_id?: string | null
          title?: string
        }
        Relationships: []
      }
      mail_reads: {
        Row: {
          mail_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          mail_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          mail_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mail_reads_mail_id_fkey"
            columns: ["mail_id"]
            isOneToOne: false
            referencedRelation: "mail_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      mind_archive: {
        Row: {
          category: string | null
          created_at: string
          id: string
          memory_text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          memory_text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          memory_text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mood_entries: {
        Row: {
          context_tags: string[]
          created_at: string
          date: string
          id: string
          mood: string
          reason: string | null
          time: string
          timestamp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          context_tags?: string[]
          created_at?: string
          date: string
          id?: string
          mood: string
          reason?: string | null
          time: string
          timestamp: number
          updated_at?: string
          user_id: string
        }
        Update: {
          context_tags?: string[]
          created_at?: string
          date?: string
          id?: string
          mood?: string
          reason?: string | null
          time?: string
          timestamp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          id: string
          journal_reminder_time: string | null
          mood_reminder_time: string | null
          push_enabled: boolean | null
          sleep_reminder_enabled: boolean | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          journal_reminder_time?: string | null
          mood_reminder_time?: string | null
          push_enabled?: boolean | null
          sleep_reminder_enabled?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          journal_reminder_time?: string | null
          mood_reminder_time?: string | null
          push_enabled?: boolean | null
          sleep_reminder_enabled?: boolean | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pin_reset_requests: {
        Row: {
          admin_notes: string | null
          confirmation_phrase: string
          created_at: string
          expires_at: string
          id: string
          reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          confirmation_phrase: string
          created_at?: string
          expires_at?: string
          id?: string
          reason: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          confirmation_phrase?: string
          created_at?: string
          expires_at?: string
          id?: string
          reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_votes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
          vote_type: number
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
          vote_type: number
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
          vote_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: string
          age_number: number | null
          birth_date: string | null
          created_at: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          gender: string
          hobbies: string | null
          id: string
          name: string
          problems: string | null
          reputation: number
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          age: string
          age_number?: number | null
          birth_date?: string | null
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender: string
          hobbies?: string | null
          id?: string
          name: string
          problems?: string | null
          reputation?: number
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          age?: string
          age_number?: number | null
          birth_date?: string | null
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender?: string
          hobbies?: string | null
          id?: string
          name?: string
          problems?: string | null
          reputation?: number
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          device_name: string | null
          endpoint: string
          id: string
          is_active: boolean
          p256dh: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          device_name?: string | null
          endpoint: string
          id?: string
          is_active?: boolean
          p256dh: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          device_name?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean
          p256dh?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recurring_events: {
        Row: {
          category: string
          color: string | null
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          is_active: boolean
          recurrence_date: number | null
          recurrence_day: number | null
          recurrence_month: number | null
          recurrence_type: string
          start_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean
          recurrence_date?: number | null
          recurrence_day?: number | null
          recurrence_month?: number | null
          recurrence_type?: string
          start_time?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean
          recurrence_date?: number | null
          recurrence_day?: number | null
          recurrence_month?: number | null
          recurrence_type?: string
          start_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      schedule_events: {
        Row: {
          category: string
          color: string | null
          created_at: string
          description: string | null
          end_time: string | null
          event_date: string
          id: string
          is_auto_generated: boolean
          is_completed: boolean
          source: string | null
          start_time: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date: string
          id?: string
          is_auto_generated?: boolean
          is_completed?: boolean
          source?: string | null
          start_time: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date?: string
          id?: string
          is_auto_generated?: boolean
          is_completed?: boolean
          source?: string | null
          start_time?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sleep_logs: {
        Row: {
          created_at: string
          date: string
          id: string
          sleep_confirmed_at: string | null
          sleep_quality: string | null
          updated_at: string
          user_id: string
          wake_response_at: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          sleep_confirmed_at?: string | null
          sleep_quality?: string | null
          updated_at?: string
          user_id: string
          wake_response_at?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          sleep_confirmed_at?: string | null
          sleep_quality?: string | null
          updated_at?: string
          user_id?: string
          wake_response_at?: string | null
        }
        Relationships: []
      }
      sleep_profiles: {
        Row: {
          created_at: string
          id: string
          sleep_time: string
          updated_at: string
          user_id: string
          wake_time: string
        }
        Insert: {
          created_at?: string
          id?: string
          sleep_time: string
          updated_at?: string
          user_id: string
          wake_time: string
        }
        Update: {
          created_at?: string
          id?: string
          sleep_time?: string
          updated_at?: string
          user_id?: string
          wake_time?: string
        }
        Relationships: []
      }
      therapist_applications: {
        Row: {
          created_at: string
          education: string
          experience_years: number
          full_name: string
          id: string
          license_number: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          specialization: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          education: string
          experience_years: number
          full_name: string
          id?: string
          license_number: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialization: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          education?: string
          experience_years?: number
          full_name?: string
          id?: string
          license_number?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          specialization?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string
          id: string
          progress: number
          unlocked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          id?: string
          progress?: number
          unlocked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          id?: string
          progress?: number
          unlocked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity_data: {
        Row: {
          created_at: string
          features_unlocked: string[]
          id: string
          journal_streak: number
          last_breathing_use: string | null
          last_journal_use: string | null
          last_meditation_use: string | null
          last_mindmate_use: string | null
          last_mood_track: string | null
          last_sleep_use: string | null
          meditation_streak: number
          mindmate_streak: number
          mood_streak: number
          sleep_streak: number
          total_days_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          features_unlocked?: string[]
          id?: string
          journal_streak?: number
          last_breathing_use?: string | null
          last_journal_use?: string | null
          last_meditation_use?: string | null
          last_mindmate_use?: string | null
          last_mood_track?: string | null
          last_sleep_use?: string | null
          meditation_streak?: number
          mindmate_streak?: number
          mood_streak?: number
          sleep_streak?: number
          total_days_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          features_unlocked?: string[]
          id?: string
          journal_streak?: number
          last_breathing_use?: string | null
          last_journal_use?: string | null
          last_meditation_use?: string | null
          last_mindmate_use?: string | null
          last_mood_track?: string | null
          last_sleep_use?: string | null
          meditation_streak?: number
          mindmate_streak?: number
          mood_streak?: number
          sleep_streak?: number
          total_days_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      community_comments_safe: {
        Row: {
          content: string | null
          created_at: string | null
          id: string | null
          is_anonymous: boolean | null
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_anonymous?: boolean | null
          post_id?: string | null
          updated_at?: string | null
          user_id?: never
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_anonymous?: boolean | null
          post_id?: string | null
          updated_at?: string | null
          user_id?: never
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts_safe: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          is_anonymous: boolean | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_anonymous?: boolean | null
          title?: string | null
          updated_at?: string | null
          user_id?: never
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          is_anonymous?: boolean | null
          title?: string | null
          updated_at?: string | null
          user_id?: never
        }
        Relationships: []
      }
    }
    Functions: {
      admin_clear_journal_pin: {
        Args: { _request_id: string; _target_user: string }
        Returns: undefined
      }
      admin_get_community_comments: {
        Args: never
        Returns: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean
          post_id: string
          updated_at: string
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "community_comments"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      admin_get_community_posts: {
        Args: never
        Returns: {
          created_at: string
          description: string
          id: string
          is_anonymous: boolean
          title: string
          updated_at: string
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "community_posts"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      cleanup_old_conversations: { Args: never; Returns: undefined }
      delete_user_account: { Args: never; Returns: undefined }
      get_leaderboard: {
        Args: { _limit?: number }
        Returns: {
          achievements_count: number
          display_name: string
          longest_streak: number
          total_days_used: number
          user_id: string
        }[]
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      is_user_banned: { Args: { user_uuid: string }; Returns: boolean }
      update_user_reputation: {
        Args: { points: number; target_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "user" | "therapist" | "admin"
      report_reason:
        | "spam"
        | "harassment"
        | "inappropriate_content"
        | "misinformation"
        | "other"
      report_status: "pending" | "reviewed" | "dismissed" | "actioned"
      report_type: "post" | "comment"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["user", "therapist", "admin"],
      report_reason: [
        "spam",
        "harassment",
        "inappropriate_content",
        "misinformation",
        "other",
      ],
      report_status: ["pending", "reviewed", "dismissed", "actioned"],
      report_type: ["post", "comment"],
    },
  },
} as const
