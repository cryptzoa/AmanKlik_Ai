CREATE TYPE "public"."action_state" AS ENUM('pending', 'completed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."investigation_status" AS ENUM('active', 'resolved', 'archived');--> statement-breakpoint
CREATE TYPE "public"."outcome_impact" AS ENUM('none', 'data_shared', 'account_compromised', 'money_lost');--> statement-breakpoint
CREATE TYPE "public"."outcome_verdict" AS ENUM('prevented', 'confirmed_scam', 'legitimate', 'uncertain');--> statement-breakpoint
CREATE TABLE "integration_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar(128) NOT NULL,
	"name" varchar(60) NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "investigation_case_scans" (
	"case_id" uuid NOT NULL,
	"scan_id" uuid NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "investigation_case_scans_case_id_scan_id_pk" PRIMARY KEY("case_id","scan_id")
);
--> statement-breakpoint
CREATE TABLE "investigation_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar(128) NOT NULL,
	"title" varchar(80) NOT NULL,
	"status" "investigation_status" DEFAULT 'active' NOT NULL,
	"final_score" smallint DEFAULT 0 NOT NULL,
	"risk_level" "risk_level" DEFAULT 'LOW' NOT NULL,
	"summary" varchar(280) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scan_action_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scan_id" uuid NOT NULL,
	"session_id" varchar(128) NOT NULL,
	"action_id" varchar(120) NOT NULL,
	"state" "action_state" DEFAULT 'pending' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scan_outcomes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scan_id" uuid NOT NULL,
	"session_id" varchar(128) NOT NULL,
	"verdict" "outcome_verdict" NOT NULL,
	"impact" "outcome_impact" DEFAULT 'none' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "investigation_case_scans" ADD CONSTRAINT "investigation_case_scans_case_id_investigation_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."investigation_cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investigation_case_scans" ADD CONSTRAINT "investigation_case_scans_scan_id_scans_id_fk" FOREIGN KEY ("scan_id") REFERENCES "public"."scans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scan_action_progress" ADD CONSTRAINT "scan_action_progress_scan_id_scans_id_fk" FOREIGN KEY ("scan_id") REFERENCES "public"."scans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scan_outcomes" ADD CONSTRAINT "scan_outcomes_scan_id_scans_id_fk" FOREIGN KEY ("scan_id") REFERENCES "public"."scans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "integration_tokens_hash_idx" ON "integration_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "integration_tokens_session_idx" ON "integration_tokens" USING btree ("session_id","created_at" desc);--> statement-breakpoint
CREATE INDEX "investigation_case_scans_scan_idx" ON "investigation_case_scans" USING btree ("scan_id");--> statement-breakpoint
CREATE INDEX "investigation_cases_session_updated_idx" ON "investigation_cases" USING btree ("session_id","updated_at" desc);--> statement-breakpoint
CREATE UNIQUE INDEX "scan_action_progress_scan_action_idx" ON "scan_action_progress" USING btree ("scan_id","action_id");--> statement-breakpoint
CREATE INDEX "scan_action_progress_session_idx" ON "scan_action_progress" USING btree ("session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "scan_outcomes_scan_idx" ON "scan_outcomes" USING btree ("scan_id");--> statement-breakpoint
CREATE INDEX "scan_outcomes_session_idx" ON "scan_outcomes" USING btree ("session_id");