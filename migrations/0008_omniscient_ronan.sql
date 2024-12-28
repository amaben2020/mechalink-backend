ALTER TABLE "mechanics" ADD COLUMN "has_accepted_terms" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "mechanics" ADD COLUMN "has_accepted_terms_at" timestamp DEFAULT now();