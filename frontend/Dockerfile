# Build stage
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# Serve stage
FROM nginx:alpine

# Copy custom Nginx configuration to route React correctly and proxy API
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy React build files to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
