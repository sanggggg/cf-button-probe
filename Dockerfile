# Deliberately tiny: this branch isolates the MECHANISM (does a button deploy build
# and push an image at all?) from image size and build time. The `sandbox` branch
# carries the real, large image instead.
FROM node:22-alpine
WORKDIR /app
COPY container/server.js ./server.js
EXPOSE 8080
CMD ["node", "server.js"]
