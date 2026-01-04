#!/usr/bin/env node

/**
 * RSS Feed Generator for The Dreaming Tower Archives
 * 
 * Generates rss.xml from chronicles.index.json
 * Only includes chronicles where released: true
 * 
 * Includes custom namespace fields for Mailchimp integration:
 * - theme, threat, featuring, readTime, lorekeeperNote
 * 
 * Usage: node generate-rss.js
 * 
 * Run this before deploying to ensure RSS stays in sync with your chronicles.
 */

const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURATION - Update these for your site
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
    description: 'Tales from the Digital Realm — Cybersecurity wisdom through fantasy storytelling. Follow the Secret Council of the Kingdom of Cipheria as they defend against threats that mirror our modern digital challenges.',
    language: 'en-us',
    // Optional: path to feed image (set to null if you don't have one)
    image: '/images/favicon-96x96.png'
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Formats a date string to RFC 822 format required by RSS
 * Input: ISO date string like "2024-12-16" or "2024-12-16T12:00:00Z"
 * Output: "Mon, 16 Dec 2024 12:00:00 GMT"
 */
function formatRssDate(dateString) {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
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
 * Escapes special XML characters
 */
function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Builds the full URL for a chronicle
 */
function buildUrl(href) {
  // Handle both relative and absolute hrefs
  if (href.startsWith('http')) return href;
  const cleanHref = href.startsWith('/') ? href : `/${href}`;
  return `${CONFIG.siteUrl}${cleanHref}`;
}

/**
 * Formats the featuring array into a readable string
 * e.g., ["The Lorekeeper", "Queen Lyra", "Valdris"] -> "The Lorekeeper, Queen Lyra & Valdris"
 */
function formatFeaturing(featuring) {
  if (!featuring || !Array.isArray(featuring) || featuring.length === 0) {
    return 'The Secret Council';
  }
  
  if (featuring.length === 1) {
    return featuring[0];
  }
  
  if (featuring.length === 2) {
    return `${featuring[0]} & ${featuring[1]}`;
  }
  
  // 3 or more: "A, B & C"
  const allButLast = featuring.slice(0, -1).join(', ');
  const last = featuring[featuring.length - 1];
  return `${allButLast} & ${last}`;
}

/**
 * Formats read time into a friendly string
 * e.g., 15 -> "15 minutes"
 */
function formatReadTime(readTime) {
  if (!readTime || typeof readTime !== 'number') {
    return 'Variable';
  }
  return `${readTime} minute${readTime === 1 ? '' : 's'}`;
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
    console.error(`   Make sure you're running this from your project root.`);
    process.exit(1);
  }
  
  const rawData = fs.readFileSync(jsonPath, 'utf8');
  const chronicles = JSON.parse(rawData);
  
  // Filter to only released chronicles with dates
  const releasedChronicles = chronicles
    .filter(c => c.released === true && c.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
  
  console.log(`📜 Found ${releasedChronicles.length} released chronicle(s)`);
  
  if (releasedChronicles.length === 0) {
    console.warn('⚠️  Warning: No released chronicles found. RSS will be empty.');
  }
  
  // Build the RSS XML
  const now = formatRssDate(new Date().toISOString());
  
  // Note: We're using the "tower" namespace for custom fields
  // Zapier can read these as additional fields from the RSS item
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
  
  // Add feed image if configured
  if (CONFIG.feed.image) {
    rss += `
    <image>
      <url>${CONFIG.siteUrl}${CONFIG.feed.image}</url>
      <title>${escapeXml(CONFIG.feed.title)}</title>
      <link>${CONFIG.siteUrl}</link>
    </image>`;
  }
  
  // Add each chronicle as an item
  for (const chronicle of releasedChronicles) {
    const url = buildUrl(chronicle.href);
    const pubDate = formatRssDate(chronicle.date);
    
    // Use blurb for description, fall back to subtitle
    const description = chronicle.blurb || chronicle.subtitle || '';
    
    // Format custom fields
    const theme = chronicle.theme || 'Cybersecurity';
    const threat = chronicle.threat || 'Unknown Threat';
    const featuring = formatFeaturing(chronicle.featuring);
    const readTime = formatReadTime(chronicle.readTime);
    const lorekeeperNote = chronicle.lorekeeperNote || '';
    const hasRealWorldAnalysis = chronicle.realWorldParallels && chronicle.realWorldParallels.length > 0;
    
    rss += `
    
    <item>
      <title>${escapeXml(chronicle.title)}</title>
      <link>${url}</link>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${url}</guid>`;
    
    // Add category (chronicle type) if available
    if (chronicle.type) {
      rss += `
      <category>${escapeXml(chronicle.type)}</category>`;
    }
    
    // Add custom tower namespace fields for Mailchimp
    rss += `
      <tower:theme>${escapeXml(theme)}</tower:theme>
      <tower:threat>${escapeXml(threat)}</tower:threat>
      <tower:featuring>${escapeXml(featuring)}</tower:featuring>
      <tower:readTime>${escapeXml(readTime)}</tower:readTime>
      <tower:hasAnalysis>${hasRealWorldAnalysis}</tower:hasAnalysis>`;
    
    // Only add Lorekeeper note if one exists
    if (lorekeeperNote) {
      rss += `
      <tower:lorekeeperNote>${escapeXml(lorekeeperNote)}</tower:lorekeeperNote>`;
    }
    
    rss += `
    </item>`;
    
    console.log(`   ✓ ${chronicle.title}`);
    console.log(`     Theme: ${theme} | Threat: ${threat}`);
    console.log(`     Featuring: ${featuring} | Read Time: ${readTime}`);
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
  console.log(`\n📧 Custom fields included for Mailchimp:`);
  console.log(`   tower:theme, tower:threat, tower:featuring,`);
  console.log(`   tower:readTime, tower:hasAnalysis, tower:lorekeeperNote`);
}

// Run the generator
try {
  generateRss();
} catch (error) {
  console.error('❌ Error generating RSS:', error.message);
  process.exit(1);
}