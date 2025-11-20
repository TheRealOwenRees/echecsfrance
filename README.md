<h1 style="text-align: center">Echecs France</h1>

[![fr](https://img.shields.io/badge/lang-fr-blue.svg?style=for-the-badge)](https://github.com/TheRealOwenRees/echecsfrance/blob/main/README-fr.md)

![GitHub](https://img.shields.io/github/license/therealowenrees/echecsfrance?style=for-the-badge)
![Vercel](https://vercelbadge.vercel.app/api/therealowenrees/echecsfrance?style=for-the-badge)

## A website displaying upcoming chess tournaments for the [FFE](http://www.echecs.asso.fr/) on a map

## Tech Stack

This website is built in TypeScript using:

- [Next.js](https://nextjs.org/)
- [Tailwind](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)

and is deployed on [Vercel](https://vercel.com/)

## Dependencies

- [Leaflet](https://leafletjs.com/) - a Javascript library for interactive maps
- [Nodemailer](https://nodemailer.com/) - a module for Node.js applications to allow easy as cake email sending

## Required VSCode plugins

- ESLint
- Prettier - Code formatter

## Recommended VSCode plugins

- Tailwind CSS IntelliSense
- Tailwind Docs
- Code Spell Checker (to avoid English spelling mistakes in the code)
- Console Ninja (for easier debugging)

## User authentication

Users may choose to create an account in order to receive notification of tournaments.

The only personal information that we have to have is their email address, and so we've decided to use magic link's for user log on.
This gives us only the information we need (the confirmed email address) and means that we don't have to store any other sensitive information at all (not even a hashed password).
To handle user authentication we're using [authjs](https://authjs.dev).

## Locale handling

The site is localised into French and UK English using [next-intl](https://next-intl-docs.vercel.app).
By default `next-intl` chooses the language to display by using, in priority, the URL prefix, a cookie and the accept-language header.

When sending new tournament emails, we'd prefer to send them in the user's preferred locale. To do this we need to store then information on the user object in the database.
Here's the workflow:

1. When the user tries to connect to the platform, the magic link includes a callback URL that returns the user to the page that they were on.
   That URL is localised, so it'll return the to the same page in the language they were viewing.

2. If this is a new user, `next-auth` creates the user object in the database (without any preferred locale).

3. When rendering the site, the `LocalChecker` component checks to see if we have an authenticated user.
   If we do and they don't yet have a preferred locale, then we update the user to set their preferred locale based on the current locale (as provided by `next-intl`).
   If the user already has a preferred locale, we force a redirect to that locale if it's different from the current one.
   If there isn't an authenticated user, we revert to the default behaviour from `next-intl`

4. Finally, the language changer in the footer will update the user's preferred locale.

## Contributions

Contributions are encouraged. Please open an issue to discuss your ideas.

We use the [GitHub Flow](https://www.gitkraken.com/learn/git/best-practices/git-branch-strategy#github-flow-considerations) branching strategy. Add your code into a feature branch such as `feature/feature-name`.
