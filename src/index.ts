interface Env {
  PROBE_KV: KVNamespace;
  AI: Ai;
  PROBE_MODE: string;
  PROBE_SECRET?: string;
  PROBE_REGISTRY_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // This branch ships no container on purpose; the endpoint stays so the two
    // deployments answer the same URLs.
    if (url.pathname === "/api/container") {
      return Response.json({ container: "absent", mode: env.PROBE_MODE }, { status: 501 });
    }

    if (url.pathname === "/api/health") {
      return Response.json({
        mode: env.PROBE_MODE,
        kvBound: Boolean(env.PROBE_KV),
        aiBound: Boolean(env.AI),
        secretArrived: Boolean(env.PROBE_SECRET),
        registryKeyArrived: Boolean(env.PROBE_REGISTRY_KEY),
      });
    }

    return new Response("cf-button-probe (free, no container). Try /api/health.", {
      headers: { "content-type": "text/plain" },
    });
  },

  async scheduled(): Promise<void> {},
};
