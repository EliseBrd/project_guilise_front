FROM node:20

WORKDIR /app

# Copier juste package.json et package-lock.json pour installer les deps
COPY package*.json ./
RUN npm install

COPY . .

# Build pour production
RUN npm run build

# Exposer Vite dev server (si tu veux le mode dev)
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
