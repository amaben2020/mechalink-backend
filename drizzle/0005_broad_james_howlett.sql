DO $$ BEGIN
 ALTER TABLE "jobRequests" ADD CONSTRAINT "jobRequests_mechanic_id_users_id_fk" FOREIGN KEY ("mechanic_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "jobRequests" DROP COLUMN IF EXISTS "lat";--> statement-breakpoint
ALTER TABLE "jobRequests" DROP COLUMN IF EXISTS "lng";