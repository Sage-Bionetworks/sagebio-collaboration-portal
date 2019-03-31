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

Running `npm test` will run the unit tests with karma.

## Production

```
npm run build
NODE_ENV=production node dist/server/
```
