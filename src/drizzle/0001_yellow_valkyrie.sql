CREATE TABLE `scholarships` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`cover_image` text,
	`university` text,
	`tution` integer,
	`currency` text,
	`openTime` integer,
	`deadline` integer,
	`about` text NOT NULL,
	`eligibility` text,
	`documents` text,
	`benefits` text,
	`how_apply` text,
	`aaply_link` text,
	`other_fields` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`link` text NOT NULL,
	`scholarship_id` text,
	`tag` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`scholarship_id`) REFERENCES `scholarships`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `scholarships_name_unique` ON `scholarships` (`name`);