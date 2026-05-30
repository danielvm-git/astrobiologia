import { Client } from "node-appwrite";

// Patch Client to prevent Undici agent validation crash under Node 24 LTS.
const originalPrepare = (Client.prototype as any).prepareRequest;
(Client.prototype as any).prepareRequest = function (
  method: string,
  url: URL,
  headers: Record<string, string> = {},
  params: Record<string, unknown> = {}
) {
  const result = originalPrepare.call(this, method, url, headers, params);
  if (result?.options) {
    delete result.options.agent;
    delete result.options.dispatcher;
  }
  return result;
};
