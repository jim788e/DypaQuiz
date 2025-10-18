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
- **JSON Data Source**: Loads quiz data from `quiz.json`
- **Error Handling**: Comprehensive error handling for data loading

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jim788e/DypaQuiz.git
   cd DypaQuiz
   ```

2. **Run locally**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js
   npx serve .
   ```

3. **Open your browser** and go to `http://localhost:8000`

## File Structure

```
├── index.html          # Main application file
├── quiz.json          # Main quiz data file (EDIT THIS)
├── sample.json        # Sample quiz data (backup/reference)
├── package.json       # Project configuration
├── vercel.json        # Vercel deployment config
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## Customizing Your Quiz

### To Update Questions:
1. **Edit `quiz.json`** with your questions
2. **Keep `sample.json`** as a backup/reference
3. **Redeploy** (if using Vercel): `vercel --prod`

### Quiz Data Format

The application expects a JSON file with the following structure:

```json
{
  "quizTitle": "Your Quiz Title",
  "questions": [
    {
      "id": 1,
      "question": "What is your question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Optional explanation for this answer"
    }
  ]
}
```

**Field Descriptions:**
- `quizTitle`: The title displayed at the top of the quiz
- `questions`: Array of question objects
- `id`: Unique identifier for each question
- `question`: The question text
- `options`: Array of answer choices (2-4 options recommended)
- `correctAnswer`: Index of the correct option (0-based)
- `explanation`: Optional explanation shown in results for wrong answers

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Connect to GitHub** for automatic deployments on push

### Other Platforms
- **Netlify**: Drag and drop the folder
- **GitHub Pages**: Enable in repository settings
- **Any static hosting**: Upload the files

## Development

### Local Development Server
```bash
# Python (recommended)
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

### File Management
- **`quiz.json`**: Main quiz data - edit this file to update questions
- **`sample.json`**: Sample data - keep as reference/backup
- **`index.html`**: Application code - no need to modify unless adding features

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use and modify as needed.

## Support

For issues or questions:
- Create an issue on GitHub
- Check the sample.json file for data format examples
- Ensure quiz.json follows the correct structure
