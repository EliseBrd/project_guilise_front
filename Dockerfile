FROM node:20

WORKDIR /app

# Copier package.json et package-lock.json pour installer les deps
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port Vite
EXPOSE 5173

# Lancer le dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
