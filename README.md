# nikodex2-frontend
This repository contain the front-end for the Nikodex. This is what the user will see and interact when the user visit the website.

## Overview
The main part of the frontend for the Nikodex is structured as follows:
 - `/`: the homepage for the Nikodex, containing informations about the site (user space) (visible to everyone) 
   - `/noik`: the Niko list, for showcasing the Nikosonas the community have created. 
   - `/blog`: the Nikodex's blogs, for displaying informations or updates published by the site's Admin. 
 - `/admin`: the homepage for the Admin of the Nikodex, containing the status for the website (admin space) (hidden to normal users, requires authentication) 
   - `/admin/login`: the login page for Admin to authenticate themselves (this is also where unauthenticated users will be redirected to) 
   - `/admin/noik`: the dashboard for the Niko list, where Admins can create, edit, or delete entries. 
   - `/admin/blog`: the dashboard for the Nikodex's blogs, where Admins can create, edit, or delete blog entries.

As listed above, the Nikodex is split into two "spaces": the user space, where everyone can access, and the admin space, where only user with an Admin account can access. Informations on how to create or manage Admin accounts can be found in the README for the `nikodex2-backend`. 

## Dependecies
To setup the frontend for Nikodex v2, you will need:
 - NodeJS (>=24)

## Setup for develoption/production
This project connects to the back-end API on https://github.com/Niko-Dex/nikodex2-backend/ along with the Discord's bot for handling submit data at https://github.com/Niko-Dex/nikodex2-bot/, so you want to also clone both the repos and configure the API server.
After that, create a .env file at the root of the project with the following data:
```
# setup with the backend

API_SERVER_URL="<url_of_api_server>" # the backend API server address. in many cases, you shouldn't have to expose the back-end API server, so you can use "http://localhost:8000" or whichever address fastapi give you or you bind using gunicorn
JWT_SECRET="" # the same JWT secret that you setup in the API server
ORIGIN="" # for local development, you may want to put the address that Vite provide you (for instance: http://localhost:5173). for production, you will need to put in the domain you're using to host the front-end (for instance: https://example.com)

# setup with the Discord's bot (for client ID and client secret, take a look at README for nikodex2-bot repo)

BOT_SERVER_URL="" # the API server for the Discord bot
DISCORD_BOT_CLIENT_ID="" # client ID for the app that the bot is in
DISCORD_BOT_CLIENT_SECRET="" # client secret for the app that the bot is in
```

## Building and running development build
1. Clone the repository and/or pull the latest changes from GitHub. 
```sh
git clone https://github.com/Niko-Dex/nikodex2-frontend
git pull
```

2. Install required dependencies
```sh
npm install
```

3. Start a development server:
```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building and running production build
> Follow the same steps from 1 to 2 in the [Building and running development build](#building-and-running-development-build)

3. Create a production version of the Nikodex's frontend:
```sh
npm run build
```

4. Preview the production build with
```sh
npm run preview
```
or run the production build of Nikodex with
```sh
node --env-file=.env build
```

## License
The frontend component for the Nikodex is licensed under the 3-clause BSD license. This license is applied to all commits made before, during, and after the commit which apply this license.

<small>rainwater is cute kbity</small>
