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
    PostgrestVersion: "14.4"
  }
  hieu_asia: {
    Tables: {
      affiliate_clicks: {
        Row: {
          affiliate_code: string
          country: string | null
          id: number
          ip_hash: string | null
          occurred_at: string
          referrer: string | null
          user_agent: string | null
          utm: Json
        }
        Insert: {
          affiliate_code: string
          country?: string | null
          id?: number
          ip_hash?: string | null
          occurred_at?: string
          referrer?: string | null
          user_agent?: string | null
          utm?: Json
        }
        Update: {
          affiliate_code?: string
          country?: string | null
          id?: number
          ip_hash?: string | null
          occurred_at?: string
          referrer?: string | null
          user_agent?: string | null
          utm?: Json
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_affiliate_code_fkey"
            columns: ["affiliate_code"]
            isOneToOne: false
            referencedRelation: "affiliate_stats_daily"
            referencedColumns: ["affiliate_code"]
          },
          {
            foreignKeyName: "affiliate_clicks_affiliate_code_fkey"
            columns: ["affiliate_code"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["code"]
          },
        ]
      }
      affiliate_commissions: {
        Row: {
          available_at: string | null
          beneficiary_id: string
          commission_rate: number
          commission_vnd: number
          cooling_period_days: number
          created_at: string
          gross_amount_vnd: number
          id: string
          order_id: string
          paid_at: string | null
          source_user_id: string
          status: string
          tier_level: number
        }
        Insert: {
          available_at?: string | null
          beneficiary_id: string
          commission_rate: number
          commission_vnd: number
          cooling_period_days?: number
          created_at?: string
          gross_amount_vnd: number
          id?: string
          order_id: string
          paid_at?: string | null
          source_user_id: string
          status?: string
          tier_level: number
        }
        Update: {
          available_at?: string | null
          beneficiary_id?: string
          commission_rate?: number
          commission_vnd?: number
          cooling_period_days?: number
          created_at?: string
          gross_amount_vnd?: number
          id?: string
          order_id?: string
          paid_at?: string | null
          source_user_id?: string
          status?: string
          tier_level?: number
        }
        Relationships: []
      }
      affiliate_conversions: {
        Row: {
          affiliate_code: string
          amount_vnd: number
          commission_vnd: number
          id: number
          occurred_at: string
          status: string
          transaction_id: string | null
        }
        Insert: {
          affiliate_code: string
          amount_vnd: number
          commission_vnd: number
          id?: number
          occurred_at?: string
          status?: string
          transaction_id?: string | null
        }
        Update: {
          affiliate_code?: string
          amount_vnd?: number
          commission_vnd?: number
          id?: number
          occurred_at?: string
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_conversions_affiliate_code_fkey"
            columns: ["affiliate_code"]
            isOneToOne: false
            referencedRelation: "affiliate_stats_daily"
            referencedColumns: ["affiliate_code"]
          },
          {
            foreignKeyName: "affiliate_conversions_affiliate_code_fkey"
            columns: ["affiliate_code"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["code"]
          },
        ]
      }
      affiliate_network: {
        Row: {
          affiliate_code: string
          created_at: string
          depth: number
          parent_user_id: string | null
          path: unknown
          preferred_rail: string
          rail_account_external_id: string | null
          rail_account_status: string | null
          rail_account_verified_at: string | null
          status: string
          tier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          affiliate_code: string
          created_at?: string
          depth: number
          parent_user_id?: string | null
          path: unknown
          preferred_rail?: string
          rail_account_external_id?: string | null
          rail_account_status?: string | null
          rail_account_verified_at?: string | null
          status?: string
          tier?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          affiliate_code?: string
          created_at?: string
          depth?: number
          parent_user_id?: string | null
          path?: unknown
          preferred_rail?: string
          rail_account_external_id?: string | null
          rail_account_status?: string | null
          rail_account_verified_at?: string | null
          status?: string
          tier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      affiliate_payout_batches: {
        Row: {
          affiliate_count: number
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          meta: Json | null
          notes: string | null
          paid_at: string | null
          rail: string
          status: string
          total_amount_vnd: number
          updated_at: string
        }
        Insert: {
          affiliate_count?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          meta?: Json | null
          notes?: string | null
          paid_at?: string | null
          rail: string
          status?: string
          total_amount_vnd?: number
          updated_at?: string
        }
        Update: {
          affiliate_count?: number
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          meta?: Json | null
          notes?: string | null
          paid_at?: string | null
          rail?: string
          status?: string
          total_amount_vnd?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payout_batches_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_code: string
          amount_vnd: number
          batch_id: string | null
          id: number
          method: string
          paid_at: string | null
          period: string | null
          reference: string | null
        }
        Insert: {
          affiliate_code: string
          amount_vnd: number
          batch_id?: string | null
          id?: number
          method: string
          paid_at?: string | null
          period?: string | null
          reference?: string | null
        }
        Update: {
          affiliate_code?: string
          amount_vnd?: number
          batch_id?: string | null
          id?: number
          method?: string
          paid_at?: string | null
          period?: string | null
          reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_code_fkey"
            columns: ["affiliate_code"]
            isOneToOne: false
            referencedRelation: "affiliate_stats_daily"
            referencedColumns: ["affiliate_code"]
          },
          {
            foreignKeyName: "affiliate_payouts_affiliate_code_fkey"
            columns: ["affiliate_code"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "affiliate_payouts_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "affiliate_payout_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          code: string
          created_at: string
          meta: Json
          owner_user_id: string | null
          payout_details: Json
          payout_method: string
          status: string
          tier: string
        }
        Insert: {
          code: string
          created_at?: string
          meta?: Json
          owner_user_id?: string | null
          payout_details?: Json
          payout_method: string
          status?: string
          tier?: string
        }
        Update: {
          code?: string
          created_at?: string
          meta?: Json
          owner_user_id?: string | null
          payout_details?: Json
          payout_method?: string
          status?: string
          tier?: string
        }
        Relationships: []
      }
      api_budgets: {
        Row: {
          created_at: string
          current_period_start: string
          current_usage_usd: number
          id: string
          limit_usd: number
          notes: string | null
          period: string
          soft_limit_usd: number | null
          team_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          current_period_start?: string
          current_usage_usd?: number
          id?: string
          limit_usd: number
          notes?: string | null
          period?: string
          soft_limit_usd?: number | null
          team_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          current_period_start?: string
          current_usage_usd?: number
          id?: string
          limit_usd?: number
          notes?: string | null
          period?: string
          soft_limit_usd?: number | null
          team_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_type: string | null
          audit_metadata: Json
          id: number
          ip_address: string | null
          resource_id: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          actor_type?: string | null
          audit_metadata: Json
          id?: number
          ip_address?: string | null
          resource_id?: string | null
          timestamp: string
          user_id?: string | null
        }
        Update: {
          action?: string
          actor_type?: string | null
          audit_metadata?: Json
          id?: number
          ip_address?: string | null
          resource_id?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      corpus_chunks: {
        Row: {
          chunk_index: number
          content: string
          content_hash: string
          created_at: string
          document_id: string
          embedding: string | null
          id: string
          metadata: Json
          page_from: number | null
          page_to: number | null
          token_count: number | null
        }
        Insert: {
          chunk_index: number
          content: string
          content_hash: string
          created_at?: string
          document_id: string
          embedding?: string | null
          id?: string
          metadata?: Json
          page_from?: number | null
          page_to?: number | null
          token_count?: number | null
        }
        Update: {
          chunk_index?: number
          content?: string
          content_hash?: string
          created_at?: string
          document_id?: string
          embedding?: string | null
          id?: string
          metadata?: Json
          page_from?: number | null
          page_to?: number | null
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "corpus_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "corpus_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      corpus_documents: {
        Row: {
          author: string | null
          bo_mon: string
          chunk_count: number
          created_at: string
          edition: string | null
          file_type: string | null
          id: string
          ingest_error: string | null
          ingest_status: string
          language: string
          license: string | null
          license_notes: string | null
          page_count: number | null
          source_url: string | null
          storage_bucket: string | null
          storage_key: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          bo_mon: string
          chunk_count?: number
          created_at?: string
          edition?: string | null
          file_type?: string | null
          id?: string
          ingest_error?: string | null
          ingest_status?: string
          language?: string
          license?: string | null
          license_notes?: string | null
          page_count?: number | null
          source_url?: string | null
          storage_bucket?: string | null
          storage_key?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          bo_mon?: string
          chunk_count?: number
          created_at?: string
          edition?: string | null
          file_type?: string | null
          id?: string
          ingest_error?: string | null
          ingest_status?: string
          language?: string
          license?: string | null
          license_notes?: string | null
          page_count?: number | null
          source_url?: string | null
          storage_bucket?: string | null
          storage_key?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_pct: number | null
          discount_vnd: number | null
          max_uses: number | null
          notes: string | null
          status: string
          tier_filter: string[] | null
          updated_at: string
          uses: number
          valid_from: string
          valid_to: string | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_pct?: number | null
          discount_vnd?: number | null
          max_uses?: number | null
          notes?: string | null
          status?: string
          tier_filter?: string[] | null
          updated_at?: string
          uses?: number
          valid_from?: string
          valid_to?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_pct?: number | null
          discount_vnd?: number | null
          max_uses?: number | null
          notes?: string | null
          status?: string
          tier_filter?: string[] | null
          updated_at?: string
          uses?: number
          valid_from?: string
          valid_to?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          enabled: boolean
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          enabled?: boolean
          key: string
          updated_at: string
          value?: Json | null
        }
        Update: {
          enabled?: boolean
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
      hand_images: {
        Row: {
          deleted: boolean
          object_name: string
          retention_opt_in: boolean
          uploaded_at: string
          user_id: string
        }
        Insert: {
          deleted: boolean
          object_name: string
          retention_opt_in: boolean
          uploaded_at: string
          user_id: string
        }
        Update: {
          deleted?: boolean
          object_name?: string
          retention_opt_in?: boolean
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      llm_traces: {
        Row: {
          cost_usd: number
          created_at: string
          error_class: string | null
          id: string
          idempotency_key: string | null
          input_tokens: number
          latency_ms: number
          meta: Json | null
          model: string
          output_tokens: number
          reading_session_id: string | null
          role: string | null
          status: string
          trace_id: string | null
          user_id: string | null
          vendor: string
        }
        Insert: {
          cost_usd?: number
          created_at?: string
          error_class?: string | null
          id?: string
          idempotency_key?: string | null
          input_tokens?: number
          latency_ms?: number
          meta?: Json | null
          model: string
          output_tokens?: number
          reading_session_id?: string | null
          role?: string | null
          status?: string
          trace_id?: string | null
          user_id?: string | null
          vendor: string
        }
        Update: {
          cost_usd?: number
          created_at?: string
          error_class?: string | null
          id?: string
          idempotency_key?: string | null
          input_tokens?: number
          latency_ms?: number
          meta?: Json | null
          model?: string
          output_tokens?: number
          reading_session_id?: string | null
          role?: string | null
          status?: string
          trace_id?: string | null
          user_id?: string | null
          vendor?: string
        }
        Relationships: [
          {
            foreignKeyName: "llm_traces_reading_session_id_fkey"
            columns: ["reading_session_id"]
            isOneToOne: false
            referencedRelation: "reading_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      reading_sessions: {
        Row: {
          session_id: string
          state_json: Json
          updated_at: string
        }
        Insert: {
          session_id: string
          state_json: Json
          updated_at: string
        }
        Update: {
          session_id?: string
          state_json?: Json
          updated_at?: string
        }
        Relationships: []
      }
      reading_tasks: {
        Row: {
          created_at: string
          error: string | null
          session_id: string
          status: string
          task_id: string
          updated_at: string
        }
        Insert: {
          created_at: string
          error?: string | null
          session_id: string
          status: string
          task_id: string
          updated_at: string
        }
        Update: {
          created_at?: string
          error?: string | null
          session_id?: string
          status?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          provider: string
          status: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at: string
          currency: string
          id: string
          provider: string
          status: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          provider?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          app_role: string | null
          chart_data: Json | null
          consent_flags: Json
          created_at: string
          email: string | null
          email_opted_out: boolean | null
          id: string
          last_active: string | null
          onboarding_completed_at: string | null
          phone: string | null
          plan: string
          telegram_id: string | null
          zalo_id: string | null
        }
        Insert: {
          app_role?: string | null
          chart_data?: Json | null
          consent_flags?: Json
          created_at: string
          email?: string | null
          email_opted_out?: boolean | null
          id: string
          last_active?: string | null
          onboarding_completed_at?: string | null
          phone?: string | null
          plan?: string
          telegram_id?: string | null
          zalo_id?: string | null
        }
        Update: {
          app_role?: string | null
          chart_data?: Json | null
          consent_flags?: Json
          created_at?: string
          email?: string | null
          email_opted_out?: boolean | null
          id?: string
          last_active?: string | null
          onboarding_completed_at?: string | null
          phone?: string | null
          plan?: string
          telegram_id?: string | null
          zalo_id?: string | null
        }
        Relationships: []
      }
      visitor_identities: {
        Row: {
          anon_distinct_id: string | null
          authed_user_id: string | null
          first_seen: string
          id: number
          last_seen: string
          link_source: string
          linked_at: string
          telegram_id: string | null
          zalo_id: string | null
        }
        Insert: {
          anon_distinct_id?: string | null
          authed_user_id?: string | null
          first_seen?: string
          id?: number
          last_seen?: string
          link_source?: string
          linked_at?: string
          telegram_id?: string | null
          zalo_id?: string | null
        }
        Update: {
          anon_distinct_id?: string | null
          authed_user_id?: string | null
          first_seen?: string
          id?: number
          last_seen?: string
          link_source?: string
          linked_at?: string
          telegram_id?: string | null
          zalo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitor_identities_authed_user_id_fkey"
            columns: ["authed_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      affiliate_stats_daily: {
        Row: {
          affiliate_code: string | null
          amount_vnd: number | null
          clicks: number | null
          commission_vnd: number | null
          conversions: number | null
          day: string | null
        }
        Relationships: []
      }
      affiliate_subtree_stats: {
        Row: {
          affiliate_code: string | null
          l1_count: number | null
          l2_count: number | null
          l3_count: number | null
          root_user_id: string | null
          total_subtree: number | null
        }
        Relationships: []
      }
      llm_trace_daily: {
        Row: {
          call_count: number | null
          cost_usd_sum: number | null
          day: string | null
          error_count: number | null
          input_tokens_sum: number | null
          latency_ms_avg: number | null
          model: string | null
          output_tokens_sum: number | null
          rate_limited_count: number | null
          role: string | null
          vendor: string | null
        }
        Relationships: []
      }
      mv_affiliate_leaderboard: {
        Row: {
          affiliate_code: string | null
          tier: string | null
          total_available_vnd: number | null
          total_commissions: number | null
          total_earned_vnd: number | null
          total_orders: number | null
          total_paid_vnd: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      aff_click_day_utc: { Args: { ts: string }; Returns: string }
      build_payout_batch: {
        Args: { p_min_amount_vnd?: number; p_rail: string }
        Returns: {
          affiliate_count: number
          batch_id: string
          payout_ids: string[]
          total_amount_vnd: number
        }[]
      }
      check_and_charge_budget: {
        Args: { p_cost_usd: number; p_user_id: string }
        Returns: boolean
      }
      clawback_commission: {
        Args: { p_commission_id: string; p_reason?: string }
        Returns: {
          available_at: string | null
          beneficiary_id: string
          commission_rate: number
          commission_vnd: number
          cooling_period_days: number
          created_at: string
          gross_amount_vnd: number
          id: string
          order_id: string
          paid_at: string | null
          source_user_id: string
          status: string
          tier_level: number
        }
        SetofOptions: {
          from: "*"
          to: "affiliate_commissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      cron_commission_held_to_available: { Args: never; Returns: undefined }
      cron_commission_pending_to_held: { Args: never; Returns: undefined }
      cron_refresh_leaderboard: { Args: never; Returns: undefined }
      reparent_affiliate: {
        Args: { p_new_parent_user_id: string; p_user_id: string }
        Returns: undefined
      }
      search_corpus: {
        Args: { p_filter?: Json; p_limit?: number; p_query_embedding: string }
        Returns: {
          chunk_id: string
          content: string
          document_id: string
          metadata: Json
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      agent_checkpoints: {
        Row: {
          channel_values: Json
          channel_versions: Json
          checkpoint_id: string
          created_at: string
          node: string
          parent_checkpoint_id: string | null
          pending_sends: Json | null
          run_id: string
          versions_seen: Json
        }
        Insert: {
          channel_values: Json
          channel_versions?: Json
          checkpoint_id?: string
          created_at?: string
          node: string
          parent_checkpoint_id?: string | null
          pending_sends?: Json | null
          run_id: string
          versions_seen?: Json
        }
        Update: {
          channel_values?: Json
          channel_versions?: Json
          checkpoint_id?: string
          created_at?: string
          node?: string
          parent_checkpoint_id?: string | null
          pending_sends?: Json | null
          run_id?: string
          versions_seen?: Json
        }
        Relationships: [
          {
            foreignKeyName: "agent_checkpoints_parent_checkpoint_id_fkey"
            columns: ["parent_checkpoint_id"]
            isOneToOne: false
            referencedRelation: "agent_checkpoints"
            referencedColumns: ["checkpoint_id"]
          },
          {
            foreignKeyName: "agent_checkpoints_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["run_id"]
          },
        ]
      }
      agent_runs: {
        Row: {
          completed_at: string | null
          cost_usd: number
          current_node: string | null
          error_message: string | null
          graph_name: string
          run_id: string
          started_at: string
          state: Json
          status: string
          tokens_in: number
          tokens_out: number
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          cost_usd?: number
          current_node?: string | null
          error_message?: string | null
          graph_name: string
          run_id?: string
          started_at?: string
          state?: Json
          status?: string
          tokens_in?: number
          tokens_out?: number
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          cost_usd?: number
          current_node?: string | null
          error_message?: string | null
          graph_name?: string
          run_id?: string
          started_at?: string
          state?: Json
          status?: string
          tokens_in?: number
          tokens_out?: number
          user_id?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          employee_id: string
          id: string
          notes: string | null
          overtime_mins: number
          recorded_by: string | null
          shift_assignment_id: string | null
          status: string
          work_date: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          employee_id: string
          id?: string
          notes?: string | null
          overtime_mins?: number
          recorded_by?: string | null
          shift_assignment_id?: string | null
          status?: string
          work_date: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          employee_id?: string
          id?: string
          notes?: string | null
          overtime_mins?: number
          recorded_by?: string | null
          shift_assignment_id?: string | null
          status?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_shift_assignment_id_fkey"
            columns: ["shift_assignment_id"]
            isOneToOne: false
            referencedRelation: "shift_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      charts: {
        Row: {
          birth_day: number
          birth_hour: number
          birth_month: number
          birth_year: number
          chart_data: Json | null
          created_at: string | null
          gender: string
          id: string
          name: string | null
          user_id: string | null
        }
        Insert: {
          birth_day: number
          birth_hour: number
          birth_month: number
          birth_year: number
          chart_data?: Json | null
          created_at?: string | null
          gender: string
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Update: {
          birth_day?: number
          birth_hour?: number
          birth_month?: number
          birth_year?: number
          chart_data?: Json | null
          created_at?: string | null
          gender?: string
          id?: string
          name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "charts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chart_id: string | null
          content: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          chart_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          chart_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chart_id_fkey"
            columns: ["chart_id"]
            isOneToOne: false
            referencedRelation: "charts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_drip_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      email_drip_log: {
        Row: {
          clicked_at: string | null
          email_kind: string
          opened_at: string | null
          sent_at: string
          user_id: string
        }
        Insert: {
          clicked_at?: string | null
          email_kind: string
          opened_at?: string | null
          sent_at?: string
          user_id: string
        }
        Update: {
          clicked_at?: string | null
          email_kind?: string
          opened_at?: string | null
          sent_at?: string
          user_id?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          avatar_url: string | null
          clerk_user_id: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          employee_code: string
          end_date: string | null
          full_name: string
          gender: string | null
          hire_date: string
          id: string
          id_number: string | null
          notes: string | null
          phone: string | null
          position_id: string | null
          salary: number | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          clerk_user_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          employee_code: string
          end_date?: string | null
          full_name: string
          gender?: string | null
          hire_date?: string
          id?: string
          id_number?: string | null
          notes?: string | null
          phone?: string | null
          position_id?: string | null
          salary?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          clerk_user_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          employee_code?: string
          end_date?: string | null
          full_name?: string
          gender?: string | null
          hire_date?: string
          id?: string
          id_number?: string | null
          notes?: string | null
          phone?: string | null
          position_id?: string | null
          salary?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          base_salary: number
          created_at: string
          department: string
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          base_salary?: number
          created_at?: string
          department?: string
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          base_salary?: number
          created_at?: string
          department?: string
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          endpoint: string
          ip: string
          request_count: number | null
          window_start: string | null
        }
        Insert: {
          endpoint: string
          ip: string
          request_count?: number | null
          window_start?: string | null
        }
        Update: {
          endpoint?: string
          ip?: string
          request_count?: number | null
          window_start?: string | null
        }
        Relationships: []
      }
      reading_corpus: {
        Row: {
          chapter: string | null
          content: string
          created_at: string
          embedding: string
          id: number
          source: string
          tags: string[]
          token_count: number | null
        }
        Insert: {
          chapter?: string | null
          content: string
          created_at?: string
          embedding: string
          id?: number
          source: string
          tags?: string[]
          token_count?: number | null
        }
        Update: {
          chapter?: string | null
          content?: string
          created_at?: string
          embedding?: string
          id?: number
          source?: string
          tags?: string[]
          token_count?: number | null
        }
        Relationships: []
      }
      reasoning_daily_cost: {
        Row: {
          call_count: number
          cost_usd: number
          day: string
          subject_key: string
          updated_at: string
        }
        Insert: {
          call_count?: number
          cost_usd?: number
          day?: string
          subject_key: string
          updated_at?: string
        }
        Update: {
          call_count?: number
          cost_usd?: number
          day?: string
          subject_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      shift_assignments: {
        Row: {
          created_at: string
          created_by: string | null
          employee_id: string
          id: string
          notes: string | null
          shift_id: string
          status: string
          work_date: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          employee_id: string
          id?: string
          notes?: string | null
          shift_id: string
          status?: string
          work_date: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          employee_id?: string
          id?: string
          notes?: string | null
          shift_id?: string
          status?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "shift_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_assignments_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          break_minutes: number
          created_at: string
          end_time: string
          id: string
          is_active: boolean
          name: string
          start_time: string
        }
        Insert: {
          break_minutes?: number
          created_at?: string
          end_time: string
          id?: string
          is_active?: boolean
          name: string
          start_time: string
        }
        Update: {
          break_minutes?: number
          created_at?: string
          end_time?: string
          id?: string
          is_active?: boolean
          name?: string
          start_time?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      wiki_article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wiki_article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "wiki_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wiki_article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "wiki_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      wiki_articles: {
        Row: {
          author_id: string | null
          category_id: string
          chapter_number: number | null
          content: string
          created_at: string | null
          id: string
          is_published: boolean | null
          min_role: string | null
          slug: string
          sort_order: number
          summary: string | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id: string
          chapter_number?: number | null
          content?: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          min_role?: string | null
          slug: string
          sort_order?: number
          summary?: string | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string
          chapter_number?: number | null
          content?: string
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          min_role?: string | null
          slug?: string
          sort_order?: number
          summary?: string | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wiki_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "wiki_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      wiki_bookmarks: {
        Row: {
          article_id: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wiki_bookmarks_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "wiki_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      wiki_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          total_items: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          total_items?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          total_items?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      wiki_search_log: {
        Row: {
          created_at: string | null
          id: string
          query: string
          results_count: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          query: string
          results_count?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          query?: string
          results_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      wiki_sections: {
        Row: {
          article_id: string
          content: string
          created_at: string | null
          id: string
          slug: string
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          article_id: string
          content?: string
          created_at?: string | null
          id?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string | null
          id?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wiki_sections_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "wiki_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      wiki_tables: {
        Row: {
          article_id: string
          created_at: string | null
          headers: Json
          id: string
          rows: Json
          section_id: string | null
          sort_order: number
          table_number: number | null
          title: string
        }
        Insert: {
          article_id: string
          created_at?: string | null
          headers?: Json
          id?: string
          rows?: Json
          section_id?: string | null
          sort_order?: number
          table_number?: number | null
          title: string
        }
        Update: {
          article_id?: string
          created_at?: string | null
          headers?: Json
          id?: string
          rows?: Json
          section_id?: string | null
          sort_order?: number
          table_number?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "wiki_tables_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "wiki_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wiki_tables_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "wiki_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      wiki_tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_increment_reasoning_cost: {
        Args: {
          p_cap_usd: number
          p_estimated_cost_usd: number
          p_subject_key: string
        }
        Returns: Json
      }
      check_free_reading_quota: { Args: { p_user_id: string }; Returns: Json }
      dispatch_wave58_drip: { Args: never; Returns: undefined }
      increment_agent_run_cost: {
        Args: {
          p_cost_usd: number
          p_current_node: string
          p_run_id: string
          p_tokens_in: number
          p_tokens_out: number
        }
        Returns: undefined
      }
      increment_article_views: {
        Args: { article_id: string }
        Returns: undefined
      }
      retrieve_context: {
        Args: {
          filter_tags?: string[]
          match_count?: number
          query_embedding: string
        }
        Returns: {
          chapter: string
          content: string
          id: number
          similarity: number
          source: string
          tags: string[]
        }[]
      }
      search_wiki: {
        Args: { max_results?: number; search_query: string }
        Returns: {
          category_name: string
          category_slug: string
          id: string
          rank: number
          slug: string
          summary: string
          title: string
        }[]
      }
      text2ltree: { Args: { "": string }; Returns: unknown }
    }
    Enums: {
      [_ in never]: never
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
  hieu_asia: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
