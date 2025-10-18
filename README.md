# DypaQuiz - Interactive Quiz System

A modern, responsive quiz application built with vanilla HTML, CSS, and JavaScript.

## Features

- 🎯 **Interactive Quiz Interface**: Clean, modern UI with smooth animations
- 🔀 **Question Randomization**: Questions are shuffled each time for variety
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 📊 **Progress Tracking**: Real-time progress bar and question counter
- 🎨 **Visual Feedback**: Color-coded answers and smooth transitions
- 📈 **Detailed Results**: Shows only incorrect answers with explanations
- 🔄 **Retake Functionality**: Start over with newly randomized questions

## Technical Details

- **Pure Vanilla JavaScript**: No frameworks or external dependencies
- **Modern ES6+**: Class-based architecture with async/await
- **Single File**: Everything contained in one HTML file
- **JSON Data Source**: Loads quiz data from `test.json`
- **Error Handling**: Comprehensive error handling for data loading

## Deployment

This application is ready for deployment on Vercel:

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```

3. **Follow the prompts** to configure your deployment

## Local Development

To run locally:

```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx serve .
```

Then open `http://localhost:8000` in your browser.

## File Structure

```
├── index.html          # Main application file
├── test.json          # Quiz data
├── package.json       # Project configuration
├── vercel.json        # Vercel deployment config
└── README.md          # This file
```

## Quiz Data Format

The application expects a JSON file with the following structure:

```json
{
  "quizTitle": "Quiz Name",
  "questions": [
    {
      "id": 1,
      "question": "Question text?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": 0,
      "explanation": "Optional explanation text"
    }
  ]
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - feel free to use and modify as needed.
