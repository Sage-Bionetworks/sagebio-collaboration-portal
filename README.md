# PHC Collaboration Portal


 CI | Branch  | Build Status
 ---|---------|-------------
Travis | develop | [![Build Status develop branch](https://travis-ci.com/Sage-Bionetworks/PHCCollaborationPortal.svg?token=yP6gcHRqAyiNe3nCgxVR&branch=develop)](https://travis-ci.com/Sage-Bionetworks/PHCCollaborationPortal)
Travis | master  | [![Build Status master branch](https://travis-ci.com/Sage-Bionetworks/PHCCollaborationPortal.svg?token=yP6gcHRqAyiNe3nCgxVR&branch=develop)](https://travis-ci.com/Sage-Bionetworks/PHCCollaborationPortal)

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

```
NODE_ENV=production node dist/server/
```

### Environment variables

- `NODE_ENV`: Environment ('development' or 'production')
- `CLIENT_PORT`: Port on which the client is running (e.g. 8080)
- `DOMAIN`: For example `https://dev.phc.sagesandbox.org`
export MONGODB_URI=mongodb://localhost:27017/phccp-dev
- `MONGODB_USER`: mongo user or ''
- `MONGODB_PASS`: mongo pass or ''

- `SAML_ENTRY_POINT`: Entry point for SAML SSO
- `SAML_ISSUER`: Issuer ID for SAML SSO
- `SAML_PATH`: Callback path (e.g. `/auth/saml-demo/callback`)

- `PHCCP_SHINY_TOOL_EXAMPLE_URL`=http://dev.phc.sagesandbox.org:8082

Legacy:

- `GOOGLE_ID`: ID for Google OAuth 2.0 authentication
- `GOOGLE_SECRET`: secret for Google OAuth 2.0 authentication

### Deploying using Docker

- Run `docker-compose up --build` to deploy the stack.
