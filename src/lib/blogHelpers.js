// Helper functions for blog functionality
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getCategoryColor(category) {
  const colors = {
    'demand-generation': 'bg-blue-100 text-blue-800',
    'conversion-optimization': 'bg-green-100 text-green-800',
    'b2b-marketing': 'bg-purple-100 text-purple-800',
    'saas-growth': 'bg-orange-100 text-orange-800',
    'analytics-tracking': 'bg-gray-100 text-gray-800',
    'case-studies': 'bg-red-100 text-red-800',
    'industry-insights': 'bg-indigo-100 text-indigo-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
}

export function getCategoryLabel(category) {
  const labels = {
    'demand-generation': 'Demand Generation',
    'conversion-optimization': 'Conversion Optimization',
    'b2b-marketing': 'B2B Marketing',
    'saas-growth': 'SaaS Growth',
    'analytics-tracking': 'Analytics & Tracking',
    'case-studies': 'Case Studies',
    'industry-insights': 'Industry Insights'
  };
  return labels[category] || category;
}

function processTextMarks(child, markDefs) {
  let text = child.text || '';
  
  if (!child.marks || child.marks.length === 0) {
    return text;
  }
  
  child.marks.forEach(mark => {
    if (typeof mark === 'string') {
      const markDef = markDefs.find(def => def._key === mark);
      
      if (markDef && markDef._type === 'link' && markDef.href) {
        const target = markDef.href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : '';
        text = `<a href="${markDef.href}" ${target} class="text-primary-600 hover:text-primary-700 underline decoration-2 underline-offset-2">${text}</a>`;
      } else if (mark === 'strong') {
        text = `<strong>${text}</strong>`;
      } else if (mark === 'em') {
        text = `<em>${text}</em>`;
      } else if (mark === 'code') {
        text = `<code class="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-gray-800 border border-gray-200">${text}</code>`;
      }
    }
  });
  
  return text;
}

function processBlockChildren(children, markDefs) {
  if (!children) return '';
  
  return children.map(child => processTextMarks(child, markDefs)).join('');
}

// More robust content converter
export function blocksToHtml(blocks) {
  if (!blocks) return '';
  
  return blocks.map(block => {
    // Handle code blocks FIRST (before other checks)
if (block._type === 'code' || block._type === 'codeBlock') {
      const code = block.code || '';
      const language = block.language || 'text';
      const filename = block.filename || '';
      
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      
      const filenameHtml = filename
        ? `<div class="text-xs text-gray-400 bg-gray-800 px-4 py-2 rounded-t-lg font-mono">${filename}</div>`
        : '';

      // Plain text: wrap long lines for readability. Code: horizontal scroll to preserve formatting.
      const isPlainText = language === 'text';
      const preStyle = isPlainText ? 'white-space: pre-wrap; word-break: break-word;' : '';
      const preClass = `${filename ? '' : 'rounded-t-lg'} rounded-b-lg p-4 bg-gray-900 ${isPlainText ? '' : 'overflow-x-auto'}`.trim();

      return `<div class="code-block-wrapper my-8">${filenameHtml}<pre class="${preClass}" style="${preStyle}" data-language="${language}"><code class="text-sm text-gray-100 font-mono">${escapedCode}</code></pre></div>`;
    }
    
   // Handle images
if (block._type === 'image' && block.asset && block.asset.url) {
  const caption = block.caption 
    ? `<figcaption class="text-center text-sm text-gray-600 mt-3 italic">${block.caption}</figcaption>` 
    : '';
  return `<figure class="my-10"><img src="${block.asset.url}" alt="${block.alt || ''}" class="w-full rounded-lg shadow-lg" />${caption}</figure>`;
}
    // Handle three column blocks
    if (block._type === 'threeColumnBlock') {
      if (!block.columns || block.columns.length !== 3) {
        return '';
      }
      
      let html = '<div class="three-column-grid">';
      
      block.columns.forEach(column => {
        const title = column.title || '';
        const content = column.content || '';
        html += `<div class="column-card"><h4>${title}</h4><p>${content}</p></div>`;
      });
      
      html += '</div>';
      return html;
    }
    
    // Handle comparison tables
    if (block._type === 'comparisonTable') {
      const col1Header = block.col1Header || '';
      const col2Header = block.col2Header || '';
      const col3Header = block.col3Header || '';
      const rows = block.rows || [];

      // Brand colours: primary green / secondary orange
      const headerBg   = '#065f46'; // primary-800
      const col2Bg     = '#059669'; // primary-600
      const col3Bg     = '#ea580c'; // secondary-600
      const rowLabelBg = '#ecfdf5'; // primary-50
      const rowLabelColor = '#064e3b'; // primary-900
      const borderLight   = '#a7f3d0'; // primary-200
      const borderOrange  = '#fed7aa'; // secondary-200

      let html = '<div class="my-10 overflow-x-auto rounded-lg" style="box-shadow: 0 1px 4px rgba(0,0,0,0.08);">';
      html += '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;">';
      html += '<thead>';
      html += '<tr>';
      html += `<th style="padding:0.75rem 1rem;text-align:left;background:${headerBg};color:#fff;border:1px solid ${headerBg};">${col1Header}</th>`;
      html += `<th style="padding:0.75rem 1rem;text-align:left;background:${col2Bg};color:#fff;border:1px solid ${col2Bg};">${col2Header}</th>`;
      html += `<th style="padding:0.75rem 1rem;text-align:left;background:${col3Bg};color:#fff;border:1px solid ${col3Bg};">${col3Header}</th>`;
      html += '</tr>';
      html += '</thead>';
      html += '<tbody>';

      rows.forEach((row, index) => {
        const rowBg = index % 2 === 0 ? '#ffffff' : '#f9fafb';
        html += `<tr style="background:${rowBg};">`;
        html += `<td style="padding:0.75rem 1rem;font-weight:600;background:${rowLabelBg};color:${rowLabelColor};border:1px solid ${borderLight};white-space:nowrap;vertical-align:top;">${row.col1 || ''}</td>`;
        html += `<td style="padding:0.75rem 1rem;border:1px solid ${borderLight};color:#1f2937;vertical-align:top;line-height:1.6;">${row.col2 || ''}</td>`;
        html += `<td style="padding:0.75rem 1rem;border:1px solid ${borderOrange};color:#1f2937;vertical-align:top;line-height:1.6;">${row.col3 || ''}</td>`;
        html += '</tr>';
      });

      html += '</tbody>';
      html += '</table>';
      html += '</div>';
      return html;
    }

    // Handle callout boxes
    if (block._type === 'calloutBox') {
      const type    = block.type || 'insight';
      const title   = block.title || '';
      const content = block.content || '';

      const styles = {
        insight: { bg: '#ecfdf5', border: '#059669', titleColor: '#064e3b', label: 'Insight' },
        warning: { bg: '#fff7ed', border: '#ea580c', titleColor: '#7c2d12', label: 'Warning' },
        tip:     { bg: '#eff6ff', border: '#3b82f6', titleColor: '#1e3a8a', label: 'Tip'     }
      };
      const s = styles[type] || styles.insight;

      const titleHtml = title
        ? `<p style="font-weight:700;margin:0 0 0.4rem 0;color:${s.titleColor};">${title}</p>`
        : '';

      return `<div class="callout-box" style="margin:2rem 0;padding:1.25rem 1.5rem;border-radius:0.5rem;border-left:4px solid ${s.border};background:${s.bg};">${titleHtml}<p style="margin:0;line-height:1.75;color:#374151;">${content}</p></div>`;
    }

    // Handle list items (bullet or numbered)
    if (block.listItem === 'bullet' || block.listItem === 'number') {
      const markDefs = block.markDefs || [];
      const children = processBlockChildren(block.children, markDefs);
      const listType = block.listItem;
      
      return `<li class="mb-3 leading-relaxed blog-list-item" data-list-type="${listType}">${children}</li>`;
    }
    
    // Handle regular block elements
    if (block._type === 'block') {
      const style = block.style || 'normal';
      const markDefs = block.markDefs || [];
      const children = processBlockChildren(block.children, markDefs);
      
      switch (style) {
        case 'h2': 
          return `<h2 class="text-3xl font-bold mt-12 mb-6 text-gray-900">${children}</h2>`;
        case 'h3': 
          return `<h3 class="text-2xl font-semibold mt-10 mb-4 text-gray-900">${children}</h3>`;
        case 'h4': 
          return `<h4 class="text-xl font-medium mt-8 mb-3 text-gray-900">${children}</h4>`;
        case 'blockquote': 
          return `<blockquote class="border-l-4 border-primary-600 bg-primary-50 pl-6 pr-4 py-4 my-8 italic text-gray-800">${children}</blockquote>`;
        default: 
          return `<p class="mb-6 leading-relaxed text-gray-700">${children}</p>`;
      }
    }
    
    return '';
  }).join('');
}

// Helper function to wrap consecutive list items in proper list tags
export function processListItems(html) {
  if (!html) return '';
  
  // Simple regex to wrap consecutive list items with data-list-type attribute
  html = html.replace(/(<li[^>]*data-list-type="bullet"[^>]*>.*?<\/li>\s*)+/gs, (match) => {
    return `<ul class="list-disc list-outside pl-5 mb-6 space-y-2">${match}</ul>`;
  });
  
  html = html.replace(/(<li[^>]*data-list-type="number"[^>]*>.*?<\/li>\s*)+/gs, (match) => {
    return `<ol class="list-decimal list-outside pl-5 mb-6 space-y-2">${match}</ol>`;
  });
  
  return html;
}