---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/browser-print-ts-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 437
size: 10099 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# browser-print-ts-md-md.md

> Utility / helper module using **typescript** (437 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/browser-print-ts-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 437 |
| **Size** | 10099 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/browser-print-ts-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 399
size: 9321 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# browser-print-ts-md.md

> Utility / helper module using **typescript** (399 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/browser-print-ts-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 399 |
| **Size** | 9321 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/browser-print-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 361
size: 8550 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# browser-print-ts.md

> Utility / helper module using **typescript** (361 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/browser-print-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 361 |
| **Size** | 8550 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/pdf/browser-print.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 321
size: 7737 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, project/unnati, typescript, utility]
---

# browser-print.ts

> Utility / helper module using **typescript** (321 lines).

**Key exports:** `getResumePrintTemplate`, `getCoverLetterPrintTemplate`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/pdf/browser-print.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 321 |
| **Size** | 7737 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```typescript
export interface ResumeData {
  personal_info: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
  };
  experience: Array<{
    company: string;
    title: string;
    start_date: string;
    end_date?: string;
    description?: string;
    is_current?: boolean;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field?: string;
    start_date?: string;
    end_date?: string;
  }>;
  skills?: string[];
  certifications?: Array<{
    name: string;
    issuer?: string;
    date?: string;
  }>;
}

export interface CoverLetterData {
  recipient_name?: string;
  recipient_title?: string;
  company_name: string;
  company_location?: string;
  author_name: string;
  author_email: string;
  author_phone?: string;
  author_location?: string;
  subject?: string;
  body: string;
  date?: string;
}

export function getResumePrintTemplate(data: ResumeData): string {
  const formatDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const experienceHtml = data.experience
    .map(exp => `
      <div class="experience-item">
        <div class="exp-header">
          <span class="exp-title">${exp.title}</span>
          <span class="exp-dates">${formatDate(exp.start_date)} - ${exp.is_current ? 'Present' : formatDate(exp.end_date)}</span>
        </div>
        <div class="exp-company">${exp.company}</div>
        <div class="exp-description">${exp.description || ''}</div>
      </div>
    `)
    .join('');

  const educationHtml = data.education
    .map(edu => `
      <div class="education-item">
        <div class="edu-header">
          <span class="edu-degree">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</span>
          <span class="edu-dates">${formatDate(edu.start_date)} - ${formatDate(edu.end_date)}</span>
        </div>
        <div class="edu-institution">${edu.institution}</div>
      </div>
    `)
    .join('');

  const skillsHtml = data.skills?.length
    ? `<div class="section skills-section">
        <h2>Skills</h2>
        <div class="skills-list">${data.skills.join(', ')}</div>
      </div>`
    : '';

  const certificationsHtml = data.certifications?.length
    ? `<div class="section certifications-section">
        <h2>Certifications</h2>
        ${data.certifications
          .map(cert => `<div class="cert-item">${cert.name}${cert.issuer ? ` - ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}</div>`)
          .join('')}
      </div>`
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 0.5in;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #1a1a1a;
      background: white;
      padding: 40px;
      max-width: 8.5in;
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #2563eb;
    }
    .name {
      font-size: 24pt;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }
    .contact-info {
      font-size: 10pt;
      color: #4b5563;
    }
    .contact-info span {
      margin: 0 8px;
    }
    .summary {
      margin-bottom: 20px;
      color: #4b5563;
      text-align: justify;
    }
    .section {
      margin-bottom: 20px;
    }
    .section h2 {
      font-size: 14pt;
      font-weight: 600;
      color: #2563eb;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .experience-item, .education-item {
      margin-bottom: 16px;
    }
    .exp-header, .edu-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .exp-title, .edu-degree {
      font-weight: 600;
      font-size: 11pt;
    }
    .exp-dates, .edu-dates {
      font-size: 10pt;
      color: #6b7280;
    }
    .exp-company, .edu-institution {
      font-size: 10pt;
      color: #4b5563;
      margin-top: 2px;
    }
    .exp-description {
      font-size: 10pt;
      color: #6b7280;
      margin-top: 6px;
      white-space: pre-line;
    }
    .skills-list {
      font-size: 10pt;
      color: #4b5563;
    }
    .cert-item {
      font-size: 10pt;
      margin-bottom: 4px;
    }
    @media print {
      body { padding: 0; }
      .section { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${data.personal_info.name}</div>
    <div class="contact-info">
      ${data.personal_info.email}
      ${data.personal_info.phone ? `<span>•</span>${data.personal_info.phone}` : ''}
      ${data.personal_info.location ? `<span>•</span>${data.personal_info.location}` : ''}
    </div>
  </div>
  
  ${data.personal_info.summary ? `<div class="summary">${data.personal_info.summary}</div>` : ''}
  
  ${experienceHtml ? `<div class="section"><h2>Experience</h2>${experienceHtml}</div>` : ''}
  
  ${educationHtml ? `<div class="section"><h2>Education</h2>${educationHtml}</div>` : ''}
  
  ${skillsHtml}
  
  ${certificationsHtml}
</body>
</html>`;
}

export function getCoverLetterPrintTemplate(data: CoverLetterData): string {
  const today = data.date || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: A4;
      margin: 1in;
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      background: white;
      padding: 40px;
      max-width: 8.5in;
    }
    .header {
      margin-bottom: 32px;
    }
    .author-info {
      margin-bottom: 24px;
    }
    .author-name {
      font-size: 14pt;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .author-contact {
      font-size: 10pt;
      color: #4b5563;
    }
    .date {
      margin-bottom: 24px;
    }
    .recipient {
      margin-bottom: 24px;
    }
    .recipient-name {
      font-weight: 600;
    }
    .subject {
      font-weight: 600;
      margin-bottom: 24px;
    }
    .body {
      text-align: justify;
      white-space: pre-line;
    }
    .closing {
      margin-top: 32px;
    }
    .signature {
      margin-top: 24px;
      font-style: italic;
    }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="author-info">
      <div class="author-name">${data.author_name}</div>
      <div class="author-contact">
        ${data.author_email}
        ${data.author_phone ? ` • ${data.author_phone}` : ''}
        ${data.author_location ? ` • ${data.author_location}` : ''}
      </div>
    </div>
    
    <div class="date">${today}</div>
    
    <div class="recipient">
      ${data.recipient_name ? `<div class="recipient-name">${data.recipient_name}</div>` : ''}
      ${data.recipient_title ? `<div>${data.recipient_title}</div>` : ''}
      <div>${data.company_name}</div>
      ${data.company_location ? `<div>${data.company_location}</div>` : ''}
    </div>
    
    ${data.subject ? `<div class="subject">${data.subject}</div>` : ''}
  </div>
  
  <div class="body">${data.body}</div>
  
  <div class="closing">
    <div>Sincerely,</div>
    <div class="signature">${data.author_name}</div>
  </div>
</body>
</html>`;
}

```

```

```

```
