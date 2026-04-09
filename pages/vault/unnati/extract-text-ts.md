---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/ai/extract-text.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 210
size: 5508 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, project/unnati, typescript, utility]
---

# extract-text.ts

> Utility / helper module using **typescript** (210 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/ai/extract-text.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 210 |
| **Size** | 5508 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```typescript
export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    const bytes = new Uint8Array(buffer);
    const text: string[] = [];
    let inText = false;
    let currentText = '';
    
    for (let i = 0; i < bytes.length - 1; i++) {
      if (bytes[i] === 0x54 && bytes[i + 1] === 0x6a) {
        inText = true;
      }
      
      if (inText) {
        if (bytes[i] >= 32 && bytes[i] <= 126) {
          currentText += String.fromCharCode(bytes[i]);
        } else if (bytes[i] === 10 || bytes[i] === 13) {
          if (currentText.length > 1) {
            text.push(currentText.trim());
          }
          currentText = '';
        } else if (currentText.length > 2) {
          text.push(currentText.trim());
          currentText = '';
        }
      }
      
      if (bytes[i] === 0x45 && bytes[i + 1] === 0x6e) {
        inText = false;
      }
    }
    
    if (currentText.length > 1) {
      text.push(currentText.trim());
    }
    
    const result = text.join(' ').replace(/\s+/g, ' ').trim();
    return result.length > 0 ? result : '';
  } catch (error) {
    console.error('PDF extraction error:', error);
    return '';
  }
}

export async function extractTextFromDOCX(buffer: ArrayBuffer): Promise<string> {
  try {
    const bytes = new Uint8Array(buffer);
    const zipParts: number[][] = [];
    let currentPart: number[] = [];
    let inContentTypes = false;
    let inWordDocument = false;
    
    for (let i = 0; i < bytes.length - 3; i++) {
      if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x03 && bytes[i + 3] === 0x04) {
        if (currentPart.length > 0) {
          zipParts.push(currentPart);
        }
        currentPart = [bytes[i], bytes[i + 1], bytes[i + 2], bytes[i + 3]];
        inContentTypes = false;
        inWordDocument = false;
      }
      
      if (bytes[i] === 0x43 && bytes[i + 1] === 0x6f && bytes[i + 2] === 0x6e && bytes[i + 3] === 0x74) {
        inContentTypes = true;
      }
      
      if (bytes[i] === 0x77 && bytes[i + 1] === 0x6f && bytes[i + 2] === 0x72 && bytes[i + 3] === 0x64) {
        inWordDocument = true;
      }
      
      if (currentPart.length > 0) {
        currentPart.push(bytes[i]);
      }
    }
    
    if (currentPart.length > 0) {
      zipParts.push(currentPart);
    }
    
    const docXml = await findWordDocument(bytes);
    if (!docXml) {
      return '';
    }
    
    const text: string[] = [];
    let inTextTag = false;
    let currentText = '';
    
    for (let i = 0; i < docXml.length; i++) {
      const char = docXml[i];
      
      if (docXml.slice(i, i + 6) === '<w:t>') {
        inTextTag = true;
        i += 5;
        continue;
      }
      
      if (docXml.slice(i, i + 7) === '</w:t>') {
        if (currentText.trim()) {
          text.push(currentText.trim());
        }
        currentText = '';
        inTextTag = false;
        i += 6;
        continue;
      }
      
      if (inTextTag) {
        currentText += char;
      }
    }
    
    return text.join(' ').replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.error('DOCX extraction error:', error);
    return '';
  }
}

async function findWordDocument(buffer: Uint8Array): Promise<string | null> {
  const signature = 'word/document.xml';
  const bytes = buffer;
  
  for (let i = 0; i < bytes.length - signature.length - 10; i++) {
    let found = true;
    for (let j = 0; j < signature.length; j++) {
      if (bytes[i + j] !== signature.charCodeAt(j)) {
        found = false;
        break;
      }
    }
    
    if (found) {
      const startIdx = i;
      let depth = 0;
      let xmlStart = -1;
      let xmlEnd = -1;
      
      for (let k = startIdx; k < bytes.length - 1; k++) {
        if (bytes[k] === 0x3c) {
          if (bytes[k + 1] === 0x3f) {
            if (xmlStart === -1) {
              xmlStart = k;
            }
          }
          depth++;
        } else if (bytes[k] === 0x3e) {
          depth--;
          if (depth === 0 && xmlStart !== -1) {
            xmlEnd = k + 1;
            break;
          }
        }
      }
      
      if (xmlStart !== -1 && xmlEnd !== -1) {
        const xmlBytes = bytes.slice(xmlStart, xmlEnd);
        let result = '';
        for (const byte of xmlBytes) {
          if (byte >= 32 || byte === 9 || byte === 10 || byte === 13) {
            result += String.fromCharCode(byte);
          }
        }
        return result;
      }
    }
  }
  
  return null;
}

export async function extractTextFromFile(
  buffer: ArrayBuffer,
  mimeType: string
): Promise<string> {
  try {
    const normalizedMime = mimeType.toLowerCase().replace(/[^a-z0-9/]/g, '');
    
    if (normalizedMime.includes('pdf') || mimeType === 'application/pdf') {
      return extractTextFromPDF(buffer);
    }
    
    if (
      normalizedMime.includes('docx') ||
      normalizedMime.includes('word') ||
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return extractTextFromDOCX(buffer);
    }
    
    if (
      normalizedMime.includes('doc') ||
      mimeType === 'application/msword'
    ) {
      return extractTextFromDOCX(buffer);
    }
    
    if (
      normalizedMime.includes('text') ||
      mimeType.startsWith('text/')
    ) {
      const decoder = new TextDecoder('utf-8');
      return decoder.decode(buffer);
    }
    
    return '';
  } catch (error) {
    console.error('File extraction error:', error);
    return '';
  }
}

```
