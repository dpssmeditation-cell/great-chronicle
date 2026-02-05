import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://chronicle.insightsharing.org';
const DATA_PATH = path.join(__dirname, '../public/data/chronicles.json');
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

// Static routes
const staticRoutes = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/browse', changefreq: 'weekly', priority: 0.8 },
    { url: '/search', changefreq: 'monthly', priority: 0.5 },
];

async function generateSitemap() {
    try {
        console.log('Reading data from:', DATA_PATH);
        const data = fs.readFileSync(DATA_PATH, 'utf8');
        const chronicles = JSON.parse(data);

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

        // Add static routes
        staticRoutes.forEach(route => {
            sitemap += `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
        });

        // Add dynamic chapter routes
        chronicles.forEach(volume => {
            volume.parts.forEach(part => {
                part.chapters.forEach(chapter => {
                    sitemap += `  <url>
    <loc>${BASE_URL}/read/${chapter.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
                });
            });
        });

        sitemap += '</urlset>';

        console.log('Writing sitemap to:', SITEMAP_PATH);
        fs.writeFileSync(SITEMAP_PATH, sitemap);
        console.log('Sitemap generated successfully!');

    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
