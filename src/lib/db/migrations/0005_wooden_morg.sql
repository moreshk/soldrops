ALTER TABLE "user" ADD COLUMN "isAdmin" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "user_type" text DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "default_url" text DEFAULT '/dashboard';--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "isAdmin";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "user_type";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "default_url";