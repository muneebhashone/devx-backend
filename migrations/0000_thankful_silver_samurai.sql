DO $$ BEGIN
 CREATE TYPE "public"."ROLE" AS ENUM('SUPER_ADMIN', 'SUB_ADMIN', 'WHITE_LABEL_ADMIN', 'WHITE_LABEL_SUB_ADMIN', 'CLIENT_SUPER_USER', 'CLIENT_USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."USER_STATUS" AS ENUM('REJECTED', 'APPROVED', 'REQUESTED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" varchar,
	"content" text NOT NULL,
	"status" "USER_STATUS" NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"username" varchar NOT NULL,
	"name" varchar,
	"avatar" varchar,
	"github_id" varchar,
	"is_active" boolean DEFAULT false,
	"password" varchar NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
