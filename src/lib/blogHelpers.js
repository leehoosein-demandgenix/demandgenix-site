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
      
      return `<div class="code-block-wrapper my-8">${filenameHtml}<pre class="${filename ? '' : 'rounded-t-lg'} rounded-b-lg p-4 bg-gray-900 overflow-x-auto" data-language="${language}"><code class="text-sm text-gray-100 font-mono">${escapedCode}</code></pre></div>`;
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
  
  // Protect navigation/breadcrumb lists
  const protectedSections = [];
  let protectedIndex = 0;
  
  html = html.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, (match) => {
    const placeholder = `<!--PROTECTED_NAV_${protectedIndex}-->`;
    protectedSections[protectedIndex] = match;
    protectedIndex++;
    return placeholder;
  });
  
  // Split HTML into lines for processing
  const lines = html.split('\n');
  const processed = [];
  let inList = false;
  let currentListType = null;
  let listBuffer = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this is a blog list item
    const isBulletItem = line.includes('data-list-type="bullet"');
    const isNumberItem = line.includes('data-list-type="number"');
    
    if (isBulletItem || isNumberItem) {
      const itemType = isBulletItem ? 'bullet' : 'number';
      
      // Starting a new list or continuing same type
      if (!inList) {
        inList = true;
        currentListType = itemType;
        listBuffer = [];
      } else if (currentListType !== itemType) {
        // Different list type - close previous list and start new one
        const listTag = currentListType === 'bullet' ? 'ul' : 'ol';
        const listClass = currentListType === 'bullet' 
          ? 'list-disc list-outside ml-6 mb-6 space-y-2'
          : 'list-decimal list-outside ml-6 mb-6 space-y-2';
        
        processed.push(`<${listTag} class="${listClass}">`);
        processed.push(...listBuffer);
        processed.push(`</${listTag}>`);
        
        // Start new list
        currentListType = itemType;
        listBuffer = [];
      }
      
      listBuffer.push(line);
    } else {
      // Not a list item
      if (inList) {
        // Close the current list
        const listTag = currentListType === 'bullet' ? 'ul' : 'ol';
        const listClass = currentListType === 'bullet' 
          ? 'list-disc list-outside ml-6 mb-6 space-y-2'
          : 'list-decimal list-outside ml-6 mb-6 space-y-2';
        
        processed.push(`<${listTag} class="${listClass}">`);
        processed.push(...listBuffer);
        processed.push(`</${listTag}>`);
        
        inList = false;
        currentListType = null;
        listBuffer = [];
      }
      
      processed.push(line);
    }
  }
  
  // Close any remaining list
  if (inList && listBuffer.length > 0) {
    const listTag = currentListType === 'bullet' ? 'ul' : 'ol';
    const listClass = currentListType === 'bullet' 
      ? 'list-disc list-outside ml-6 mb-6 space-y-2'
      : 'list-decimal list-outside ml-6 mb-6 space-y-2';
    
    processed.push(`<${listTag} class="${listClass}">`);
    processed.push(...listBuffer);
    processed.push(`</${listTag}>`);
  }
  
  html = processed.join('\n');
  
  // Restore protected sections
  protectedSections.forEach((section, index) => {
    html = html.replace(`<!--PROTECTED_NAV_${index}-->`, section);
  });
  
  return html;
}