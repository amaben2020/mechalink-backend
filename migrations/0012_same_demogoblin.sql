ALTER TABLE "jobs" ADD COLUMN "is_approve" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN IF EXISTS "is_approved";