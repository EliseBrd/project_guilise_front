FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build pour production
RUN npm run build

# Exposer Vite dev server (si tu veux le mode dev)
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
