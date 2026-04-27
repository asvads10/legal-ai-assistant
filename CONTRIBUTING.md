# Contributing Guide

Thank you for your interest in contributing to Legal AI Assistant!

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information

### Suggesting Enhancements

We welcome enhancement ideas! Please create an issue describing:
- The feature you'd like to see
- Why it would be useful
- How it might work

### Code Contributions

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Comment complex logic
   - Test thoroughly in multiple browsers

4. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of your changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Describe what you changed and why
   - Reference any related issues

## Enhancement Ideas

Here are some ideas for contributions:

### Easy 🟢
- Add more sample documents
- Improve UI/UX styling
- Add more entity types (emails, phone numbers, etc.)
- Create a dark mode toggle
- Add export to PDF functionality

### Medium 🟡
- Improve clause detection algorithms
- Add clause comparison between documents
- Create a document template generator
- Add support for multiple languages
- Implement a clause library/database

### Advanced 🔴
- Integrate with actual AI APIs (OpenAI, Anthropic) for optional enhanced analysis
- Add OCR support for scanned documents
- Create a browser extension version
- Build a collaborative review feature
- Add version control for document iterations

## Code Structure

```
legal-ai-assistant/
├── index.html           # Main HTML interface
├── styles.css           # All styling
├── app.js              # UI logic and rendering
├── legal-parser.js     # Core parsing engine
├── samples.js          # Sample legal documents
├── README.md           # Project documentation
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

## Development Guidelines

- **Keep it simple**: No complex build tools or dependencies
- **Browser compatibility**: Test in Chrome, Firefox, Safari, and Edge
- **Performance**: Keep analysis fast (<1 second for typical documents)
- **Accessibility**: Use semantic HTML and ARIA labels
- **Documentation**: Comment non-obvious code

## Testing

Before submitting a PR:

1. Test with all three sample documents
2. Test with a custom document
3. Verify all tabs work correctly
4. Test JSON export and download
5. Check responsive design on mobile
6. Verify no console errors

## Questions?

Feel free to open an issue with the "question" label if you need help!

## Code of Conduct

Be respectful, inclusive, and constructive. We're here to learn and build together.
