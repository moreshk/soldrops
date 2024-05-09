ALTER TABLE "tokens" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tokens" ALTER COLUMN "listing" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "tokens" ALTER COLUMN "user_id" SET DATA TYPE varchar;