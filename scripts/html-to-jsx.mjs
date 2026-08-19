/**
 * One-off migration helper: converts the legacy static HTML fragments in
 * src/content into JSX so they can live as real React components.
 *
 * Run: node scripts/html-to-jsx.mjs <name>
 * Prints the converted JSX for src/content/<name>.html to stdout.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

const ATTRIBUTE_RENAMES = new Map(Object.entries({
  class: 'className',
  for: 'htmlFor',
  srcset: 'srcSet',
  fetchpriority: 'fetchPriority',
  crossorigin: 'crossOrigin',
  tabindex: 'tabIndex',
  autocomplete: 'autoComplete',
  autofocus: 'autoFocus',
  maxlength: 'maxLength',
  minlength: 'minLength',
  readonly: 'readOnly',
  novalidate: 'noValidate',
  inputmode: 'inputMode',
  enterkeyhint: 'enterKeyHint',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  contenteditable: 'contentEditable',
  spellcheck: 'spellCheck',
  datetime: 'dateTime',
  usemap: 'useMap',
  frameborder: 'frameBorder',
  allowfullscreen: 'allowFullScreen',
  accesskey: 'accessKey',
  playsinline: 'playsInline',
  enctype: 'encType',
  acceptcharset: 'acceptCharset',
}));

/** Form controls render uncontrolled here, so seed values instead of binding them. */
const FORM_CONTROLS = new Set(['input', 'textarea', 'select', 'option']);

/** Attributes that are booleans in HTML and need `={true}` in JSX. */
const BOOLEAN_ATTRIBUTES = new Set([
  'required', 'disabled', 'checked', 'selected', 'multiple',
  'hidden', 'async', 'defer', 'readonly', 'novalidate', 'autofocus', 'playsinline',
]);

function toCamelCase(property) {
  return property.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function convertInlineStyle(value) {
  const entries = value
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separator = declaration.indexOf(':');
      const property = declaration.slice(0, separator).trim();
      const propertyValue = declaration.slice(separator + 1).trim();
      return `${toCamelCase(property)}: '${propertyValue.replace(/'/g, "\\'")}'`;
    });

  return `{{ ${entries.join(', ')} }}`;
}

/** Legacy markup uses paths relative to the site root; make them explicit. */
function absolutizeAssetPath(value) {
  return value.replace(/(^|\s)assets\//g, '$1/assets/');
}

function convertAttributes(rawAttributes, tagName) {
  const isFormControl = FORM_CONTROLS.has(tagName.toLowerCase());
  const attributePattern = /([:@a-zA-Z_][-:.a-zA-Z0-9_]*)(\s*=\s*("[^"]*"|'[^']*'|[^\s"'>]+))?/g;
  const output = [];
  let match;

  while ((match = attributePattern.exec(rawAttributes)) !== null) {
    const name = match[1];
    const lowerName = name.toLowerCase();
    let value = match[3];

    if (value === undefined) {
      if (lowerName === 'checked' && isFormControl) {
        output.push('defaultChecked={true}');
      } else {
        output.push(BOOLEAN_ATTRIBUTES.has(lowerName) ? `${name}={true}` : name);
      }
      continue;
    }

    const quote = value[0] === '"' || value[0] === "'" ? value[0] : null;
    let inner = quote ? value.slice(1, -1) : value;

    if (lowerName === 'style') {
      output.push(`style=${convertInlineStyle(inner)}`);
      continue;
    }

    if (lowerName === 'src' || lowerName === 'srcset' || lowerName === 'href') {
      inner = absolutizeAssetPath(inner);
    }

    if (isFormControl && lowerName === 'value') {
      output.push(inner === '' ? 'defaultValue=""' : `defaultValue="${inner}"`);
      continue;
    }

    if (lowerName === 'tabindex' && /^-?\d+$/.test(inner)) {
      output.push(`tabIndex={${inner}}`);
      continue;
    }

    const jsxName = ATTRIBUTE_RENAMES.get(lowerName)
      ?? (lowerName.startsWith('data-') || lowerName.startsWith('aria-') ? lowerName : name);

    // JSX string literals cannot contain a raw double quote.
    if (inner.includes('"')) {
      output.push(`${jsxName}={${JSON.stringify(inner)}}`);
    } else {
      output.push(`${jsxName}="${inner}"`);
    }
  }

  return output;
}

/** Splits the fragment into tags, comments and text while respecting quotes. */
function tokenize(html) {
  const tokens = [];
  let index = 0;
  let textStart = 0;

  while (index < html.length) {
    if (html[index] !== '<') {
      index += 1;
      continue;
    }

    if (html.startsWith('<!--', index)) {
      const end = html.indexOf('-->', index);
      if (end === -1) break;
      if (index > textStart) tokens.push({ type: 'text', value: html.slice(textStart, index) });
      tokens.push({ type: 'comment', value: html.slice(index + 4, end) });
      index = end + 3;
      textStart = index;
      continue;
    }

    if (!/[a-zA-Z/]/.test(html[index + 1] ?? '')) {
      index += 1;
      continue;
    }

    // Walk to the closing '>' without stopping inside a quoted value.
    let cursor = index + 1;
    let quote = null;
    while (cursor < html.length) {
      const char = html[cursor];
      if (quote) {
        if (char === quote) quote = null;
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === '>') {
        break;
      }
      cursor += 1;
    }
    if (cursor >= html.length) break;

    if (index > textStart) tokens.push({ type: 'text', value: html.slice(textStart, index) });
    tokens.push({ type: 'tag', value: html.slice(index, cursor + 1) });
    index = cursor + 1;
    textStart = index;
  }

  if (textStart < html.length) tokens.push({ type: 'text', value: html.slice(textStart) });
  return tokens;
}

function convertTag(tag) {
  if (tag.startsWith('</')) return tag;

  const match = /^<([a-zA-Z][-a-zA-Z0-9]*)([\s\S]*?)(\/?)>$/.exec(tag);
  if (!match) return tag;

  const [, tagName, rawAttributes, selfClosing] = match;
  const attributes = convertAttributes(rawAttributes, tagName);
  const isVoid = VOID_ELEMENTS.has(tagName.toLowerCase());
  const needsSelfClose = isVoid || selfClosing === '/';

  const joined = attributes.length ? ` ${attributes.join(' ')}` : '';
  return `<${tagName}${joined}${needsSelfClose ? ' />' : '>'}`;
}

function convert(html) {
  return tokenize(html)
    .map((token) => {
      if (token.type === 'tag') return convertTag(token.value);
      if (token.type === 'comment') {
        const text = token.value.replace(/\*\//g, '*\\/').trim();
        return text ? `{/* ${text} */}` : '';
      }
      // Braces are JSX syntax in text nodes.
      return token.value.replace(/[{}]/g, (brace) => `{'${brace}'}`);
    })
    .join('');
}

const [name, outputPath] = process.argv.slice(2);
if (!name) {
  console.error('usage: node scripts/html-to-jsx.mjs <content-name> [output-path]');
  process.exit(1);
}

const converted = convert(readFileSync(`src/content/${name}.html`, 'utf8'));

if (outputPath) {
  // Written from Node so the UTF-8 glyphs in the markup survive.
  writeFileSync(outputPath, converted, 'utf8');
  console.log(`wrote ${outputPath} (${converted.length} chars)`);
} else {
  process.stdout.write(converted);
}
