import sessions from './codeCampMock/sessions.json' with { type: 'json' }
// import speakers from './codeCampMock/speakers.json';

import { z } from "zod";
import type { ToolDefinition } from "./toolDefinition.ts";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logger } from "../logger.ts";
import { createTextResult } from "../lib/utils.ts";

const TOOL_NAME = "codeCampSessions";

// Define the Sessions tool
const tool: ToolDefinition = {
    name: TOOL_NAME,
    title: "CodeCamp Sessions",
    description: "Retrieve information about CodeCamp sessions",
    inputSchema: z.object({
        searchQuery: z.string().describe("The search query for finding sessions"),
    }),
    outputSchema: z.object({
        sessions: z.string().describe("The list of found sessions"),
    }),
    annotations: {
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: false,
    },
    implementation
}

// Code to run when the tool is executed
async function implementation(server: McpServer, args: any, extra: { sessionId?: string; requestId: unknown }): Promise<any> {
    try {
        await server.sendLoggingMessage({
            level: "debug",
            data: { searchQuery: args.searchQuery },
            logger: "codeCampSessions",
        });
    } catch (error) {
        // Log notification failures must not prevent the tool from responding.
        logger.debug(
            { error: error instanceof Error ? error.message : String(error) },
            "Failed to send MCP log notification",
        );
    }

    const searchQuery = args.searchQuery.toLowerCase();
    const data = sessions
        .filter((session) =>
            session.speaker.toLowerCase()
                .includes(searchQuery) ||
            session.title.toLowerCase()
                .includes(searchQuery) ||
            session.abstract.toLowerCase()
                .includes(searchQuery) ||
            session.room.toLowerCase()
                .includes(searchQuery)
        );
    logger.info({ data, sessionId: extra.sessionId, requestId: extra.requestId },
        `${TOOL_NAME} Tool executed query ${args.searchQuery} and got ${data.length} results`);
    return createTextResult({ sessions: JSON.stringify(data) });
}

export default tool;
