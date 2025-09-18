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

// Robust content converter with proper handling of all block types
export function blocksToHtml(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';
  
  return blocks.map(block => {
    if (!block || !block._type) return '';

    if (block._type === 'block') {
      const style = block.style || 'normal';
      
      // Get mark definitions for this block
      const markDefs = block.markDefs || [];
      
      // Check if this is a list block
      if (block.listItem) {
        const children = processChildren(block.children, markDefs);
        const listType = block.listItem;
        const level = block.level || 1;
        const indent = '  '.repeat(level - 1);
        
        if (listType === 'bullet') {
          return `${indent}<li class="mb-2 leading-relaxed text-gray-700">${children}</li>`;
        } else if (listType === 'number') {
          return `${indent}<li class="mb-2 leading-relaxed text-gray-700">${children}</li>`;
        }
      }
      
      const children = processChildren(block.children, markDefs);
      
      // Apply block styles
      switch (style) {
        case 'h1':
          return `<h1 class="text-4xl font-bold mt-12 mb-8 text-gray-900">${children}</h1>`;
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
    
    // Handle list wrapper blocks
    else if (block._type === 'list') {
      const listType = block.listType || 'bullet';
      const items = block.items || [];
      
      const listItems = items.map(item => {
        const children = processChildren(item.children, item.markDefs || []);
        return `<li class="mb-2 leading-relaxed text-gray-700">${children}</li>`;
      }).join('');
      
      if (listType === 'bullet') {
        return `<ul class="list-disc pl-6 mb-6">${listItems}</ul>`;
      } else {
        return `<ol class="list-decimal pl-6 mb-6">${listItems}</ol>`;
      }
    }
    
    // Handle image blocks
    else if (block._type === 'image' && block.asset) {
      const caption = block.caption ? `<figcaption class="text-center text-sm text-gray-600 mt-3 italic">${block.caption}</figcaption>` : '';
      return `
        <figure class="my-10">
          <img src="${block.asset.url}" alt="${block.alt || ''}" class="w-full rounded-lg shadow-lg" />
          ${caption}
        </figure>
      `;
    }
    
    return '';
  }).join('');
}

// Helper function to process children with marks
function processChildren(children, markDefs) {
  if (!children || !Array.isArray(children)) return '';
  
  return children.map(child => {
    let text = child.text || '';
    
    if (child.marks && child.marks.length > 0) {
      child.marks.forEach(mark => {
        if (typeof mark === 'string') {
          // Handle annotation marks by finding the markDef
          const markDef = markDefs.find(def => def._key === mark);
          if (markDef && markDef._type === 'link') {
            const target = markDef.href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : '';
            text = `<a href="${markDef.href}" ${target} class="text-primary-600 hover:text-primary-700 underline decoration-2 underline-offset-2">${text}</a>`;
          }
          // Handle regular string marks
          else if (mark === 'strong') {
            text = `<strong>${text}</strong>`;
          } else if (mark === 'em') {
            text = `<em>${text}</em>`;
          } else if (mark === 'code') {
            text = `<code class="bg-gray-100 px-1 rounded">${text}</code>`;
          }
        }
      });
    }
    
    return text;
  }).join('');
}