import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// Data needed to register a tool
export interface ToolDefinition {
    name: string;
    title: string;
    description: string;
    inputSchema: z.ZodSchema;
    outputSchema: z.ZodSchema;
    annotations: any;
    implementation: (
        server: McpServer,
        args: any,
        extra: {
            sessionId?: string;
            requestId: unknown
        }
    ) => Promise<any>;
}

// Data needed to register a resource
export interface ResourceDefinition {
    name: string;
    uri: string;
    title: string;
    description: string;
    mimeType?: string;
    text: string;
}