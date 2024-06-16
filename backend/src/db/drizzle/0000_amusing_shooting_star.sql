CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50),
	"lastname" varchar(50),
	"password" varchar(50) NOT NULL,
	"mobile" varchar(11) NOT NULL,
	"secret" varchar(20) NOT NULL,
	"hasTwoFactor" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
