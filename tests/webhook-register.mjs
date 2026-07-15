// Registers the webhook test resolution hooks (see webhook-test-hooks.mjs). Use with:
//   node --import ./tests/webhook-register.mjs --test tests/webhooks-*.test.mjs
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./webhook-test-hooks.mjs", pathToFileURL(new URL(".", import.meta.url).pathname));
