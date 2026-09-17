# The image cloud-tag actually ships: large, and its build needs network for apt.
# `main` proves a button can build *an* image; this branch proves it can build
# *this* one, inside whatever time and size limits Workers Builds enforces.
FROM docker.io/cloudflare/sandbox:next

RUN apt-get update \
  && apt-get install -y --no-install-recommends ripgrep \
  && rm -rf /var/lib/apt/lists/*

# Never override ENTRYPOINT — it runs the SDK's in-container control server.
