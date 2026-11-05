FROM node:lts-alpine AS base

COPY --from=ghcr.io/pnpm/pnpm:12-alpine /opt/pnpm /opt/pnpm
RUN for bin in pnpm pn pnpx pnx; do ln -s "/opt/pnpm/$bin" "/usr/local/bin/$bin"; done

## build runner
FROM base AS build-runner

LABEL org.opencontainers.image.source=https://github.com/Lorenzo0111/AssistantBot

# Set temp directory
WORKDIR /tmp/app

# Move package.json
COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .

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
FROM base AS prod-runner

RUN corepack enable

# Set work directory
WORKDIR /app

# Copy package.json from build-runner
COPY --from=build-runner /tmp/app/package.json /app/package.json
COPY --from=build-runner /tmp/app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=build-runner /tmp/app/pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY --from=build-runner /tmp/app/prisma /app/prisma

# Install dependencies
RUN pnpm install --prod --frozen-lockfile

# Move build files
COPY --from=build-runner /tmp/app/build /app/build

# Start bot
EXPOSE 3000
CMD [ "pnpm", "run", "start" ]
