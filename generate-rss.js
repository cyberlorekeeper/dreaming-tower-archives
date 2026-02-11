#!/usr/bin/env node

/**
 * RSS Feed Generator for The Dreaming Tower Archives
 * 
 * Generates rss.xml from chronicles.index.json
 * Only includes chronicles where released: true
 * 
 * Includes custom namespace fields for Mailchimp/Zapier integration:
 * - theme, threat, featuring, readTime, lorekeeperNote
 * - Serial support: partNumber, totalParts, serialContext, prevPartUrl, seriesId
 * 
 * Usage: node generate-rss.js
 * 
 * Run this before deploying, or let Netlify/GitHub Actions run it automatically.
 */

const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Your site's base URL (no trailing slash)
  siteUrl: 'https://www.cyberlorekeeper.com',

  // Path to your chronicles index JSON (relative to project root)
  chroniclesJsonPath: './data/chronicles.index.json',

  // Where to output the RSS file (relative to project root)
  outputPath: './rss.xml',

  // Feed metadata
  feed: {
    title: 'The Dreaming Tower Archives',
    description:
      'Tales from the Digital Realm — Cybersecurity wisdom through fantasy storytelling. Follow the Secret Council of the Kingdom of Cipheria as they defend against threats that mirror our modern digital challenges.',
    language: 'en-us',
    // Path to feed image (relative to site root, or null to skip)
    image: '/images/favicon-96x96.png',
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Formats a date string to RFC 822 format required by RSS.
 * Accepts ISO date strings like "2025-12-16" or "2025-12-16T12:00:00Z".
 * Returns "Mon, 16 Dec 2025 12:00:00 GMT".
 */
function formatRssDate(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const day = days[date.getUTCDay()];
  const dateNum = String(date.getUTCDate()).padStart(2, '0');
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${day}, ${dateNum} ${month} ${year} ${hours}:${minutes}:${seconds} GMT`;
}

/**
 * Escapes special XML characters.
 */
function escapeXml(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Builds the full URL for a chronicle from its href.
 */
function buildUrl(href) {
  if (!href) return CONFIG.siteUrl;
  if (href.startsWith('http')) return href;
  const cleanHref = href.startsWith('/') ? href : `/${href}`;
  return `${CONFIG.siteUrl}${cleanHref}`;
}

/**
 * Formats the featuring field.
 * Accepts either an array ["Cassia", "Valdris"] or a pre-formatted string.
 * Returns a readable string like "Cassia, Valdris & The Lorekeeper".
 */
function formatFeaturing(featuring) {
  if (!featuring) return '';
  if (typeof featuring === 'string') return featuring;
  if (Array.isArray(featuring)) {
    if (featuring.length === 0) return '';
    if (featuring.length === 1) return featuring[0];
    const last = featuring[featuring.length - 1];
    const rest = featuring.slice(0, -1);
    return `${rest.join(', ')} & ${last}`;
  }
  return '';
}

/**
 * Formats the readTime field.
 * If it's a number, appends " minutes". If it's already a string, returns as-is.
 */
function formatReadTime(readTime) {
  if (!readTime && readTime !== 0) return '';
  if (typeof readTime === 'number') return `${readTime} minutes`;
  return String(readTime);
}

// ============================================
// SERIAL CHRONICLE HELPERS
// ============================================

/**
 * Determines if a chronicle is part of a series.
 * Uses Victoria's existing field structure: seriesId, part, totalParts
 */
function isSerialChronicle(chronicle) {
  return !!(
    chronicle.seriesId &&
    chronicle.part &&
    chronicle.totalParts &&
    chronicle.totalParts > 1
  );
}

/**
 * Finds the previous part's full URL for a serialized chronicle.
 * Automatically looks up the previous part by matching seriesId and part number.
 * Returns empty string for Part 1 or standalone chronicles.
 */
function getPreviousPartUrl(chronicle, allChronicles) {
  if (!isSerialChronicle(chronicle)) return '';
  if (chronicle.part === 1) return '';

  const previousPart = allChronicles.find(
    (c) => c.seriesId === chronicle.seriesId && c.part === chronicle.part - 1
  );

  return previousPart ? buildUrl(previousPart.href) : '';
}

// ============================================
// RSS ITEM GENERATOR
// ============================================

/**
 * Generates a single <item> element for the RSS feed.
 * Handles both standalone and serial chronicles.
 */
function generateRssItem(chronicle, allChronicles) {
  const isSerial = isSerialChronicle(chronicle);
  const prevUrl = getPreviousPartUrl(chronicle, allChronicles);

  // Build the title — include part info for serial chronicles
  const displayTitle = isSerial
    ? `${chronicle.title} — Part ${chronicle.part}: ${chronicle.partTitle || ''}`
    : chronicle.title;

  const fullUrl = buildUrl(chronicle.href);
  const pubDate = formatRssDate(chronicle.publishDate || chronicle.date);
  const description = chronicle.blurb || chronicle.subtitle || '';
  const featuring = formatFeaturing(chronicle.featuring);
  const readTime = formatReadTime(chronicle.readTime);

  let item = `
    <item>
      <title>${escapeXml(displayTitle)}</title>
      <link>${fullUrl}</link>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${fullUrl}</guid>`;

  // Category (chronicle type)
  if (chronicle.type) {
    item += `
      <category>${escapeXml(chronicle.type)}</category>`;
  }

  // Tags as additional categories
  if (chronicle.tags && Array.isArray(chronicle.tags)) {
    for (const tag of chronicle.tags) {
      item += `
      <category>${escapeXml(tag)}</category>`;
    }
  }

  // ---- Custom tower: namespace fields ----

  // Core metadata (present on all chronicles)
  if (chronicle.theme) {
    item += `
      <tower:theme>${escapeXml(chronicle.theme)}</tower:theme>`;
  }
  if (chronicle.threat) {
    item += `
      <tower:threat>${escapeXml(chronicle.threat)}</tower:threat>`;
  }
  if (featuring) {
    item += `
      <tower:featuring>${escapeXml(featuring)}</tower:featuring>`;
  }
  if (readTime) {
    item += `
      <tower:readTime>${escapeXml(readTime)}</tower:readTime>`;
  }
  item += `
      <tower:hasAnalysis>${chronicle.hasAnalysis !== false ? 'true' : 'false'}</tower:hasAnalysis>`;
  if (chronicle.lorekeeperNote) {
    item += `
      <tower:lorekeeperNote>${escapeXml(chronicle.lorekeeperNote)}</tower:lorekeeperNote>`;
  }

  // Serial-specific fields (only present on series parts)
  if (isSerial) {
    item += `
      <tower:isSerial>true</tower:isSerial>`;
    item += `
      <tower:partNumber>${chronicle.part}</tower:partNumber>`;
    item += `
      <tower:totalParts>${chronicle.totalParts}</tower:totalParts>`;
    item += `
      <tower:seriesId>${escapeXml(chronicle.seriesId)}</tower:seriesId>`;

    if (chronicle.partTitle) {
      item += `
      <tower:partTitle>${escapeXml(chronicle.partTitle)}</tower:partTitle>`;
    }
    if (chronicle.serialContext) {
      item += `
      <tower:serialContext>${escapeXml(chronicle.serialContext)}</tower:serialContext>`;
    }
    if (prevUrl) {
      item += `
      <tower:prevPartUrl>${prevUrl}</tower:prevPartUrl>`;
    }
  } else {
    item += `
      <tower:isSerial>false</tower:isSerial>`;
  }

  item += `
    </item>`;

  return item;
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateRss() {
  console.log('📖 Reading chronicles index...');

  // Read the chronicles JSON
  const jsonPath = path.resolve(process.cwd(), CONFIG.chroniclesJsonPath);

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Error: Could not find ${CONFIG.chroniclesJsonPath}`);
    console.error('   Make sure you\'re running this from your project root.');
    process.exit(1);
  }

  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const allChronicles = JSON.parse(rawData);

  // Filter to only released chronicles with dates
  const releasedChronicles = allChronicles
    .filter((c) => c.released === true && c.date)
    .sort((a, b) => {
      const dateA = new Date(a.publishDate || a.date);
      const dateB = new Date(b.publishDate || b.date);
      return dateB - dateA; // Newest first
    });

  console.log(`📜 Found ${releasedChronicles.length} released chronicle(s)`);

  if (releasedChronicles.length === 0) {
    console.warn('⚠️  Warning: No released chronicles found. RSS will be empty.');
  }

  // Count serial vs standalone for reporting
  const serialCount = releasedChronicles.filter(isSerialChronicle).length;
  const standaloneCount = releasedChronicles.length - serialCount;

  // Build the RSS feed
  const now = formatRssDate(new Date().toISOString());

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:tower="https://www.cyberlorekeeper.com/rss/tower">
  <channel>
    <title>${escapeXml(CONFIG.feed.title)}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${escapeXml(CONFIG.feed.description)}</description>
    <language>${CONFIG.feed.language}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${CONFIG.siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>`;

  // Feed image
  if (CONFIG.feed.image) {
    rss += `
    <image>
      <url>${CONFIG.siteUrl}${CONFIG.feed.image}</url>
      <title>${escapeXml(CONFIG.feed.title)}</title>
      <link>${CONFIG.siteUrl}</link>
    </image>`;
  }

  // Generate each item
  for (const chronicle of releasedChronicles) {
    rss += generateRssItem(chronicle, allChronicles);

    const label = isSerialChronicle(chronicle)
      ? `${chronicle.title} (Part ${chronicle.part}/${chronicle.totalParts})`
      : chronicle.title;
    console.log(`   ✓ ${label}`);
  }

  // Close the feed
  rss += `
    
  </channel>
</rss>
`;

  // Write the output file
  const outputPath = path.resolve(process.cwd(), CONFIG.outputPath);
  fs.writeFileSync(outputPath, rss, 'utf8');

  console.log(`\n✅ RSS feed generated: ${CONFIG.outputPath}`);
  console.log(`   ${releasedChronicles.length} chronicle(s) included`);
  console.log(`   ├── ${standaloneCount} standalone`);
  console.log(`   └── ${serialCount} serial parts`);
  console.log(`\n📧 Custom fields available for Zapier/Mailchimp:`);
  console.log('   Core:   tower:theme, tower:threat, tower:featuring,');
  console.log('           tower:readTime, tower:hasAnalysis, tower:lorekeeperNote');
  console.log('   Serial: tower:isSerial, tower:partNumber, tower:totalParts,');
  console.log('           tower:seriesId, tower:partTitle, tower:serialContext,');
  console.log('           tower:prevPartUrl');
}

// Run the generator
try {
  generateRss();
} catch (error) {
  console.error('❌ Error generating RSS:', error.message);
  process.exit(1);
}
