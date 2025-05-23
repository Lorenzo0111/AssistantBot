## build runner
FROM node:lts-alpine AS build-runner

LABEL org.opencontainers.image.source=https://github.com/Lorenzo0111/AssistantBot

RUN corepack enable

# Set temp directory
WORKDIR /tmp/app

# Move package.json
COPY package.json .
COPY pnpm-lock.yaml .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Move source files
COPY src ./src
COPY tsconfig.json   .
COPY prisma ./prisma

# Build project
RUN pnpm prisma generate
RUN pnpm run build

## production runner
FROM node:lts-alpine AS prod-runner

RUN corepack enable

# Set work directory
WORKDIR /app

# Copy package.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json
COPY --from=build-runner /tmp/app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=build-runner /tmp/app/prisma /app/prisma

# Install dependencies
RUN pnpm install --prod --frozen-lockfile

# Move build files
COPY --from=build-runner /tmp/app/build /app/build

# Start bot
CMD [ "pnpm", "run", "start" ]
