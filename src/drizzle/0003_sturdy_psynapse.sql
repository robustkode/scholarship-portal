CREATE TABLE `blog_tags` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`blog_id` text NOT NULL,
	`tag` text NOT NULL,
	FOREIGN KEY (`blog_id`) REFERENCES `blogs`(`id`) ON UPDATE no action ON DELETE cascade
);
