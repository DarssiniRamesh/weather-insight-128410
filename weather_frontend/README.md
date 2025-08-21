# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Fetching Icons from Figma (SVG/PNG)

A utility script is included to download specific icon components from a Figma file and save them into `weather_frontend/assets/`.

- Script path: `scripts/fetch-figma-assets.js`
- NPM script: `npm run fetch:figma`

### Prerequisites
- Figma personal access token (API key)

### How to get required IDs
- API Key: In Figma, Help > Account Settings > Personal access tokens.
- File ID: From the file URL: `https://www.figma.com/file/<FILE_ID>/<File-Name>`
- Node/Component IDs:
  - In Figma, select the component/layer.
  - Right-click > Copy/Paste as > Copy link (URL contains `node-id=...`).
  - Alternatively, use Dev Mode to view the node id, or the Figma API `GET /v1/files/:file_key` to discover nodes.

### Usage via environment variables
```
FIGMA_API_KEY=your_token \
FIGMA_FILE_ID=your_file_id \
FIGMA_NODE_IDS="10:2,10:3" \
FIGMA_IMAGE_FORMATS="svg,png" \
FIGMA_PNG_SCALE=2 \
OUTPUT_DIR="./assets/icons" \
npm run fetch:figma
```

### Usage via CLI flags
```
node scripts/fetch-figma-assets.js \
  --token your_token \
  --file your_file_id \
  --nodes "10:2,10:3" \
  --formats svg,png \
  --scale 2 \
  --out ./assets/icons
```

Notes:
- Formats can be `svg`, `png`, or both (comma-separated).
- For PNGs, you may set a scale (1..4). Default is 1.
- Assets will be saved with filenames based on the node IDs (sanitized).

## Customization

### Colors

The main brand colors are defined as CSS variables in `src/App.css`:

```css
:root {
  --kavia-orange: #E87A41;
  --kavia-dark: #1A1A1A;
  --text-color: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --border-color: rgba(255, 255, 255, 0.1);
}
```

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
