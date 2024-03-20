# lemmy-ui-next
Alternative frontend for Lemmy. Built with NextJS.

![image](https://github.com/sunaurus/lemmy-ui-next/assets/5356547/c3feba40-3da1-4c38-aad8-83ca691ebca7)


## Goals

* Drop-in replacement for lemmy-ui
* Minimalistic design, following in the footsteps of other timeless link aggregator UIs
* Fast!
* Super basic NextJS architecture, taking advantage of features like the app router & server actions

## Motivation

The original lemmy-ui has been extremely important for the growth of Lemmy, and the new lemmy-ui-leptos also looks quite interesting. One issue with both of these is that they are built using quite obscure technologies (Inferno and Leptos). This project was created as an alternative for contributors who are already familiar with NextJs and want to use those skills on Lemmy. The beauty of open source is that anybody can build what they want, and all these alternative projects can happily coexist! 

## Current status

The project is in its initial setup phase and not open to PRs yet. PRs will be welcome once the basic structure is in place and there is at least one staging environment running the code.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
