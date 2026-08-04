import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { createErrorResult, createTextResult } from "../lib/utils.ts";
import { logger } from "../logger.ts";

type SendLoggingMessageFn = (params: {
    level: "debug" | "info" | "notice" | "warning" | "error" | "critical" | "alert" | "emergency";
    data: unknown;
    logger?: string;
}) => Promise<void>;

export default function register(server: McpServer): void {

    server.registerTool(
        "echo",
        {
            title: "Echo",
            description: "Echo back the provided message",
            // Tool *input* is declared with a Zod schema — the SDK compiles it to
            // JSON Schema and validates incoming args for us. (Contrast with the
            // elicitation `requestedSchema` in elicitEcho, which must be hand-written
            // JSON Schema; see the comment there.)
            inputSchema: {
                message: z.string().describe("The message to echo back"),
            },
            outputSchema: {
                echo: z.string().describe("The echoed message"),
            },
            annotations: {
                readOnlyHint: true,
                idempotentHint: true,
                openWorldHint: false,
            },
        },
        (args, extra) => echo(server.sendLoggingMessage.bind(server), args, extra),
    );
}

/**
 * Echoes back the provided message. Also sends a debug log notification
 * to the client as a demonstration of MCP logging.
 */
async function echo(
    sendLoggingMessage: SendLoggingMessageFn,
    args: { message: string },
    extra: { sessionId?: string; requestId: unknown },
): Promise<CallToolResult> {
    const toolName = "echo";
    const { sessionId, requestId } = extra;
    // Example: send an MCP log notification to the client. The client
    // controls which levels it receives via logging/setLevel.
    // See: https://modelcontextprotocol.io/specification/2025-06-18/server/utilities/logging
    try {
        await sendLoggingMessage({
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
    logger.info({ toolName, sessionId, requestId }, "Tool executed");
    return createTextResult(data);
}
