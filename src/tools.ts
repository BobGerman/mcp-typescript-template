import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ToolDefinition } from "./tools/toolDefinition.ts";

// Tools to register:
import tool from "./tools/echo.ts";

const tools: ToolDefinition[] = [
  tool,
];

// Register all tools with the MCP server. This function is called during server initialization.
export function registerTools(server: McpServer): void {
  for (const tool of tools) {
    registerTool(server, tool);
  }
}

// Register a single tool with the MCP server.
function registerTool(server: McpServer, tool: ToolDefinition): void {
  server.registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
      outputSchema: tool.outputSchema,
      annotations: tool.annotations,
    },
    (args, extra) => tool.implementation(server, args, extra),
  );
}
