import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const TOOLS: Tool[] = [
  {
    name: 'search_icons',
    description:
      'Search for icons on The Noun Project by keyword. Returns a paginated list of icons with metadata, thumbnails, and attribution info. Supports filtering by visual style (solid/line), line weight, and public domain status. Use this as the primary way to find icons for UI design, presentations, or documentation.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term for icons (e.g., "dog", "house", "bicycle")',
        },
        styles: {
          type: 'string',
          enum: ['solid', 'line', 'solid,line'],
          description:
            'Filter by icon style: solid (filled), line (outline), or both',
        },
        line_weight: {
          type: ['number', 'string'],
          description:
            'For line icons, filter by line weight (1-60) or range (e.g., "18-20")',
        },
        limit_to_public_domain: {
          type: 'number',
          enum: [0, 1],
          description: 'Set to 1 to limit results to public domain icons only (free to use without attribution)',
        },
        thumbnail_size: {
          type: 'number',
          enum: [42, 84, 200],
          description: 'Thumbnail size to return (42, 84, or 200 pixels)',
        },
        include_svg: {
          type: 'number',
          enum: [0, 1],
          description: 'Set to 1 to include SVG URLs in the response',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return (default varies by API)',
        },
        next_page: {
          type: 'string',
          description: 'Pagination token for the next page of results',
        },
        prev_page: {
          type: 'string',
          description: 'Pagination token for the previous page of results',
        },
      },
      required: ['query'],
    },
    annotations: {
      title: 'Search Icons',
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'get_icon',
    description:
      'Get detailed information about a specific icon by its numeric ID. Returns full metadata including creator info, tags, license, and download URLs. Use this after search_icons to get complete details about a specific result.',
    inputSchema: {
      type: 'object',
      properties: {
        icon_id: {
          type: 'number',
          description: 'The unique numeric ID of the icon',
        },
        thumbnail_size: {
          type: 'number',
          enum: [42, 84, 200],
          description: 'Thumbnail size to return (42, 84, or 200 pixels)',
        },
      },
      required: ['icon_id'],
    },
    annotations: {
      title: 'Get Icon Details',
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'get_collection',
    description:
      'Get a curated collection of icons by its ID. Returns collection metadata and the icons it contains. Collections are themed groups of icons (e.g., "Weather Icons", "Business Icons").',
    inputSchema: {
      type: 'object',
      properties: {
        collection_id: {
          type: 'number',
          description: 'The unique ID of the collection',
        },
        thumbnail_size: {
          type: 'number',
          enum: [42, 84, 200],
          description: 'Thumbnail size to return for icons (42, 84, or 200 pixels)',
        },
        include_svg: {
          type: 'number',
          enum: [0, 1],
          description: 'Set to 1 to include SVG URLs in the response',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of icons to return from the collection',
        },
      },
      required: ['collection_id'],
    },
    annotations: {
      title: 'Get Collection',
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'search_collections',
    description:
      'Search for icon collections on The Noun Project by keyword. Returns paginated results of themed icon groups. Use this to discover curated sets of related icons.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search term for collections (e.g., "winter", "business", "animals")',
        },
        blacklist: {
          type: 'number',
          enum: [0, 1],
          description: 'Set to 1 to remove results matching terms or IDs in blacklist',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
        },
        prev_page: {
          type: 'string',
          description: 'Token for paging to the previous page',
        },
        next_page: {
          type: 'string',
          description: 'Token for paging to the next page',
        },
      },
      required: ['query'],
    },
    annotations: {
      title: 'Search Collections',
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'icon_autocomplete',
    description:
      'Get autocomplete suggestions for icon search terms. Returns a list of popular search terms matching the input. Use this to help discover related keywords before performing a full search.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Partial search term to get suggestions for',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of suggestions to return',
        },
      },
      required: ['query'],
    },
    annotations: {
      title: 'Icon Autocomplete',
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'check_usage',
    description:
      'Check current Noun Project API usage and monthly quota. Returns usage count and remaining requests. Use this to monitor rate limits before making bulk requests.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
    annotations: {
      title: 'Check API Usage',
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
  {
    name: 'get_download_url',
    description:
      'Get a download URL for an icon with custom color and size options. Supports SVG and PNG formats. For PNG, you can specify pixel size (20-1200). For color, use hex values without the # prefix. Note: Free API access is limited to public domain icons only.',
    inputSchema: {
      type: 'object',
      properties: {
        icon_id: {
          type: 'number',
          description: 'The unique ID of the icon to download',
        },
        color: {
          type: 'string',
          description: 'Hexadecimal color value without # (e.g., "FF0000" for red)',
        },
        filetype: {
          type: 'string',
          enum: ['svg', 'png'],
          description: 'File format: svg or png (SVG does not accept size parameter)',
        },
        size: {
          type: 'number',
          description: 'For PNG only, size in pixels (minimum 20, maximum 1200)',
        },
      },
      required: ['icon_id'],
    },
    annotations: {
      title: 'Get Download URL',
      readOnlyHint: true,
      openWorldHint: true,
    },
  },
];
