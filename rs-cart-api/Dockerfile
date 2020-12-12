FROM node:12-alpine
# Create application directory inside the image
WORKDIR /usr/src/app
# Copy package related json files from the current directory to the image
COPY package*.json ./
# Install node_modules
RUN npm i && npm cache clean --force
# Copy the rest of the files
COPY . .
# Build dist folder
RUN npm run build
# Env variables
ENV PORT=3535
# Port binding
EXPOSE 3535
 # App run command sequence
 CMD [ "npm", "run", "start:prod" ]
