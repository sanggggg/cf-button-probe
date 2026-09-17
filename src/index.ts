import { getSandbox, Sandbox as BaseSandbox } from "@cloudflare/sandbox";

interface Env {
  Sandbox: DurableObjectNamespace<Sandbox>;
  PROBE_KV: KVNamespace;
  AI: Ai;
  PROBE_MODE: string;
  PROBE_SECRET?: string;
  PROBE_REGISTRY_KEY?: string;
}

export class Sandbox extends BaseSandbox {}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/container") {
      try {
        const sandbox = getSandbox(env.Sandbox, "probe");
        const result = await sandbox.exec("echo container-up && rg --version | head -1");
        return Response.json({ container: "up", stdout: result.stdout, exitCode: result.exitCode });
      } catch (error) {
        return Response.json(
          { container: "failed", error: error instanceof Error ? error.message : String(error) },
          { status: 500 },
        );
      }
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

    return new Response("cf-button-probe (sandbox image). Try /api/health and /api/container.", {
      headers: { "content-type": "text/plain" },
    });
  },

  async scheduled(): Promise<void> {},
};
