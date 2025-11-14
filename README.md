# JSON to TOON Converter

A simple, elegant web application for converting JSON data to TOON (Typed Object Oriented Notation) format. Built with vanilla HTML, CSS, and JavaScript - perfect for hosting on GitHub Pages.

🔗 **[Live Demo](https://simkeyur.github.io/json2toon/)**

## What is TOON?

TOON (Typed Object Oriented Notation) is a data serialization format that extends JSON by adding explicit type information and metadata to each value. This makes data structures more explicit and easier to validate, parse, and process.

### Example Conversion

**JSON:**
```json
{
  "name": "John Doe",
  "age": 30,
  "active": true
}
```

**TOON:**
```json
{
  "type": "object",
  "value": {
    "name": {
      "type": "string",
      "value": "John Doe"
    },
    "age": {
      "type": "number",
      "value": 30,
      "subtype": "integer"
    },
    "active": {
      "type": "boolean",
      "value": true
    }
  }
}
```

## Features

- ✨ **Clean, Modern UI** - Intuitive interface with responsive design
- 🔄 **Real-time Conversion** - Convert JSON to TOON instantly
- 📁 **File Upload** - Upload JSON files directly
- 📋 **Copy to Clipboard** - One-click copy of converted output
- 💾 **Download Output** - Save TOON output as a file
- 🎨 **Pretty Print** - Optional formatted output
- 🔤 **Sort Keys** - Alphabetically sort object keys
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- ⚡ **No Dependencies** - Pure vanilla JavaScript, no frameworks required
- 🌐 **GitHub Pages Ready** - Static hosting compatible

## Type Support

The converter handles all JSON data types with type annotations:

- **String** - `{ "type": "string", "value": "..." }`
- **Number** - `{ "type": "number", "value": 123, "subtype": "integer|float" }`
- **Boolean** - `{ "type": "boolean", "value": true|false }`
- **Null** - `{ "type": "null", "value": null }`
- **Array** - `{ "type": "array", "length": N, "value": [...] }`
- **Object** - `{ "type": "object", "value": {...} }`

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
# or
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
