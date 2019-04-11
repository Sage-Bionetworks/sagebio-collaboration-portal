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

## Production
### Manual Deployment

1. Run `npm install` to install all dependencies.

2. Run `npm run build` to build the app and save the files into `./dist/`.

3. Run an instance of MongoDB.

4. Run the production server with (after updating the env vars):

```
NODE_ENV=production \
    DOMAIN=http://dev.phc.sagesandbox.org \
    GOOGLE_ID=<GOOGLE_ID> \
    GOOGLE_SECRET=<GOOGLE_SECRET> \
    MONGODB_URI=mongodb://mongo:27017/phccp
    node dist/server/`
```

### Deploying using Docker

- Run `docker-compose up --build` to deploy the stack.
