import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logger } from "../logger.ts";

const TEXT = `
This is a demo mcp server showing how to provide tools and resources
to an LLM application via the Model Context Protocol (MCP). 
The server is implemented in TypeScript and uses the @modelcontextprotocol/sdk library to handle MCP requests.
`;

export default function register(server: McpServer): void {

    const NAME = "backgroundInfo";
    const URI = "info://backgroundInfo";

    server.registerResource(
        NAME, URI,
        {
            title: "Background Information",
            description: "General information about this mcp server",
            mimeType: "text/plain",
        },
        async (uri) => {
            logger.info({ resourceName: NAME, resourceUri: URI },
                "Resource requested");
            return {
                contents: [{
                    uri: uri.href,
                    text: TEXT
                }],
            };
        }
    );
}