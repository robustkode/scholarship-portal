CREATE TABLE `account_tokens` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`token` text NOT NULL,
	`role` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `account_tokens_email_unique` ON `account_tokens` (`email`);