# PHC Collaboration Portal

Primary Health Care (PHC) Collaboration Portal by Sage Bionetworks for Roche/Genentech

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x

### Developing

1. Run `npm install` to install server dependencies.

2. Run `docker run -p 27017:27017 --name afs-mongo -d mongo` to start the MongoDB service.

3. Run `npm run start:server` and `npm run start:client` to start the dev server.

## Build & development


## Testing

Karma uses ChromeHeadless to test the client. The dependencies required to run Chrome are listed [here](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch).

At this time, the following dependencies are required to run Chrome:

```
sudo apt-get install -y  gconf-service libasound2 libatk1.0-0 \
  libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 \
  libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 \
  libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
  libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 \
  libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
  ca-certificates fonts-liberation libappindicator1 libnss3 \
  lsb-release xdg-utils wget
```

Running `npm test` will run the unit tests with karma.

## Production

```
npm run build
NODE_ENV=production node dist/server/
```
