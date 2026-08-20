# all-rate

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env` and set the project URL and publishable key.
3. Apply `supabase/migrations/0001_initial_schema.sql` in the Supabase SQL editor or with the Supabase CLI.

The application uses Supabase Auth cookies in SvelteKit server hooks. The publishable key is safe for browser use because database access is protected by Row Level Security. Never expose a Supabase service-role key to the browser.

For passwordless email sign-in, set the Supabase Auth email template URL to `/auth/confirm?token_hash={{ .TokenHash }}&type=email` and add your local and production URLs under Auth URL Configuration.

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.17.0 create --template minimal --types ts --add prettier vitest="usages:unit,component" eslint --install npm all-rate
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
