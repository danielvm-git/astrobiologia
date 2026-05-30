import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { AdminSessionCookie } from "./e2eAuthBootstrap";

export const ADMIN_AUTH_FILE = path.join(
  process.cwd(),
  "tests/.auth/admin.json"
);

export function writeAdminStorageState(cookie: AdminSessionCookie): void {
  mkdirSync(path.dirname(ADMIN_AUTH_FILE), { recursive: true });
  writeFileSync(
    ADMIN_AUTH_FILE,
    JSON.stringify(
      {
        cookies: [
          {
            name: cookie.name,
            value: cookie.value,
            domain: "localhost",
            path: "/",
            expires: cookie.expires,
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
          },
        ],
        origins: [],
      },
      null,
      2
    )
  );
}
