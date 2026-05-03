import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '../src/pages');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      const original = content;

      // Text colors
      content = content.replace(/text-\[\#(?:f1f0ec|ffffff|fff|e5e5e5)\]/g, 'text-foreground');
      content = content.replace(/text-\[\#(?:ccc|aaa|888|666|555|444)\]/g, 'text-muted-foreground');
      
      // Backgrounds and borders that are hardcoded white-alpha should become borders/muted
      content = content.replace(/border-white\/\[0\.[0-9]+\]/g, 'border-border');
      content = content.replace(/border-white\/[0-9]+/g, 'border-border');
      
      // Specifically target floating overlay bg like bg-white/[0.04] and map to bg-muted or bg-card
      // But we have to be careful not to break dark mode. Using standard variables is best.
      content = content.replace(/bg-white\/\[0\.0[2-4]\]/g, 'bg-card');
      content = content.replace(/bg-white\/\[0\.0[5-9]\]/g, 'bg-muted');
      content = content.replace(/bg-\[\#111\]/g, 'bg-card');
      content = content.replace(/bg-\[\#161616\]/g, 'bg-popover');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(pagesDir);
console.log('Color mapping completed.');
