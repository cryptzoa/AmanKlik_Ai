CREATE TYPE "public"."analysis_mode" AS ENUM('hybrid', 'rules_only', 'cached_hybrid');--> statement-breakpoint
CREATE TYPE "public"."feedback_verdict" AS ENUM('helpful', 'not_helpful', 'seems_incorrect');--> statement-breakpoint
CREATE TYPE "public"."input_type" AS ENUM('text', 'image', 'url');--> statement-breakpoint
CREATE TYPE "public"."risk_level" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');--> statement-breakpoint
CREATE TABLE "analysis_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"input_hash" varchar(64) NOT NULL,
	"input_type" "input_type" NOT NULL,
	"result_json" jsonb NOT NULL,
	"model_id" varchar(120),
	"analysis_mode" "analysis_mode" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	CONSTRAINT "analysis_cache_input_hash_unique" UNIQUE("input_hash")
);
--> statement-breakpoint
CREATE TABLE "scan_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scan_id" uuid NOT NULL,
	"session_id" varchar(128) NOT NULL,
	"verdict" "feedback_verdict" NOT NULL,
	"comment" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar(128) NOT NULL,
	"input_type" "input_type" NOT NULL,
	"input_hash" varchar(64) NOT NULL,
	"preview_redacted" text,
	"final_score" smallint NOT NULL,
	"risk_level" "risk_level" NOT NULL,
	"analysis_mode" "analysis_mode" NOT NULL,
	"ai_available" boolean DEFAULT false NOT NULL,
	"cache_hit" boolean DEFAULT false NOT NULL,
	"model_id" varchar(120),
	"provider_latency_ms" integer,
	"result_json" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "scans_session_created_at_idx" ON "scans" USING btree ("session_id","created_at");--> statement-breakpoint
CREATE INDEX "scans_input_hash_idx" ON "scans" USING btree ("input_hash");--> statement-breakpoint
CREATE INDEX "scans_expires_at_idx" ON "scans" USING btree ("expires_at");