FROM node:18-alpine

WORKDIR /app

# Install Vue CLI globally
RUN npm install -g @vue/cli @vue/cli-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

# Update the command to use vue-cli-service directly
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0"]