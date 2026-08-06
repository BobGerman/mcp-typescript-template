import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logger } from "../logger.ts";

const TEXT = `
Boston CodeCamp is a community-driven event that brings together
developers, designers, and tech enthusiasts to share knowledge,
learn new skills, and network with like-minded individuals.
The event features a variety of presentations on topics ranging
from AI and machine learning to web development and programming languages.
The sessions are typically led by industry experts and experienced
professionals who provide insights into the latest trends, best practices,
and emerging technologies. 

Please join us for the 41st Boston Code Camp on Saturday, November 21,
2026 at the Microsoft Technology Center in Burlington, MA. 
The event is free to attend and open to all members of the community.

For more information and registration, please visit the official
web site at https://www.bostoncodecamp.com/.
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