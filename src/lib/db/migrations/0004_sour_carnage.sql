ALTER TABLE "campaign" ALTER COLUMN "visibility_status" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "isAdmin" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "user_type" text DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "default_url" text DEFAULT '/dashboard';--> statement-breakpoint
ALTER TABLE "campaign" ADD COLUMN "transaction_hash" varchar;