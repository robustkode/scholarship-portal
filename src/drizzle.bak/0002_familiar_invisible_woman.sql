CREATE TABLE `blog_tags` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`blog_id` text NOT NULL,
	`tag` text NOT NULL,
	FOREIGN KEY (`blog_id`) REFERENCES `blogs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `popular_countries` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`rank` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `scholarship_tags` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`scholarship_id` text NOT NULL,
	`tag` text NOT NULL,
	FOREIGN KEY (`scholarship_id`) REFERENCES `scholarships`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Videos` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`link` text NOT NULL,
	`scholarship_id` text NOT NULL,
	`tag` text NOT NULL,
	FOREIGN KEY (`scholarship_id`) REFERENCES `scholarships`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `popular_countries_rank_unique` ON `popular_countries` (`rank`);