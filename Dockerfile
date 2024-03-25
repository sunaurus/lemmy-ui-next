FROM debian:bookworm

RUN apt-get update \
    && apt-get install -y curl \
    && apt-get -y autoclean

SHELL ["/bin/bash", "--login", "-c"]
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

WORKDIR /app

COPY .nvmrc .
RUN nvm install
RUN nvm use

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

EXPOSE 3000
CMD ["/root/.nvm/nvm-exec", "npm", "run", "start"]