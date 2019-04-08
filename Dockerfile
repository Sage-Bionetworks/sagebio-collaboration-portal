#
# ---- Base Node ----
FROM node:10.15-stretch as base
# Create app directory
WORKDIR /usr/src/app
# Copy project file
COPY package*.json ./

#
# ---- Dependencies ----
FROM base AS dependencies
# Install app dependencies
#RUN npm set progress=false && npm config set depth 0
RUN npm set progress=false
RUN npm ci --only=production
# Copy production node_modules aside
RUN mkdir -p /dist && cp -R node_modules /dist/.
RUN cp -R node_modules /dist/node_modules
# Install ALL node_modules, including 'devDependencies'
RUN npm install

#
# ---- Test ----
FROM dependencies AS test
COPY . .
# RUN  npm run test  # requires an instance of MongoDB

#
# ---- Build ----
FROM test AS build
RUN npm run build

#
# ---- Release ----
FROM base AS release
# Copy production node_modules
COPY --from=dependencies /dist/node_modules ./node_modules
# Copy app sources
COPY --from=build /usr/src/app/dist/ .

CMD [ "npm", "start" ]
