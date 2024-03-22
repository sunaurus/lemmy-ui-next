# lemmy-ui-next
Alternative frontend for Lemmy. Built with [Next.js](https://nextjs.org/).

Discussions & announcements: [!lemmy_ui_next@lemm.ee](https://lemm.ee/c/lemmy_ui_next)

| Desktop                                                                                                         | Mobile                                                                                                      |
| --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| ![Desktop screenshot](https://github.com/sunaurus/lemmy-ui-next/assets/5356547/4b5a7850-2055-46c5-88e2-ffdc4a383e40) | ![Mobile screenshot](https://github.com/sunaurus/lemmy-ui-next/assets/5356547/179723b7-b97d-4e9c-bc00-4346e3bb4a16) |


## Goals

* Drop-in replacement for lemmy-ui
* Minimalistic design, following in the footsteps of other timeless link aggregator UIs
* Fast!
* Super basic NextJS architecture, taking advantage of features like the app router & server actions

## Motivation

The original [lemmy-ui](https://github.com/LemmyNet/lemmy-ui) has been extremely important for the growth of Lemmy, and the new [lemmy-ui-leptos](https://github.com/LemmyNet/lemmy-ui-leptos) also looks quite interesting. One issue with both of these is that they are built using quite obscure technologies (Inferno and Leptos). 

This project was created as an alternative for contributors who are already familiar with NextJs and want to use those skills on Lemmy. The beauty of open source is that anybody can build what they want, and all these alternative projects can happily coexist! 

## Current status

The project is in its initial setup phase and not open to PRs yet. PRs will be welcome once the basic structure is in place and there is at least one staging environment running the code.

## Running 

**Prerequisites**: You only need nodejs. Check the [.nvmrc](.nvmrc) file in this repo to find out the exact version we are developing against. Optionally, you can use [nvm](https://github.com/nvm-sh/nvm) to automate downloading & setting up the correct nodejs version for you (it automatically checks the .nvmrc file and sets everything up for you).

### Locally

```bash
echo "LEMMY_BACKEND=https://lemm.ee" > .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### In production

```
# Install deps
npm ci
# Build
npm run build
# Start
LEMMY_BACKEND=https://<your-lemmy-api> npm run start
```

At this point, you will have lemmy-ui-next listening on 0.0.0.0:3000, and you can point your nginx or any other reverse proxy at it. You can improve performance at least a little by pointing lemmy-ui-next directly at your Lemmy backend process, for example if running on the same host, `LEMMY_BACKEND=https://localhost:8536

*Sample systemd service file will be coming soon. Alternatively, a sample Dockerfile will also be provided. It's on the to-do list 😅.*


