DROP INDEX "scans_session_created_at_idx";--> statement-breakpoint
ALTER TABLE "scan_feedback" ADD CONSTRAINT "scan_feedback_scan_id_scans_id_fk" FOREIGN KEY ("scan_id") REFERENCES "public"."scans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "scans_session_created_at_idx" ON "scans" USING btree ("session_id","created_at" desc);