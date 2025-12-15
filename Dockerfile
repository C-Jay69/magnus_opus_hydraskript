# Dockerfile for Magnus Opus Hydraskript

# ---- Base ----
FROM node:18-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install --production

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js application
RUN npm run build

# ---- Production ----
FROM base AS runner

ENV NODE_ENV=production

# Copy production-ready files
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
