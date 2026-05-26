# 1. Gunakan Node.js image resmi
FROM node:18-alpine
WORKDIR /app

# 2. Salin package management file
COPY package*.json ./

# 3. Install semua dependencies proyek Anda
RUN npm install

# 4. Salin seluruh source code proyek Next.js ke container
COPY . .

# 5. Jalankan proses kompilasi produksi Next.js (next build)
RUN npm run build

# 6. Jalankan aplikasi Next.js saat container dinyalakan
CMD ["npm", "run", "start"]
