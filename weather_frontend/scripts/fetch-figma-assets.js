#!/usr/bin/env node
/**
 * PUBLIC_INTERFACE
 * fetch-figma-assets.js
 *
 * Purpose:
 *  - Download SVG and/or PNG assets for specific components/nodes from a Figma file
 *  - Save assets under weather_frontend/assets/
 *
 * Usage:
 *  1) Environment variables:
 *     - FIGMA_API_KEY: Your Figma personal access token (required unless provided via --token)
 *     - FIGMA_FILE_ID: The Figma file ID (optional, can pass via --file)
 *     - FIGMA_NODE_IDS: Comma-separated list of component/node IDs (optional, can pass via --nodes)
 *     - FIGMA_IMAGE_FORMATS: CSV of formats to download (svg,png). Default: svg
 *     - FIGMA_PNG_SCALE: PNG scale factor (1..4). Default: 1
 *     - OUTPUT_DIR: Target directory for downloaded assets. Default: ./assets
 *
 *  2) CLI flags (override env):
 *     node scripts/fetch-figma-assets.js \
 *        --token <FIGMA_API_KEY> \
 *        --file <FILE_ID> \
 *        --nodes <NODE_ID_1,NODE_ID_2,...> \
 *        --formats svg,png \
 *        --scale 2 \
 *        --out ./assets/icons
 *
 *  3) Where do I get these values?
 *     - Figma API Key: In Figma, go to Help > Account Settings > Personal access tokens.
 *     - File ID: Open your Figma file in a browser; URL looks like:
 *         https://www.figma.com/file/<FILE_ID>/<File-Name>
 *     - Node/Component IDs: In Figma, select a component or layer, then:
 *         - Right-click > Copy/Paste as > Copy link
 *         - The URL includes node-id (e.g., node-id=123-456). Replace colon in node-id with a colon if needed or use the raw node-id shown by Dev Mode.
 *       Alternatively, use the Figma API "GET /v1/files/:file_key" to list document nodes and find the IDs programmatically.
 *
 * Notes:
 *  - This script uses Figma's images endpoint:
 *      GET https://api.figma.com/v1/images/:file_key?ids=<id1,id2>&format=svg|png&scale=1..4
 *  - The endpoint returns a map of node-id to a temporary CDN URL; we then download those and save locally.
 *  - If you request both svg and png formats, both will be downloaded.
 *
 * Example:
 *  FIGMA_API_KEY=*** FIGMA_FILE_ID=abc123 FIGMA_NODE_IDS=10:2,10:3 npm run fetch:figma
 *
 * Add a package.json script (optional):
 *  "scripts": {
 *     "fetch:figma": "node scripts/fetch-figma-assets.js --formats svg,png --scale 2"
 *  }
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Basic tiny CLI parsing
function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

// Ensure directory exists
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Download a file given an https URL and save to dest
function downloadFile(fileUrl, destPath) {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(fileUrl);
      const req = https.get(
        {
          hostname: url.hostname,
          path: url.pathname + url.search,
          protocol: url.protocol,
          headers: { 'User-Agent': 'figma-asset-fetcher/1.0' },
        },
        (res) => {
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            // Follow redirects
            downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`Failed to download: ${fileUrl} - Status ${res.statusCode}`));
            return;
          }
          const fileStream = fs.createWriteStream(destPath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close(() => resolve(destPath));
          });
          fileStream.on('error', (err) => {
            reject(err);
          });
        }
      );
      req.on('error', (err) => reject(err));
    } catch (e) {
      reject(e);
    }
  });
}

// Fetch image URLs for a list of node IDs from Figma
async function fetchFigmaImageUrls({ token, fileId, nodeIds, format = 'svg', scale = 1 }) {
  const idsParam = encodeURIComponent(nodeIds.join(','));
  const url = `https://api.figma.com/v1/images/${encodeURIComponent(fileId)}?ids=${idsParam}&format=${encodeURIComponent(
    format
  )}${format === 'png' ? `&scale=${encodeURIComponent(scale)}` : ''}`;

  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'X-Figma-Token': token,
          'User-Agent': 'figma-asset-fetcher/1.0',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(
              new Error(`Figma API error: HTTP ${res.statusCode}. Response: ${data || '(no body)'}`)
            );
          }
          try {
            const json = JSON.parse(data);
            if (!json.images) {
              return reject(new Error(`Unexpected response from Figma API (no 'images' field): ${data}`));
            }
            resolve(json.images);
          } catch (e) {
            reject(new Error(`Failed to parse Figma API response: ${e.message}`));
          }
        });
      }
    );
    req.on('error', (err) => reject(err));
  });
}

// Sanitize a node id into a filesystem-friendly name
function sanitizeNodeId(nodeId) {
  return String(nodeId).replace(/[^\w.-]+/g, '_');
}

// PUBLIC_INTERFACE
async function main() {
  // Gather inputs
  const args = parseArgs(process.argv);

  const token = args.token || process.env.FIGMA_API_KEY;
  const fileId = args.file || process.env.FIGMA_FILE_ID;
  const nodeIdsInput = args.nodes || process.env.FIGMA_NODE_IDS;
  const formatsInput = args.formats || process.env.FIGMA_IMAGE_FORMATS || 'svg';
  const pngScale = Number(args.scale || process.env.FIGMA_PNG_SCALE || 1);
  const outDir = path.resolve(process.cwd(), args.out || process.env.OUTPUT_DIR || './assets');

  // Validate
  if (!token) {
    console.error('Error: Figma API token is required. Provide via --token or FIGMA_API_KEY env var.');
    process.exit(1);
  }
  if (!fileId) {
    console.error('Error: Figma File ID is required. Provide via --file or FIGMA_FILE_ID env var.');
    process.exit(1);
  }
  if (!nodeIdsInput) {
    console.error('Error: At least one node/component ID is required. Provide via --nodes or FIGMA_NODE_IDS env var.');
    process.exit(1);
  }
  const nodeIds = nodeIdsInput
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (nodeIds.length === 0) {
    console.error('Error: No valid node IDs provided.');
    process.exit(1);
  }
  const formats = formatsInput
    .split(',')
    .map((f) => f.trim().toLowerCase())
    .filter((f) => f === 'svg' || f === 'png');

  if (formats.length === 0) {
    console.error('Error: No valid formats specified. Use svg and/or png.');
    process.exit(1);
  }
  if (formats.includes('png') && (Number.isNaN(pngScale) || pngScale < 1 || pngScale > 4)) {
    console.error('Error: PNG scale must be an integer between 1 and 4.');
    process.exit(1);
  }

  ensureDirSync(outDir);

  console.log(`Starting Figma asset fetch:`);
  console.log(`- File ID: ${fileId}`);
  console.log(`- Nodes: ${nodeIds.join(', ')}`);
  console.log(`- Formats: ${formats.join(', ')}`);
  if (formats.includes('png')) {
    console.log(`- PNG Scale: ${pngScale}`);
  }
  console.log(`- Output Dir: ${outDir}`);

  // For each requested format, fetch URLs then download
  for (const format of formats) {
    try {
      console.log(`Fetching ${format.toUpperCase()} URLs from Figma...`);
      const imagesMap = await fetchFigmaImageUrls({
        token,
        fileId,
        nodeIds,
        format,
        scale: format === 'png' ? pngScale : undefined,
      });

      const entries = Object.entries(imagesMap);
      if (entries.length === 0) {
        console.warn(`No ${format.toUpperCase()} image URLs returned for provided node IDs.`);
        continue;
      }

      for (const [nodeId, imageUrl] of entries) {
        if (!imageUrl) {
          console.warn(`- No ${format.toUpperCase()} image available for node ${nodeId}`);
          continue;
        }
        const fileName = `${sanitizeNodeId(nodeId)}.${format}`;
        const destPath = path.join(outDir, fileName);
        try {
          await downloadFile(imageUrl, destPath);
          console.log(`- Saved ${format.toUpperCase()}: ${destPath}`);
        } catch (e) {
          console.error(`- Failed to download ${format.toUpperCase()} for node ${nodeId}: ${e.message}`);
        }
      }
    } catch (e) {
      console.error(`Error while fetching ${format.toUpperCase()} URLs: ${e.message}`);
    }
  }

  console.log('Done.');
}

if (require.main === module) {
  main().catch((e) => {
    console.error(`Unexpected error: ${e.message}`);
    process.exit(1);
  });
}

module.exports = {
  // PUBLIC_INTERFACE
  run: main,
};
