CREATE TABLE IF NOT EXISTS "tokens" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"symbol" varchar(256) NOT NULL,
	"image_url" varchar(256) NOT NULL,
	"description" varchar(256) NOT NULL,
	"decimal" integer NOT NULL,
	"listing" boolean NOT NULL,
	"address" varchar(256) NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
