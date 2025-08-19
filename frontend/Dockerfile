# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* /app/
RUN npm ci || npm install
COPY . /app
RUN npm run build

# Serve stage
FROM node:20-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist /app/dist
EXPOSE 5173 3000
CMD ["serve", "-s", "dist", "-l", "3000"]


