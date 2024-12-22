CREATE TABLE IF NOT EXISTS "jobTimer" (
	"id" serial PRIMARY KEY NOT NULL,
	"duration_in_minutes" integer NOT NULL,
	"end_time" timestamp with time zone,
	"status" varchar(256),
	"job_id" integer,
	CONSTRAINT "jobTimer_job_id_unique" UNIQUE("job_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobTimer" ADD CONSTRAINT "jobTimer_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
