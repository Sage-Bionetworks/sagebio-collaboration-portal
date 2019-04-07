# PHC Collaboration Portal

Primary Health Care (PHC) Collaboration Portal by Sage Bionetworks for Roche/Genentech

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Node.js and npm](nodejs.org) Node >= 4.x.x, npm >= 2.x.x

### Developing

1. Run `npm install` to install all dependencies.

2. Run `docker run -p 27017:27017 --name afs-mongo -d mongo` to start the MongoDB service.

3. Run `npm run start:server` and `npm run start:client` to start the dev server.

## Testing

Run `npm test` to run the server and client unit tests.

## Building for Production

1. Run `npm install` to install all dependencies.

2. Run `npm run build` to build the app and save the files into `./dist/`.

### Deploying manually

- Run `NODE_ENV=production node dist/server/` to deploy the app (requires an instance of MongoDB to be already running).

### Deploying using `docker-compose`

- Run `docker-compose up -d` to automatically deploy the app and an instance of MongoDB.
