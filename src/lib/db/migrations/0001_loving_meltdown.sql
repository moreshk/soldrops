ALTER TABLE "user" ALTER COLUMN "isAdmin" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "user_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "default_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password" text;