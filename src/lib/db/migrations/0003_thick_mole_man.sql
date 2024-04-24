CREATE TABLE IF NOT EXISTS "campaign" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"token_contract_address" varchar(256) NOT NULL,
	"token_symbol" varchar(256) NOT NULL,
	"token_image" varchar(256) NOT NULL,
	"token_decimal" integer NOT NULL,
	"total_token_drop" integer NOT NULL,
	"total_wallet_number" integer NOT NULL,
	"twitter_handel" varchar(256),
	"announcement_tweet" varchar(256),
	"go_live_data" timestamp NOT NULL,
	"visibility_status" boolean DEFAULT false NOT NULL,
	"is_campaign_ended" boolean DEFAULT false NOT NULL,
	"can_campaign_update" boolean DEFAULT true NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign" ADD CONSTRAINT "campaign_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
