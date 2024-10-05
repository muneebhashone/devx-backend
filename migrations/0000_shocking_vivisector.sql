DO $$ BEGIN
 CREATE TYPE "public"."NOTIFICATION_TYPE" AS ENUM('LIKE', 'COMMENT', 'BOOKMARK', 'FOLLOW', 'MESSAGE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."POST_SHARE_TYPE" AS ENUM('group', 'user', 'all');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"post_id" integer,
	"created_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "bookmarks_user_id_post_id_unique" UNIQUE("user_id","post_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"post_id" integer,
	"content" varchar NOT NULL,
	"media" json,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "event_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"user_id" integer,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer,
	"title" varchar NOT NULL,
	"description" varchar,
	"location" varchar,
	"start_at" date NOT NULL,
	"end_at" date NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "follows" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"following_id" integer,
	"created_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "follows_user_id_following_id_unique" UNIQUE("user_id","following_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer,
	"user_id" integer,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"group_id" integer,
	"post_id" integer,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"is_public" boolean DEFAULT false,
	"cover" varchar,
	"avatar" varchar,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"post_id" integer,
	"comment_id" integer,
	"created_at" date DEFAULT now() NOT NULL,
	CONSTRAINT "likes_user_id_post_id_comment_id_unique" UNIQUE("user_id","post_id","comment_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"type" "NOTIFICATION_TYPE" NOT NULL,
	"data" json,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post_shares" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer,
	"shared_to_type" "POST_SHARE_TYPE",
	"shared_by_id" integer,
	"shared_to_group_id" integer,
	"shared_to_user_id" integer,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"title" varchar NOT NULL,
	"content" varchar NOT NULL,
	"media" json,
	"like_count" integer DEFAULT 0,
	"group_id" integer,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reels" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"video" varchar NOT NULL,
	"caption" varchar,
	"created_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "replies" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"parent_comment_id" integer,
	"content" varchar NOT NULL,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_feed" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"posts" json,
	"created_at" date DEFAULT now() NOT NULL,
	"updated_at" date DEFAULT now(),
	"expires_at" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar,
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
 ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_members" ADD CONSTRAINT "event_members_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "event_members" ADD CONSTRAINT "event_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows" ADD CONSTRAINT "follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows" ADD CONSTRAINT "follows_following_id_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_posts" ADD CONSTRAINT "group_posts_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "group_posts" ADD CONSTRAINT "group_posts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_shares" ADD CONSTRAINT "post_shares_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_shares" ADD CONSTRAINT "post_shares_shared_by_id_users_id_fk" FOREIGN KEY ("shared_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_shares" ADD CONSTRAINT "post_shares_shared_to_group_id_groups_id_fk" FOREIGN KEY ("shared_to_group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_shares" ADD CONSTRAINT "post_shares_shared_to_user_id_users_id_fk" FOREIGN KEY ("shared_to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reels" ADD CONSTRAINT "reels_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replies" ADD CONSTRAINT "replies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "replies" ADD CONSTRAINT "replies_parent_comment_id_comments_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_feed" ADD CONSTRAINT "user_feed_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
