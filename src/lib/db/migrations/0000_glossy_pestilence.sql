CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"user_name" text,
	"isAdmin" boolean DEFAULT false,
	"user_type" text DEFAULT 'user',
	"default_url" text DEFAULT '/dashboard',
	"wallet_address" text NOT NULL,
	"private_key" text NOT NULL,
	CONSTRAINT "user_wallet_address_unique" UNIQUE("wallet_address"),
	CONSTRAINT "user_private_key_unique" UNIQUE("private_key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
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
	"start_data" timestamp NOT NULL,
	"end_Date" timestamp NOT NULL,
	"visibility_status" boolean DEFAULT true NOT NULL,
	"is_campaign_ended" boolean DEFAULT false NOT NULL,
	"transaction_hash" varchar(256),
	"can_campaign_update" boolean DEFAULT true NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tokens" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"symbol" varchar(256) NOT NULL,
	"image_url" varchar(256) NOT NULL,
	"description" text NOT NULL,
	"decimal" integer NOT NULL,
	"listing" boolean DEFAULT false NOT NULL,
	"address" varchar(256) NOT NULL,
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
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
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "campaign" ADD CONSTRAINT "campaign_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "whitelist" ADD CONSTRAINT "whitelist_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "whitelist" ADD CONSTRAINT "whitelist_campaign_id_campaign_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaign"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
