import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse the Buddha.src database file
function parseDatabase(sourceFile, outputDir) {
    console.log('Reading source database...');
    // Read as latin1 (binary) first
    let rawContent = fs.readFileSync(sourceFile, 'latin1');

    // Windows-1252 mapping for 0x80-0x9F
    const cp1252 = {
        0x80: '\u20AC', 0x81: '', 0x82: '\u201A', 0x83: '\u0192',
        0x84: '\u201E', 0x85: '\u2026', 0x86: '\u2020', 0x87: '\u2021',
        0x88: '\u02C6', 0x89: '\u2030', 0x8A: '\u0160', 0x8B: '\u2039',
        0x8C: '\u0152', 0x8D: '', 0x8E: '\u017D', 0x8F: '',
        0x90: '', 0x91: '\u2018', 0x92: '\u2019', 0x93: '\u201C',
        0x94: '\u201D', 0x95: '\u2022', 0x96: '\u2013', 0x97: '\u2014',
        0x98: '\u02DC', 0x99: '\u2122', 0x9A: '\u0161', 0x9B: '\u203A',
        0x9C: '\u0153', 0x9D: '', 0x9E: '\u017E', 0x9F: '\u0178'
    };

    function repairText(text) {
        if (!text) return text;

        let buffer = Buffer.from(text, 'latin1');
        let output = '';
        let i = 0;

        while (i < buffer.length) {
            let byte = buffer[i];

            // Try to decode UTF-8
            if (byte >= 0xC0 && byte <= 0xF7) {
                let len = 0;
                if (byte < 0xE0) len = 2;
                else if (byte < 0xF0) len = 3;
                else if (byte < 0xF8) len = 4;

                if (i + len <= buffer.length) {
                    let validUtf8 = true;
                    for (let j = 1; j < len; j++) {
                        if ((buffer[i + j] & 0xC0) !== 0x80) validUtf8 = false;
                    }
                    if (validUtf8) {
                        let utfChar = buffer.slice(i, i + len).toString('utf8');
                        // Check if result is a C1 control (U+0080 - U+009F)
                        let code = utfChar.charCodeAt(0);
                        if (code >= 0x80 && code <= 0x9F) {
                            output += cp1252[code] || utfChar;
                        } else {
                            output += utfChar;
                        }
                        i += len;
                        continue;
                    }
                }
            }

            // Not UTF-8 or invalid, treat as single byte
            if (byte >= 0x80 && byte <= 0x9F) {
                output += cp1252[byte] || String.fromCharCode(byte);
            } else {
                output += String.fromCharCode(byte);
            }
            i++;
        }

        // Fix image paths
        output = output.replace(/\/plweb\/TImages\//g, '/TImages/');

        return output;
    }

    // Repair the whole content first
    console.log('Repairing encoding...');
    const content = repairText(rawContent);

    const chronicles = [];
    const volumes = {};

    // Split by records - looking for volume markers
    const lines = content.split('\n');

    let currentRecord = null;
    let currentContent = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('-vol-')) {
            // Save previous record if exists
            if (currentRecord) {
                currentRecord.content = currentContent.join('\n').trim();
                chronicles.push(currentRecord);
            }

            // Start new record
            currentRecord = {
                volume: parseInt(line.replace('-vol-', '').trim()) || 0,
                part: 0,
                chapter: 0,
                startPage: 0,
                endPage: 0,
                title: '',
                content: ''
            };
            currentContent = [];
        } else if (line.startsWith('-part-') && currentRecord) {
            currentRecord.part = parseInt(line.replace('-part-', '').trim()) || 0;
        } else if (line.startsWith('-chapter-') && currentRecord) {
            currentRecord.chapter = parseInt(line.replace('-chapter-', '').trim()) || 0;
        } else if (line.startsWith('-spage-') && currentRecord) {
            currentRecord.startPage = parseInt(line.replace('-spage-', '').trim()) || 0;
        } else if (line.startsWith('-epage-') && currentRecord) {
            currentRecord.endPage = parseInt(line.replace('-epage-', '').trim()) || 0;
        } else if (line.startsWith('-title-') && currentRecord) {
            currentRecord.title = line.replace('-title-', '').trim();
        } else if (currentRecord && line) {
            currentContent.push(line);
        }
    }

    // Save last record
    if (currentRecord) {
        currentRecord.content = currentContent.join('\n').trim();
        chronicles.push(currentRecord);
    }

    console.log(`Parsed ${chronicles.length} records`);

    // Organize by volume/part/chapter
    chronicles.forEach(record => {
        const volKey = `vol${record.volume}`;
        if (!volumes[volKey]) {
            volumes[volKey] = {
                volume: record.volume,
                parts: {}
            };
        }

        const partKey = `part${record.part}`;
        if (!volumes[volKey].parts[partKey]) {
            volumes[volKey].parts[partKey] = {
                part: record.part,
                chapters: []
            };
        }

        volumes[volKey].parts[partKey].chapters.push({
            chapter: record.chapter,
            title: record.title,
            startPage: record.startPage,
            endPage: record.endPage,
            content: record.content,
            id: `v${record.volume}-p${record.part}-c${record.chapter}`
        });
    });

    // Convert to array format
    const volumesArray = Object.values(volumes).map(vol => ({
        volume: vol.volume,
        parts: Object.values(vol.parts).map(part => ({
            part: part.part,
            chapters: part.chapters.sort((a, b) => a.chapter - b.chapter)
        })).sort((a, b) => a.part - b.part)
    })).sort((a, b) => a.volume - b.volume);

    // Save to JSON
    const outputFile = path.join(outputDir, 'chronicles.json');
    fs.writeFileSync(outputFile, JSON.stringify(volumesArray, null, 2));
    console.log(`Saved to ${outputFile}`);

    // Create search index
    const searchIndex = chronicles.map(record => ({
        id: `v${record.volume}-p${record.part}-c${record.chapter}`,
        volume: record.volume,
        part: record.part,
        chapter: record.chapter,
        title: record.title,
        excerpt: record.content.substring(0, 200).replace(/<[^>]*>/g, '')
    }));

    const searchFile = path.join(outputDir, 'search-index.json');
    fs.writeFileSync(searchFile, JSON.stringify(searchIndex, null, 2));
    console.log(`Created search index with ${searchIndex.length} entries`);

    return volumesArray;
}

// Main execution
const sourceFile = 'C:\\BuddhaCD\\DBS\\buddha\\Buddha.src';
const outputDir = path.join(__dirname, '..', 'public', 'data');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

try {
    parseDatabase(sourceFile, outputDir);
    console.log('Database parsing complete!');
} catch (error) {
    console.error('Error parsing database:', error);
    process.exit(1);
}
