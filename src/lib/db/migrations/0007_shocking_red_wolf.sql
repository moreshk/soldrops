CREATE TABLE IF NOT EXISTS "whitelist" (
	"id" varchar(256) PRIMARY KEY NOT NULL,
	"follow_twitter" boolean DEFAULT false NOT NULL,
	"retweet_announcement" boolean DEFAULT false NOT NULL,
	"whitelisted" boolean DEFAULT false NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"campaign_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "whitelist" ADD CONSTRAINT "whitelist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "whitelist" ADD CONSTRAINT "whitelist_campaign_id_campaign_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "campaign"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
