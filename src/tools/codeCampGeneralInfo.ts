import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logger } from "../logger.ts";
import { createTextResult } from "../lib/utils.ts";

const TOOL_NAME = "bostonCodeCampGeneralInfo";
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

    server.registerTool(
        "bostonCodeCampGeneralInfo",
        {
            title: "Boston CodeCamp General Information",
            description: "Retrieve an overview of the conference, website location, date, and location.",
            inputSchema: {},
            outputSchema: {
                info: z.string().describe("General Information about Boston Code Camp"),
            },
            annotations: {
                readOnlyHint: true,
                idempotentHint: true,
                openWorldHint: false,
            },
        },
        (args, extra) => runTool(server, args, extra),
    );
}

// Code to run when the tool is executed
async function runTool(server: McpServer, args: any, extra: { sessionId?: string; requestId: unknown }): Promise<any> {

    logger.info(`Called General Information tool`);
    return createTextResult({ info: TEXT });
}
