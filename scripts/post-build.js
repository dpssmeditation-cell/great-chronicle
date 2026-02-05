import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const INDEX_PATH = path.join(DIST_DIR, 'index.html');
const NOT_FOUND_PATH = path.join(DIST_DIR, '404.html');

try {
    if (fs.existsSync(INDEX_PATH)) {
        fs.copyFileSync(INDEX_PATH, NOT_FOUND_PATH);
        console.log('Successfully created 404.html from index.html');
    } else {
        console.warn('Warning: index.html not found in dist directory');
    }
} catch (error) {
    console.error('Error in post-build script:', error);
    process.exit(1);
}
