CREATE TABLE "short_links" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "short_links_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"code" varchar(32) NOT NULL,
	"destination_url" text NOT NULL,
	"owner_user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "short_links_code_unique" ON "short_links" USING btree ("code");--> statement-breakpoint
CREATE INDEX "short_links_owner_user_id_idx" ON "short_links" USING btree ("owner_user_id");