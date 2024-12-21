ALTER TABLE "jobRequests" DROP CONSTRAINT "jobRequests_mechanic_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "jobRequests" ADD COLUMN "user_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobRequests" ADD CONSTRAINT "jobRequests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
