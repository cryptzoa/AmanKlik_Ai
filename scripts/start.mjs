// Railway assigns HOSTNAME to the container ID. Next.js standalone then binds
// only to that hostname, which makes Railway's healthcheck unable to connect.
// Override it immediately before loading the generated standalone server.
process.env.HOSTNAME = "0.0.0.0";

await import("../.next/standalone/server.js");
