// JSON to TOON Converter

// DOM Elements
const jsonInput = document.getElementById('jsonInput');
const toonOutput = document.getElementById('toonOutput');
const convertBtn = document.getElementById('convertBtn');
const clearInput = document.getElementById('clearInput');
const copyOutput = document.getElementById('copyOutput');
const downloadOutput = document.getElementById('downloadOutput');
const fileInput = document.getElementById('fileInput');
const prettyPrint = document.getElementById('prettyPrint');
const sortKeys = document.getElementById('sortKeys');

// Event Listeners
convertBtn.addEventListener('click', convertJsonToToon);
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
 * Convert JSON value to TOON format with type information
 */
function jsonToToon(value) {
    // Null
    if (value === null) {
        return { type: 'null', value: null };
    }

    // Boolean
    if (typeof value === 'boolean') {
        return { type: 'boolean', value: value };
    }

    // Number
    if (typeof value === 'number') {
        const toonValue = { type: 'number', value: value };
        // Add additional metadata for special number types
        if (Number.isInteger(value)) {
            toonValue.subtype = 'integer';
        } else {
            toonValue.subtype = 'float';
        }
        if (!Number.isFinite(value)) {
            toonValue.special = value === Infinity ? 'infinity' : value === -Infinity ? '-infinity' : 'nan';
        }
        return toonValue;
    }

    // String
    if (typeof value === 'string') {
        return { type: 'string', value: value };
    }

    // Array
    if (Array.isArray(value)) {
        return {
            type: 'array',
            length: value.length,
            value: value.map(item => jsonToToon(item))
        };
    }

    // Object
    if (typeof value === 'object') {
        const toonObject = {
            type: 'object',
            value: {}
        };

        let keys = Object.keys(value);
        
        // Sort keys if option is enabled
        if (sortKeys.checked) {
            keys = keys.sort();
        }

        for (const key of keys) {
            toonObject.value[key] = jsonToToon(value[key]);
        }

        return toonObject;
    }

    // Undefined (shouldn't happen in valid JSON, but handle it)
    if (value === undefined) {
        return { type: 'undefined', value: undefined };
    }

    // Fallback for unknown types
    return { type: 'unknown', value: String(value) };
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
        const toonData = jsonToToon(jsonData);

        // Format output
        let output;
        if (prettyPrint.checked) {
            output = JSON.stringify(toonData, null, 2);
        } else {
            output = JSON.stringify(toonData);
        }

        toonOutput.value = output;
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
const exampleJson = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "active": true,
  "balance": 1234.56,
  "tags": ["developer", "designer"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": 10001
  },
  "projects": [
    {
      "title": "Project Alpha",
      "status": "completed"
    },
    {
      "title": "Project Beta",
      "status": "in-progress"
    }
  ]
}`;

// Set example on load
window.addEventListener('load', () => {
    jsonInput.value = exampleJson;
    convertJsonToToon();
});
