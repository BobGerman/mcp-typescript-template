import { z } from "zod";
import type { ToolDefinition } from "./toolDefinition.ts";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { logger } from "../logger.ts";
import { createTextResult } from "../lib/utils.ts";

const TOOL_NAME = "echo";

// Define the Echo tool
const tool: ToolDefinition = {
    name: TOOL_NAME,
    title: "Echo",
    description: "Echo back the provided message",
    inputSchema: z.object({
        message: z.string().describe("The message to echo back"),
    }),
    outputSchema: z.object({
        echo: z.string().describe("The echoed message"),
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
            data: { message: args.message },
            logger: "echo",
        });
    } catch (error) {
        // Log notification failures must not prevent the tool from responding.
        logger.debug(
            { error: error instanceof Error ? error.message : String(error) },
            "Failed to send MCP log notification",
        );
    }

    const data = { echo: args.message };
    logger.info({ data, sessionId: extra.sessionId, requestId: extra.requestId },
        `${TOOL_NAME}Tool executed`);
    return createTextResult(data);
}

export default tool;
