# cf-button-probe

A throwaway probe answering one question: **does a "Deploy to Cloudflare" button
build and push a container image from a `Dockerfile` in the repo?**

Three branches, three buttons, one repo — which also tests whether a single
repository can expose several buttons that deploy different configurations.

| Branch | What it deploys | Question it answers |
| --- | --- | --- |
| `main` | Worker + a tiny alpine container | Does the button build a Dockerfile image at all? |
| `sandbox` | Worker + `cloudflare/sandbox:next` (large, `apt-get` in the build) | Does a real, heavy image survive the build limits? |
| `free` | Worker with no container | Does the same repo deploy on a free-plan account? |

Every branch also carries a KV binding with a **placeholder id**, a Workers AI
binding, a cron trigger, static assets, and two secrets declared in
`.dev.vars.example` — so one deploy shows whether resources are provisioned,
ids rewritten, and secrets collected.

## Verdict endpoints

- `/api/health` — which bindings arrived, and whether the setup page's secrets landed
- `/api/container` — the container's own reply, or the error that stopped it

Delete this repository once the answer is recorded.
