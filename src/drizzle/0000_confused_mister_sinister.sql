CREATE TABLE `account_tokens` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`token` text NOT NULL,
	`role` text NOT NULL,
	`token_expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `blogs` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`cover_image` text,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set default
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`salt` text NOT NULL,
	`role` integer DEFAULT 1
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_tokens_email_unique` ON `account_tokens` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `blogs_title_unique` ON `blogs` (`title`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);