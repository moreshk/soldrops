CREATE TABLE IF NOT EXISTS "widgets_tx" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"tx" text NOT NULL,
	"swap_details" text NOT NULL,
	"widget_id" varchar NOT NULL,
	"send_token_id" varchar NOT NULL,
	"receive_token_id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "widgets_tx" ADD CONSTRAINT "widgets_tx_widget_id_widgets_id_fk" FOREIGN KEY ("widget_id") REFERENCES "public"."widgets"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "widgets_tx" ADD CONSTRAINT "widgets_tx_send_token_id_tokens_id_fk" FOREIGN KEY ("send_token_id") REFERENCES "public"."tokens"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "widgets_tx" ADD CONSTRAINT "widgets_tx_receive_token_id_tokens_id_fk" FOREIGN KEY ("receive_token_id") REFERENCES "public"."tokens"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "widgets_tx" ADD CONSTRAINT "widgets_tx_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
