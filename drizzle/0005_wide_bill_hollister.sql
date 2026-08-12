CREATE TABLE "rate_limit_buckets" (
	"key_hash" varchar(64) PRIMARY KEY NOT NULL,
	"window_started_at" timestamp with time zone NOT NULL,
	"count" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "integration_tokens" ADD COLUMN "expires_at" timestamp with time zone DEFAULT now() + interval '90 days' NOT NULL;--> statement-breakpoint
CREATE INDEX "rate_limit_buckets_window_idx" ON "rate_limit_buckets" USING btree ("window_started_at");--> statement-breakpoint
DELETE FROM "scan_feedback" AS older USING "scan_feedback" AS newer WHERE older."scan_id" = newer."scan_id" AND older."session_id" = newer."session_id" AND (older."created_at" < newer."created_at" OR (older."created_at" = newer."created_at" AND older."id" < newer."id"));--> statement-breakpoint
CREATE UNIQUE INDEX "scan_feedback_scan_session_idx" ON "scan_feedback" USING btree ("scan_id","session_id");
