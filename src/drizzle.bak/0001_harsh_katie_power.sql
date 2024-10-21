CREATE TABLE `scholarship_degrees` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`degree` text NOT NULL,
	`scholarship_id` text NOT NULL,
	FOREIGN KEY (`scholarship_id`) REFERENCES `scholarships`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `country` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `scholarship_hosts` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`country` text NOT NULL,
	`continent` text NOT NULL,
	`scholarship_id` text NOT NULL,
	FOREIGN KEY (`scholarship_id`) REFERENCES `scholarships`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `scholarships` DROP COLUMN `countries`;--> statement-breakpoint
ALTER TABLE `scholarships` DROP COLUMN `degrees`;