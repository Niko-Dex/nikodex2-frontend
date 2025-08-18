# Nikodex V2 (front-end)
This repository hold the front-end components for the Nikodex. This project uses Svelte with TailwindCSS.

## Setting Up
This project connects to the back-end API on https://github.com/Niko-Dex/nikodex2-backend/, so you'd want to also clone the repo and configure the API server.
After that, create a .env file with the following data:
```
API_SERVER_URL="<url_of_api_server>" # for instance: https://api.somewhere.com/ or http://localhost:8080/
JWT_SECRET="" # the same JWT secret that you setup in the API server
ORIGIN=""
```

## Developing

To start developing for the Nikodex front-end, install dependencies with `npm install` (or `pnpm install` or `yarn`), then start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of Nikodex:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy Nikodex, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.