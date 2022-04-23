# using multistage build, as we need dev deps to build the TS source code
FROM node:16 AS builder

# copy all files, install all dependencies (including dev deps) and build the project
COPY . ./
RUN npm install \
    && npm run build

# First, specify the base Docker image. You can read more about
# the available images at https://sdk.apify.com/docs/guides/docker-images
# You can also use any other image from Docker Hub.
FROM apify/actor-node-puppeteer-chrome:16

# Second, copy just package.json and package-lock.json since it should be
# the only file that affects "npm install" in the next step, to speed up the build
COPY --from=builder /package*.json ./
COPY --from=builder /README.md ./
COPY --from=builder /dist ./dist

# Install NPM packages, skip optional and development dependencies to
# keep the image small. Avoid logging too much and print the dependency
# tree for debugging
RUN npm --quiet set progress=false \
 && npm install --only=prod --no-optional \
 && echo "Installed NPM packages:" \
 && (npm list --only=prod --no-optional --all || true) \
 && echo "Node.js version:" \
 && node --version \
 && echo "NPM version:" \
 && npm --version

# run compiled code
CMD npm run start:prod
