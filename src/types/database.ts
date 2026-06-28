export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "14.5";
	};
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					extensions?: Json;
					operationName?: string;
					query?: string;
					variables?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			bank_accounts: {
				Row: {
					account_holder: string;
					account_number: string;
					bank_code: string;
					created_at: string;
					deleted_at: string | null;
					id: string;
					is_default: boolean;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					account_holder: string;
					account_number: string;
					bank_code: string;
					created_at?: string;
					deleted_at?: string | null;
					id?: string;
					is_default?: boolean;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					account_holder?: string;
					account_number?: string;
					bank_code?: string;
					created_at?: string;
					deleted_at?: string | null;
					id?: string;
					is_default?: boolean;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bank_accounts_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			invoice_events: {
				Row: {
					actor_id: string | null;
					created_at: string;
					event_type: string;
					from_status: string | null;
					id: string;
					invoice_id: string;
					metadata: Json | null;
					to_status: string | null;
				};
				Insert: {
					actor_id?: string | null;
					created_at?: string;
					event_type: string;
					from_status?: string | null;
					id?: string;
					invoice_id: string;
					metadata?: Json | null;
					to_status?: string | null;
				};
				Update: {
					actor_id?: string | null;
					created_at?: string;
					event_type?: string;
					from_status?: string | null;
					id?: string;
					invoice_id?: string;
					metadata?: Json | null;
					to_status?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "invoice_events_actor_id_fkey";
						columns: ["actor_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "invoice_events_invoice_id_fkey";
						columns: ["invoice_id"];
						isOneToOne: false;
						referencedRelation: "invoices";
						referencedColumns: ["id"];
					}
				];
			};
			invoice_items: {
				Row: {
					amount: number;
					created_at: string;
					description: string;
					id: string;
					invoice_id: string;
					kind: string;
					metadata: Json | null;
				};
				Insert: {
					amount: number;
					created_at?: string;
					description: string;
					id?: string;
					invoice_id: string;
					kind: string;
					metadata?: Json | null;
				};
				Update: {
					amount?: number;
					created_at?: string;
					description?: string;
					id?: string;
					invoice_id?: string;
					kind?: string;
					metadata?: Json | null;
				};
				Relationships: [
					{
						foreignKeyName: "invoice_items_invoice_id_fkey";
						columns: ["invoice_id"];
						isOneToOne: false;
						referencedRelation: "invoices";
						referencedColumns: ["id"];
					}
				];
			};
			invoices: {
				Row: {
					base_amount: number;
					created_at: string;
					currency: string;
					defaulted_at: string | null;
					due_date: string;
					id: string;
					idempotency_key: string;
					overdue_at: string | null;
					paid_at: string | null;
					period: string;
					room_id: string;
					sent_at: string | null;
					status: string;
					tenant_id: string;
					total_amount: number;
					unique_code: number | null;
					updated_at: string;
				};
				Insert: {
					base_amount: number;
					created_at?: string;
					currency?: string;
					defaulted_at?: string | null;
					due_date: string;
					id?: string;
					idempotency_key: string;
					overdue_at?: string | null;
					paid_at?: string | null;
					period: string;
					room_id: string;
					sent_at?: string | null;
					status?: string;
					tenant_id: string;
					total_amount: number;
					unique_code?: number | null;
					updated_at?: string;
				};
				Update: {
					base_amount?: number;
					created_at?: string;
					currency?: string;
					defaulted_at?: string | null;
					due_date?: string;
					id?: string;
					idempotency_key?: string;
					overdue_at?: string | null;
					paid_at?: string | null;
					period?: string;
					room_id?: string;
					sent_at?: string | null;
					status?: string;
					tenant_id?: string;
					total_amount?: number;
					unique_code?: number | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "invoices_room_id_fkey";
						columns: ["room_id"];
						isOneToOne: false;
						referencedRelation: "rooms";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "invoices_tenant_id_fkey";
						columns: ["tenant_id"];
						isOneToOne: false;
						referencedRelation: "tenants";
						referencedColumns: ["id"];
					}
				];
			};
			notifications: {
				Row: {
					channel: string;
					created_at: string;
					id: string;
					invoice_id: string;
					kind: string;
					opened_at: string | null;
					payload: string;
					provider_ref: string | null;
					recipient_phone: string;
					sent_at: string | null;
					status: string;
				};
				Insert: {
					channel: string;
					created_at?: string;
					id?: string;
					invoice_id: string;
					kind: string;
					opened_at?: string | null;
					payload: string;
					provider_ref?: string | null;
					recipient_phone: string;
					sent_at?: string | null;
					status?: string;
				};
				Update: {
					channel?: string;
					created_at?: string;
					id?: string;
					invoice_id?: string;
					kind?: string;
					opened_at?: string | null;
					payload?: string;
					provider_ref?: string | null;
					recipient_phone?: string;
					sent_at?: string | null;
					status?: string;
				};
				Relationships: [
					{
						foreignKeyName: "notifications_invoice_id_fkey";
						columns: ["invoice_id"];
						isOneToOne: false;
						referencedRelation: "invoices";
						referencedColumns: ["id"];
					}
				];
			};
			payments: {
				Row: {
					amount: number;
					confirmed_by: string | null;
					created_at: string;
					id: string;
					idempotency_key: string;
					invoice_id: string;
					paid_at: string | null;
					proof_id: string | null;
					provider: string | null;
					provider_fee: number | null;
					provider_payload: Json | null;
					provider_ref: string | null;
					source: string;
					status: string;
					updated_at: string;
				};
				Insert: {
					amount: number;
					confirmed_by?: string | null;
					created_at?: string;
					id?: string;
					idempotency_key: string;
					invoice_id: string;
					paid_at?: string | null;
					proof_id?: string | null;
					provider?: string | null;
					provider_fee?: number | null;
					provider_payload?: Json | null;
					provider_ref?: string | null;
					source: string;
					status?: string;
					updated_at?: string;
				};
				Update: {
					amount?: number;
					confirmed_by?: string | null;
					created_at?: string;
					id?: string;
					idempotency_key?: string;
					invoice_id?: string;
					paid_at?: string | null;
					proof_id?: string | null;
					provider?: string | null;
					provider_fee?: number | null;
					provider_payload?: Json | null;
					provider_ref?: string | null;
					source?: string;
					status?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "payments_confirmed_by_fkey";
						columns: ["confirmed_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "payments_invoice_id_fkey";
						columns: ["invoice_id"];
						isOneToOne: false;
						referencedRelation: "invoices";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "payments_proof_id_fkey";
						columns: ["proof_id"];
						isOneToOne: false;
						referencedRelation: "proofs";
						referencedColumns: ["id"];
					}
				];
			};
			plan_features: {
				Row: {
					created_at: string;
					enabled: boolean;
					feature_key: string;
					id: string;
					limit_value: number | null;
					plan_id: string;
				};
				Insert: {
					created_at?: string;
					enabled?: boolean;
					feature_key: string;
					id?: string;
					limit_value?: number | null;
					plan_id: string;
				};
				Update: {
					created_at?: string;
					enabled?: boolean;
					feature_key?: string;
					id?: string;
					limit_value?: number | null;
					plan_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "plan_features_plan_id_fkey";
						columns: ["plan_id"];
						isOneToOne: false;
						referencedRelation: "plans";
						referencedColumns: ["id"];
					}
				];
			};
			plans: {
				Row: {
					code: string;
					created_at: string;
					id: string;
					is_active: boolean;
					max_properties: number;
					max_rooms: number;
					min_monthly: number;
					name: string;
					price_per_room: number;
					updated_at: string;
				};
				Insert: {
					code: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					max_properties?: number;
					max_rooms?: number;
					min_monthly?: number;
					name: string;
					price_per_room?: number;
					updated_at?: string;
				};
				Update: {
					code?: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					max_properties?: number;
					max_rooms?: number;
					min_monthly?: number;
					name?: string;
					price_per_room?: number;
					updated_at?: string;
				};
				Relationships: [];
			};
			proofs: {
				Row: {
					created_at: string;
					decided_at: string | null;
					decided_by: string | null;
					file_size: number | null;
					id: string;
					invoice_id: string;
					mime_type: string;
					rejection_reason: string | null;
					status: string;
					storage_key: string;
					uploaded_at: string;
				};
				Insert: {
					created_at?: string;
					decided_at?: string | null;
					decided_by?: string | null;
					file_size?: number | null;
					id?: string;
					invoice_id: string;
					mime_type: string;
					rejection_reason?: string | null;
					status?: string;
					storage_key: string;
					uploaded_at?: string;
				};
				Update: {
					created_at?: string;
					decided_at?: string | null;
					decided_by?: string | null;
					file_size?: number | null;
					id?: string;
					invoice_id?: string;
					mime_type?: string;
					rejection_reason?: string | null;
					status?: string;
					storage_key?: string;
					uploaded_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "proofs_decided_by_fkey";
						columns: ["decided_by"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "proofs_invoice_id_fkey";
						columns: ["invoice_id"];
						isOneToOne: false;
						referencedRelation: "invoices";
						referencedColumns: ["id"];
					}
				];
			};
			properties: {
				Row: {
					city: string;
					created_at: string;
					default_due_day: number;
					default_rent: number;
					deleted_at: string | null;
					id: string;
					name: string;
					owner_id: string;
					status: string;
					timezone: string;
					unique_code_enabled: boolean;
					updated_at: string;
				};
				Insert: {
					city: string;
					created_at?: string;
					default_due_day: number;
					default_rent: number;
					deleted_at?: string | null;
					id?: string;
					name: string;
					owner_id: string;
					status?: string;
					timezone?: string;
					unique_code_enabled?: boolean;
					updated_at?: string;
				};
				Update: {
					city?: string;
					created_at?: string;
					default_due_day?: number;
					default_rent?: number;
					deleted_at?: string | null;
					id?: string;
					name?: string;
					owner_id?: string;
					status?: string;
					timezone?: string;
					unique_code_enabled?: boolean;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "properties_owner_id_fkey";
						columns: ["owner_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			property_staff: {
				Row: {
					accepted_at: string | null;
					created_at: string;
					id: string;
					invited_at: string | null;
					property_id: string;
					revoked_at: string | null;
					role: string;
					user_id: string;
				};
				Insert: {
					accepted_at?: string | null;
					created_at?: string;
					id?: string;
					invited_at?: string | null;
					property_id: string;
					revoked_at?: string | null;
					role: string;
					user_id: string;
				};
				Update: {
					accepted_at?: string | null;
					created_at?: string;
					id?: string;
					invited_at?: string | null;
					property_id?: string;
					revoked_at?: string | null;
					role?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "property_staff_property_id_fkey";
						columns: ["property_id"];
						isOneToOne: false;
						referencedRelation: "properties";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "property_staff_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			public_tokens: {
				Row: {
					created_at: string;
					expires_at: string;
					id: string;
					kind: string;
					target_id: string;
					token_hash: string;
					used_at: string | null;
				};
				Insert: {
					created_at?: string;
					expires_at: string;
					id?: string;
					kind: string;
					target_id: string;
					token_hash: string;
					used_at?: string | null;
				};
				Update: {
					created_at?: string;
					expires_at?: string;
					id?: string;
					kind?: string;
					target_id?: string;
					token_hash?: string;
					used_at?: string | null;
				};
				Relationships: [];
			};
			rooms: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					due_day_override: number | null;
					id: string;
					label: string | null;
					property_id: string;
					rent_override: number | null;
					room_number: number;
					status: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					due_day_override?: number | null;
					id?: string;
					label?: string | null;
					property_id: string;
					rent_override?: number | null;
					room_number: number;
					status?: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					due_day_override?: number | null;
					id?: string;
					label?: string | null;
					property_id?: string;
					rent_override?: number | null;
					room_number?: number;
					status?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "rooms_property_id_fkey";
						columns: ["property_id"];
						isOneToOne: false;
						referencedRelation: "properties";
						referencedColumns: ["id"];
					}
				];
			};
			subscription_addons: {
				Row: {
					activated_at: string | null;
					created_at: string;
					deactivated_at: string | null;
					feature_key: string;
					id: string;
					price_monthly: number;
					status: string;
					subscription_id: string;
				};
				Insert: {
					activated_at?: string | null;
					created_at?: string;
					deactivated_at?: string | null;
					feature_key: string;
					id?: string;
					price_monthly: number;
					status?: string;
					subscription_id: string;
				};
				Update: {
					activated_at?: string | null;
					created_at?: string;
					deactivated_at?: string | null;
					feature_key?: string;
					id?: string;
					price_monthly?: number;
					status?: string;
					subscription_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "subscription_addons_subscription_id_fkey";
						columns: ["subscription_id"];
						isOneToOne: false;
						referencedRelation: "subscriptions";
						referencedColumns: ["id"];
					}
				];
			};
			subscriptions: {
				Row: {
					billing_cycle: string;
					cancelled_at: string | null;
					created_at: string;
					current_period_end: string | null;
					current_period_start: string | null;
					id: string;
					owner_id: string;
					plan_id: string;
					status: string;
					trial_invoices_left: number | null;
					updated_at: string;
				};
				Insert: {
					billing_cycle?: string;
					cancelled_at?: string | null;
					created_at?: string;
					current_period_end?: string | null;
					current_period_start?: string | null;
					id?: string;
					owner_id: string;
					plan_id: string;
					status?: string;
					trial_invoices_left?: number | null;
					updated_at?: string;
				};
				Update: {
					billing_cycle?: string;
					cancelled_at?: string | null;
					created_at?: string;
					current_period_end?: string | null;
					current_period_start?: string | null;
					id?: string;
					owner_id?: string;
					plan_id?: string;
					status?: string;
					trial_invoices_left?: number | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "subscriptions_owner_id_fkey";
						columns: ["owner_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "subscriptions_plan_id_fkey";
						columns: ["plan_id"];
						isOneToOne: false;
						referencedRelation: "plans";
						referencedColumns: ["id"];
					}
				];
			};
			tenants: {
				Row: {
					created_at: string;
					id: string;
					moved_in_at: string;
					moved_out_at: string | null;
					name: string;
					notes: string | null;
					phone_wa: string;
					room_id: string;
					updated_at: string;
					user_id: string | null;
				};
				Insert: {
					created_at?: string;
					id?: string;
					moved_in_at: string;
					moved_out_at?: string | null;
					name: string;
					notes?: string | null;
					phone_wa: string;
					room_id: string;
					updated_at?: string;
					user_id?: string | null;
				};
				Update: {
					created_at?: string;
					id?: string;
					moved_in_at?: string;
					moved_out_at?: string | null;
					name?: string;
					notes?: string | null;
					phone_wa?: string;
					room_id?: string;
					updated_at?: string;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "tenants_room_id_fkey";
						columns: ["room_id"];
						isOneToOne: false;
						referencedRelation: "rooms";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "tenants_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					}
				];
			};
			users: {
				Row: {
					created_at: string;
					deleted_at: string | null;
					email: string;
					email_verified_at: string | null;
					id: string;
					locale: string;
					name: string;
					phone_verified_at: string | null;
					phone_wa: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					deleted_at?: string | null;
					email: string;
					email_verified_at?: string | null;
					id: string;
					locale?: string;
					name: string;
					phone_verified_at?: string | null;
					phone_wa: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					deleted_at?: string | null;
					email?: string;
					email_verified_at?: string | null;
					id?: string;
					locale?: string;
					name?: string;
					phone_verified_at?: string | null;
					phone_wa?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			webhook_logs: {
				Row: {
					attempt_count: number;
					created_at: string;
					event_type: string;
					id: string;
					idempotency_key: string;
					last_error: string | null;
					payload: Json;
					processed: boolean;
					processed_at: string | null;
					source: string;
				};
				Insert: {
					attempt_count?: number;
					created_at?: string;
					event_type: string;
					id?: string;
					idempotency_key: string;
					last_error?: string | null;
					payload: Json;
					processed?: boolean;
					processed_at?: string | null;
					source: string;
				};
				Update: {
					attempt_count?: number;
					created_at?: string;
					event_type?: string;
					id?: string;
					idempotency_key?: string;
					last_error?: string | null;
					payload?: Json;
					processed?: boolean;
					processed_at?: string | null;
					source?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends (DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never) = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
	TableName extends (DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never) = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
	TableName extends (DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never) = never
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
	EnumName extends (DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never) = never
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never) = never
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {}
	},
	public: {
		Enums: {}
	}
} as const;
