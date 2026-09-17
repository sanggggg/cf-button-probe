import { Container, getContainer } from "@cloudflare/containers";

interface Env {
  PROBE: DurableObjectNamespace<Probe>;
  PROBE_KV: KVNamespace;
  AI: Ai;
  PROBE_MODE: string;
  PROBE_SECRET?: string;
  PROBE_REGISTRY_KEY?: string;
}

export class Probe extends Container {
  defaultPort = 8080;
  sleepAfter = "2m";
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Did the image build, push and start? This is the probe's verdict line.
    if (url.pathname === "/api/container") {
      if (env.PROBE_MODE !== "container") {
        return Response.json({ container: "absent", mode: env.PROBE_MODE }, { status: 501 });
      }
      try {
        return await getContainer(env.PROBE).fetch(request);
      } catch (error) {
        return Response.json(
          { container: "failed", error: error instanceof Error ? error.message : String(error) },
          { status: 500 },
        );
      }
    }

    // Did the other bindings survive the deploy, and did the setup page's
    // secret prompts actually land as secrets?
    if (url.pathname === "/api/health") {
      return Response.json({
        mode: env.PROBE_MODE,
        kvBound: Boolean(env.PROBE_KV),
        aiBound: Boolean(env.AI),
        secretArrived: Boolean(env.PROBE_SECRET),
        registryKeyArrived: Boolean(env.PROBE_REGISTRY_KEY),
      });
    }

    return new Response("cf-button-probe. Try /api/health and /api/container.", {
      headers: { "content-type": "text/plain" },
    });
  },

  // Present only to check that a button deploy carries cron triggers over.
  async scheduled(): Promise<void> {},
};
