// JSON to TOON Converter
// TOON = Token-Oriented Object Notation
// A compact format that reduces token usage for LLMs

// DOM Elements
const jsonInput = document.getElementById('jsonInput');
const toonOutput = document.getElementById('toonOutput');
const convertBtn = document.getElementById('convertBtn');
const prettifyBtn = document.getElementById('prettifyBtn');
const clearInput = document.getElementById('clearInput');
const copyOutput = document.getElementById('copyOutput');
const downloadOutput = document.getElementById('downloadOutput');
const fileInput = document.getElementById('fileInput');

// Event Listeners
convertBtn.addEventListener('click', convertJsonToToon);
prettifyBtn.addEventListener('click', prettifyJson);
clearInput.addEventListener('click', () => {
    jsonInput.value = '';
    toonOutput.value = '';
});
copyOutput.addEventListener('click', copyToClipboard);
downloadOutput.addEventListener('click', downloadToon);
fileInput.addEventListener('change', handleFileUpload);

// Allow converting with Enter key (Ctrl/Cmd + Enter)
jsonInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        convertJsonToToon();
    }
});

/**
 * Prettify JSON input
 */
function prettifyJson() {
    const inputText = jsonInput.value.trim();

    if (!inputText) {
        showToast('Please enter some JSON data', 'error');
        return;
    }

    try {
        const jsonData = JSON.parse(inputText);
        jsonInput.value = JSON.stringify(jsonData, null, 2);
        showToast('JSON prettified!', 'success');
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
    }
}

/**
 * Escape a value for TOON format
 */
function escapeValue(value) {
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') {
        // Escape commas and newlines in strings
        return value.replace(/,/g, '\\,').replace(/\n/g, '\\n');
    }
    return String(value);
}

/**
 * Convert JSON array of objects to TOON format
 * Format: arrayName[count]{field1,field2,...}:\n  value1,value2,...\n  value1,value2,...
 */
function arrayToToon(arr, name = 'data', indent = 0) {
    if (!Array.isArray(arr) || arr.length === 0) {
        return `${name}[0]`;
    }

    const indentStr = '  '.repeat(indent);
    
    // Check if array contains objects with same structure
    const firstItem = arr[0];
    
    if (typeof firstItem === 'object' && firstItem !== null && !Array.isArray(firstItem)) {
        // Array of objects - use compact TOON format
        const keys = Object.keys(firstItem);
        
        // Check if all objects have the same keys
        const allSameKeys = arr.every(item => {
            if (typeof item !== 'object' || item === null) return false;
            const itemKeys = Object.keys(item);
            return keys.length === itemKeys.length && 
                   keys.every(k => itemKeys.includes(k));
        });

        if (allSameKeys) {
            let result = `${name}[${arr.length}]{${keys.join(',')}}:`;
            
            arr.forEach(item => {
                const values = keys.map(key => escapeValue(item[key]));
                result += `\n${indentStr}  ${values.join(',')}`;
            });
            
            return result;
        }
    }
    
    // Array of primitives or mixed types - use simplified format
    let result = `${name}[${arr.length}]:`;
    arr.forEach(item => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            result += `\n${indentStr}  {${objectToInlineToon(item)}}`;
        } else if (Array.isArray(item)) {
            result += `\n${indentStr}  [${item.map(escapeValue).join(',')}]`;
        } else {
            result += `\n${indentStr}  ${escapeValue(item)}`;
        }
    });
    
    return result;
}

/**
 * Convert object to inline TOON format
 */
function objectToInlineToon(obj) {
    const keys = sortKeys.checked ? Object.keys(obj).sort() : Object.keys(obj);
    return keys.map(key => `${key}:${escapeValue(obj[key])}`).join(',');
}

/**
 * Convert JSON object to TOON format
 */
function objectToToon(obj, indent = 0) {
    const indentStr = '  '.repeat(indent);
    const keys = Object.keys(obj);
    
    let result = '';
    
    keys.forEach((key, index) => {
        const value = obj[key];
        
        if (Array.isArray(value)) {
            if (index > 0) result += '\n';
            result += indentStr + arrayToToon(value, key, indent);
        } else if (typeof value === 'object' && value !== null) {
            if (index > 0) result += '\n';
            result += `${indentStr}${key}:\n${objectToToon(value, indent + 1)}`;
        } else {
            result += `${indentStr}${key}: ${escapeValue(value)}\n`;
        }
    });
    
    return result;
}

/**
 * Main conversion function
 */
function convertJsonToToon() {
    const inputText = jsonInput.value.trim();

    if (!inputText) {
        showToast('Please enter some JSON data', 'error');
        return;
    }

    try {
        // Parse JSON
        const jsonData = JSON.parse(inputText);

        // Convert to TOON
        let toonData;
        
        if (Array.isArray(jsonData)) {
            toonData = arrayToToon(jsonData, 'data');
        } else if (typeof jsonData === 'object' && jsonData !== null) {
            toonData = objectToToon(jsonData);
        } else {
            // Primitive value
            toonData = escapeValue(jsonData);
        }

        toonOutput.value = toonData.trim();
        showToast('Conversion successful!', 'success');

    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        toonOutput.value = '';
    }
}

/**
 * Handle file upload
 */
function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (!file) return;

    if (!file.name.endsWith('.json')) {
        showToast('Please upload a JSON file', 'error');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
        jsonInput.value = e.target.result;
        showToast('File loaded successfully', 'success');
        // Auto-convert after loading
        convertJsonToToon();
    };

    reader.onerror = () => {
        showToast('Error reading file', 'error');
    };

    reader.readAsText(file);
}

/**
 * Copy output to clipboard
 */
async function copyToClipboard() {
    const output = toonOutput.value;

    if (!output) {
        showToast('Nothing to copy', 'error');
        return;
    }

    try {
        await navigator.clipboard.writeText(output);
        showToast('Copied to clipboard!', 'success');
    } catch (error) {
        // Fallback for older browsers
        toonOutput.select();
        document.execCommand('copy');
        showToast('Copied to clipboard!', 'success');
    }
}

/**
 * Download TOON output as file
 */
function downloadToon() {
    const output = toonOutput.value;

    if (!output) {
        showToast('Nothing to download', 'error');
        return;
    }

    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = 'output.toon.json';
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('File downloaded!', 'success');
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize with example data
const exampleJson = `[
  { "id": 1, "name": "Alice", "role": "admin" },
  { "id": 2, "name": "Bob", "role": "user" },
  { "id": 3, "name": "Charlie", "role": "user" }
]`;

// Set example on load
window.addEventListener('load', () => {
    jsonInput.value = exampleJson;
    convertJsonToToon();
});
