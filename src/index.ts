#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { NounProjectAPI, SearchIconsParams, GetIconParams, GetCollectionParams, SearchCollectionsParams, AutocompleteParams, DownloadIconParams } from './api.js';
import { TOOLS } from './tools.js';

// Validate required environment variables
const API_KEY = process.env.NOUN_PROJECT_API_KEY;
const API_SECRET = process.env.NOUN_PROJECT_API_SECRET;

if (!API_KEY || !API_SECRET) {
  console.error('Error: NOUN_PROJECT_API_KEY and NOUN_PROJECT_API_SECRET must be set');
  process.exit(1);
}

// Initialize API client
const api = new NounProjectAPI(API_KEY, API_SECRET);

// Tool name → API method mapping
const toolHandlers: Record<string, (args: Record<string, unknown>) => Promise<unknown>> = {
  search_icons: (args) => api.searchIcons(args as unknown as SearchIconsParams),
  get_icon: (args) => api.getIcon(args as unknown as GetIconParams),
  get_collection: (args) => api.getCollection(args as unknown as GetCollectionParams),
  search_collections: (args) => api.searchCollections(args as unknown as SearchCollectionsParams),
  icon_autocomplete: (args) => api.autocomplete(args as unknown as AutocompleteParams),
  check_usage: () => api.checkUsage(),
  get_download_url: (args) => api.getDownloadUrl(args as unknown as DownloadIconParams),
};

// Create MCP server
const server = new Server(
  {
    name: 'noun-project-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// Handle tool call requests
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    const handler = toolHandlers[name];

    if (!handler) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const result = await handler(args ?? {});
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: unknown) {
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Extract detailed error info from Noun Project API responses
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      if (axiosError.response?.data) {
        const data = axiosError.response.data;
        const status = axiosError.response.status;
        errorMessage = `HTTP ${status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`;
      }
    }
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr to avoid interfering with stdio communication
  console.error('Noun Project MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
