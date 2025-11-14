# JSON to TOON Converter

A simple, elegant web application for converting JSON data to TOON (Token-Oriented Object Notation) format. Built with vanilla HTML, CSS, and JavaScript - perfect for hosting on GitHub Pages.

🔗 **[Live Demo](https://simkeyur.github.io/json2toon/)**

## What is TOON?

TOON (Token-Oriented Object Notation) is a compact data serialization format designed specifically to reduce token usage when working with Large Language Models (LLMs). It eliminates the redundancy of JSON by listing field names once and then just the values - like a lightweight table format.

### The Problem with JSON

JSON repeats structure even when nothing changes. For arrays of objects, each object repeats all the field names, which wastes tokens when feeding data to LLMs.

### The TOON Solution

TOON lists the structure once, then just the data. This can reduce token usage by approximately 50% for repetitive data structures.

### Example Conversion

**JSON (verbose):**
```json
[
  { "id": 1, "name": "Alice", "role": "admin" },
  { "id": 2, "name": "Bob", "role": "user" }
]
```

**TOON (compact):**
```
data[2]{id,name,role}:
  1,Alice,admin
  2,Bob,user
```

## Features

- ✨ **Clean, Modern UI** - Intuitive interface with responsive design
- 🔄 **Real-time Conversion** - Convert JSON to TOON instantly
- 📁 **File Upload** - Upload JSON files directly
- 📋 **Copy to Clipboard** - One-click copy of converted output
- 💾 **Download Output** - Save TOON output as a file
- 🔤 **Sort Keys** - Alphabetically sort object keys
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- ⚡ **No Dependencies** - Pure vanilla JavaScript, no frameworks required
- 🌐 **GitHub Pages Ready** - Static hosting compatible
- 🎯 **Token Efficient** - Reduces token count by ~50% for structured data

## Format Specification

### Array of Objects
```
arrayName[count]{field1,field2,field3}:
  value1,value2,value3
  value1,value2,value3
```

### Object with Mixed Types
```
field1: value
field2: value
arrayField[count]{key1,key2}:
  val1,val2
  val1,val2
```

### Special Values
- Strings with commas are escaped: `\,`
- Null values: `null`
- Booleans: `true` or `false`
- Numbers: plain numeric values

## When to Use TOON

**Use TOON when:**
- Sending large datasets to LLMs
- Token cost matters
- You have repetitive object structures (arrays of similar objects)
- Building LLM prompts with structured data

**Stick to JSON when:**
- Writing standard APIs
- Long-term data storage
- Your dataset has irregular or deeply nested structures
- Interoperability with existing tools is required

## Usage

### Online

Visit [https://simkeyur.github.io/json2toon/](https://simkeyur.github.io/json2toon/)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/simkeyur/json2toon.git
cd json2toon
```

2. Open `index.html` in your browser:
```bash
open index.html
# or serve locally
python -m http.server 8000
# then visit http://localhost:8000
```

### Hosting on GitHub Pages

1. Push the repository to GitHub
2. Go to repository Settings > Pages
3. Select the main branch as the source
4. Your site will be published at `https://<username>.github.io/json2toon/`

## Project Structure

```
json2toon/
├── index.html      # Main HTML structure
├── styles.css      # Styling and layout
├── script.js       # Conversion logic and interactivity
└── README.md       # Documentation
```

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## References

- [TOON: Bye Bye JSON for LLMs](https://medium.com/data-science-in-your-pocket/toon-bye-bye-json-for-llms-91e4fe521b14) - Original article introducing TOON format

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

MIT License - feel free to use this project for any purpose.

## Author

Created by [Keyur Simaria](https://github.com/simkeyur)

---

⭐ If you find this useful, please consider giving it a star on GitHub!
