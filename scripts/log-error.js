#!/usr/bin/env node

/**
 * EarnVerse Obsidian Vault — Automated Error Logger
 * Usage:
 *   node scripts/log-error.js --title "Error Title" --category "frontend" --cause "Root cause..." --fix "Fix applied..."
 */

const fs = require('fs');
const path = require('path');

// Determine Brain directory path
let brainDir = path.resolve(__dirname, '..', '..', 'Brain');
if (!fs.existsSync(brainDir)) {
  brainDir = path.resolve(__dirname, '..', 'Brain');
}

const errorsDir = path.join(brainDir, '01 - Errors & Bug Postmortems');
const registryFile = path.join(brainDir, '00 - Vault Hub', 'Error & Bug Registry.md');

// Parse arguments
const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace(/^--/, '');
  params[key] = args[i + 1] || '';
}

const title = params.title || 'Untitled Error';
const category = params.category || 'frontend';
const severity = params.severity || 'Medium';
const cause = params.cause || 'Under investigation.';
const fix = params.fix || 'Resolved in codebase.';
const today = new Date().toISOString().split('T')[0];

// Find next ERR-XXX ID
fs.mkdirSync(errorsDir, { recursive: true });
const existingFiles = fs.readdirSync(errorsDir);
let maxId = 0;
for (const file of existingFiles) {
  const match = file.match(/^ERR-(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num > maxId) maxId = num;
  }
}
const nextIdNum = String(maxId + 1).padStart(3, '0');
const errId = params.id || `ERR-${nextIdNum}`;

// Clean file name
const safeTitle = title.replace(/[\\/:*?"<>|]/g, '');
const filename = `${errId} - ${safeTitle}.md`;
const filePath = path.join(errorsDir, filename);

// Generate Markdown Content
const content = `---
id: ${errId}
title: ${title}
category: ${category}
severity: ${severity}
status: Solved
date: ${today}
tags:
  - error/${category}
  - postmortem
  - solved
---

# 🚨 ${errId}: ${title}

## 1. Symptom & Problem Statement
${params.symptom || title}

---

## 2. Root Cause Analysis
${cause}

---

## 3. Exact Fix & Solution
${fix}

---

## 4. Verification & Testing
1. Tested and verified on local development environment.
2. Status: Confirmed Solved.

---

## 5. Prevention Rule
> ⚠️ **MANDATORY RULE FOR FUTURE CODE:**  
> Refer to ${errId} to prevent regression of this defect.
`;

fs.writeFileSync(filePath, content, 'utf8');
console.log(`✅ Created error postmortem: ${filePath}`);

// Update Registry
if (fs.existsSync(registryFile)) {
  let registry = fs.readFileSync(registryFile, 'utf8');
  const newRow = `| **${errId}** | ${title} | ${category} | ${severity} | ${today} | [[${errId} - ${safeTitle}]] |\n`;
  
  if (registry.includes('|---|---|---|---|---|---|')) {
    registry = registry.replace(
      '|---|---|---|---|---|---|\n',
      `|---|---|---|---|---|---|\n${newRow}`
    );
    fs.writeFileSync(registryFile, registry, 'utf8');
    console.log(`✅ Appended ${errId} to Error & Bug Registry.`);
  }
}
