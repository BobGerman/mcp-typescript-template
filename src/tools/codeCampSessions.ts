import sessions from './codeCampMockData/sessions.json' with { type: 'json' }
// import speakers from './codeCampMock/speakers.json';

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logger } from "../logger.ts";
import { createTextResult } from "../lib/utils.ts";

const TOOL_NAME = "codeCampSessions";

export default function register(server: McpServer): void {

    server.registerTool(
        "bostonCodeCampSessions",
        {
            title: "Boston CodeCamp Sessions",
            description: "Retrieve information about Boston CodeCamp sessions.",
            inputSchema: {
                searchQuery: z.string().optional().describe("The search query for finding sessions"),
            },
            outputSchema: {
                sessions: z.string().describe("The list of found sessions"),
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

    const searchQuery = args.searchQuery?.toLowerCase();
    let data = [];
    if (searchQuery) {
        data = sessions.filter((session) =>
            session.speaker.toLowerCase()
                .includes(searchQuery) ||
            session.title.toLowerCase()
                .includes(searchQuery) ||
            session.abstract.toLowerCase()
                .includes(searchQuery) ||
            session.room.toLowerCase()
                .includes(searchQuery)
        )
    } else {
        data = sessions;
    };
    logger.info({ data, sessionId: extra.sessionId, requestId: extra.requestId },
        `${TOOL_NAME} Tool executed query ${args.searchQuery} and got ${data.length} results`);
    return createTextResult({ sessions: JSON.stringify(data) });
}
