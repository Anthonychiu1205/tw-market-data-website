import { TWMDClient } from "./client.js";
import { MCPToolError } from "./errors.js";
import { getToolByName, toolDefinitions } from "./tools.js";

export { toolDefinitions };

export async function callTool(name: string, input: Record<string, unknown>) {
  const tool = getToolByName(name);
  if (!tool) {
    throw new MCPToolError("tool_not_found", `Unknown tool: ${name}`);
  }

  const client = new TWMDClient({
    apiKey: process.env.TWMD_API_KEY || "",
    baseUrl: process.env.TWMD_BASE_URL || "https://twmarketdata.com",
  });

  return tool.call(client, input);
}

async function main() {
  const [, , toolName, inputJson] = process.argv;

  if (!toolName || toolName === "--help") {
    process.stdout.write(
      JSON.stringify(
        {
          preview: true,
          message: "TW Market Data MCP skeleton (local/dev).",
          usage: "node dist/index.js <toolName> '<jsonInput>'",
          tools: toolDefinitions.map((tool) => ({
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
          })),
        },
        null,
        2,
      ),
    );
    return;
  }

  let input: Record<string, unknown> = {};
  if (inputJson) {
    try {
      input = JSON.parse(inputJson) as Record<string, unknown>;
    } catch {
      throw new MCPToolError("invalid_input", "inputJson must be valid JSON.");
    }
  }

  const result = await callTool(toolName, input);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error: unknown) => {
    if (error instanceof MCPToolError) {
      process.stderr.write(`${error.code}: ${error.message}\n`);
      process.exit(1);
    }

    process.stderr.write("internal_error: MCP skeleton invocation failed.\n");
    process.exit(1);
  });
}
