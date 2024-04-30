ALTER TABLE "campaign" ADD COLUMN "start_data" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN "end_Date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "campaign" DROP COLUMN IF EXISTS "go_live_data";