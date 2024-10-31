# Web App Description

My web app is designed to empower students in their pursuit of scholarships by providing easy access to tailored opportunities. The platform simplifies the search process, allowing users to find scholarships that suit their individual needs.

## Architecture and Technology

The codebase follows clean architecture principles, ensuring maintainability and scalability. I utilize SQLite as the database, connected through Drizzle ORM for efficient data management. The client-side of the app is server-rendered to enhance SEO, while the admin pages are client-side, focusing on functionality without SEO concerns.

## SEO Enhancements

To further improve visibility, I have implemented metadata and a sitemap. OpenGraph data is also included, enabling rich link previews when users share scholarships and articles on social media platforms.

## Admin and Moderator Functionality

Moderators and administrators can create, edit, and delete scholarships and articles. Access to admin pages is protected by middleware, ensuring secure management. User authentication is role-based: while moderators can manage content, they do not have the authority to invite or dismiss other moderators. Password recovery is streamlined; users receive a reset link via email instead of being able to reset passwords directly.

## User Features

Students can easily access recent and high-tuition scholarships, with filtering options available by country and degree. Additionally, users can read informative articles and watch guiding videos to aid their scholarship search.

## Future Enhancements

Looking ahead, I plan to introduce a feature that sends personalized scholarship recommendations based on user preferences and subscriptions, further enhancing the user experience.
