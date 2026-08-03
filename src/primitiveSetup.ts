import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ToolDefinition } from "./primitiveDefinitions.ts";
import type { ResourceDefinition } from "./primitiveDefinitions.ts";
import { logger } from "./logger.ts";

// Primitives to register:
import echoTool from "./tools/echoTool.ts";
import relatedInfoResource from "./resources/relatedInfoResource.ts";

const tools: ToolDefinition[] = [
  echoTool,
];
const resources = [
  relatedInfoResource,
];

// Register all primitives with the MCP server.
// This function is called during server initialization.
export function registerPrimitives(server: McpServer): void {
  for (const tool of tools) {
    registerTool(server, tool);
  }
  for (const resource of resources) {
    registerResource(server, resource);
  }
}

// Register a single resource with the MCP server.
function registerResource(server: McpServer, resource: ResourceDefinition): void {

  server.registerResource(
    resource.name,
    resource.uri,
    {
      title: resource.title,
      description: resource.description,
      mimeType: resource.mimeType || "text/plain",
    },
    async (uri) => {
      logger.info({ resourceName: resource.name, resourceUri: resource.uri },
        "Resource requested");
      return {
        contents: [{ uri: uri.href, text: resource.text }],
      };
    }
  );
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
