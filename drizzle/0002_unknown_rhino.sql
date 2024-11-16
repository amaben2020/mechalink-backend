ALTER TABLE "mechanics" ALTER COLUMN "jobCount" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "mechanics" ADD CONSTRAINT "mechanics_user_id_unique" UNIQUE("user_id");