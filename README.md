# Nikodex V2 (front-end)
This repository hold the front-end components for the Nikodex. This project uses Svelte with TailwindCSS.

## Dependecies
To setup Nikodex V2 (front-end), you will need:
 - NodeJS (>=24)

## Setting Up
This project connects to the back-end API on https://github.com/Niko-Dex/nikodex2-backend/ along with the Discord's bot for handling submit data at https://github.com/Niko-Dex/nikodex2-bot/, so you want to also clone both the repos and configure the API server.
After that, create a .env file at the root of the project with the following data:
```
# setup with the backend

API_SERVER_URL="<url_of_api_server>" # the backend API server address. in many cases, you shouldn't have to expose the back-end API server, so you can use "http://localhost:8000" or whichever address fastapi give you or you bind using gunicorn
JWT_SECRET="" # the same JWT secret that you setup in the API server
ORIGIN="" # you may need to specify the address that Vite provide here if you are not able to access this page. otherwise, leave this BLANK

# setup with the Discord's bot (for client ID and client secret, take a look at README for nikodex2-bot repo)

WEBHOOK_URL="" # this is for the "Submit a Niko" page. this page uses Discord Webhook to receive data. you may need to create a new server, or make a new channel in your existing server to create a new webhook
PUBLIC_BOT_SERVER_URL="" # the API server for the Discord bot
DISCORD_BOT_CLIENT_ID="" # client ID for the app that the bot is in
DISCORD_BOT_CLIENT_SECRET="" # client secret for the app that the bot is in
```

## Developing
To start developing for the Nikodex front-end, install dependencies with `npm install` (or `pnpm install` or `yarn`), then start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building & running production build

To create a production version of Nikodex:

```sh
npm run build
```

You can preview the production build with `npm run preview`.
To run the production build of Nikodex, run
```sh
node --env-file=.env build
```

<small>rainwater is cute kbity</small>
