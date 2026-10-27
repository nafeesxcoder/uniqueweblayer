/**
 * Startup file for cPanel "Setup Node.js App" (Phusion Passenger).
 *
 * Passenger does not run `next start` — it loads this file and expects the app
 * to listen on the port it provides in process.env.PORT. This boots Next.js in
 * production mode and hands every request to it.
 *
 * Nothing here is used on Vercel or in local development (`npm run dev`).
 */
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOST || "0.0.0.0";

const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      handle(req, res);
    }).listen(port, hostname, () => {
      console.log(`Unique Web Layer running on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start Next.js:", err);
    process.exit(1);
  });
