import { createServer } from "node:http";

// Prints the one fact the probe exists to establish: this image was built,
// pushed, scheduled, and started.
createServer((_req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({
    container: "up",
    builtFrom: "Dockerfile in the repo",
    node: process.version,
  }));
}).listen(8080, () => console.log("probe container listening on 8080"));
