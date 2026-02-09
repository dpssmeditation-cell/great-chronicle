import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const INDEX_PATH = path.join(DIST_DIR, 'index.html');
const NOT_FOUND_PATH = path.join(DIST_DIR, '404.html');
const CNAME_SOURCE = path.join(__dirname, '../public/CNAME');
const CNAME_DEST = path.join(DIST_DIR, 'CNAME');

try {
    // Copy index.html to 404.html for SPA routing
    if (fs.existsSync(INDEX_PATH)) {
        fs.copyFileSync(INDEX_PATH, NOT_FOUND_PATH);
        console.log('✓ Successfully created 404.html from index.html');
    } else {
        console.warn('⚠ Warning: index.html not found in dist directory');
    }

    // Copy CNAME file for custom domain
    if (fs.existsSync(CNAME_SOURCE)) {
        fs.copyFileSync(CNAME_SOURCE, CNAME_DEST);
        console.log('✓ Successfully copied CNAME to dist directory');
    } else {
        console.warn('⚠ Warning: CNAME file not found in public directory');
    }
} catch (error) {
    console.error('❌ Error in post-build script:', error);
    process.exit(1);
}
