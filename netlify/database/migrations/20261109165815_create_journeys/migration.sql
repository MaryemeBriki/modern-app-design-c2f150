CREATE TABLE "journeys" (
	"id" serial PRIMARY KEY,
	"conception_id" text NOT NULL,
	"pseudo" text DEFAULT 'Anonyme' NOT NULL,
	"agreement_before" integer NOT NULL,
	"agreement_after" integer NOT NULL,
	"confidence_before" integer NOT NULL,
	"confidence_after" integer NOT NULL,
	"representation_before" text NOT NULL,
	"reformulation" text NOT NULL,
	"concepts_used" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
