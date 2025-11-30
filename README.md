# DypaQuiz - Interactive Quiz System

A modern, responsive quiz application built with vanilla HTML, CSS, and JavaScript.

## Features

- 🎯 **Interactive Quiz Interface**: Clean, modern UI with smooth animations
- 🔀 **Question Randomization**: Optional question shuffling with user control
- 🎲 **Random Selection Mode**: Select random questions from all chapters (1-100 questions)
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 📊 **Progress Tracking**: Real-time progress bar and question counter
- 🎨 **Visual Feedback**: Color-coded answers and smooth transitions
- 📈 **Detailed Results**: Shows only incorrect answers with explanations
- 🔄 **Retake Functionality**: Start over with newly randomized questions
- 🌐 **Bilingual Support**: English and Greek language support
- 📚 **Section Organization**: Questions organized by chapters/sections
- ⚙️ **User Preferences**: Persistent settings for randomization and feedback
- 🎛️ **Feedback Modes**: Immediate feedback or end-of-quiz results
- 📋 **Question Types**: Support for True/False and Multiple Choice questions

## Technical Details

- **Pure Vanilla JavaScript**: No frameworks or external dependencies
- **Modern ES6+**: Class-based architecture with async/await
- **Modular Structure**: Separated HTML, CSS, and JavaScript files for better maintainability
- **JSON Data Source**: Loads quiz data from `quiz.json` and chapter-specific JSON files
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
├── index.html          # Main application HTML file
├── app.js              # Application JavaScript logic
├── styles.css          # Application styles
├── quiz.json           # Main quiz configuration file
├── Chapter1.json       # Chapter 1 questions
├── Chapter2.json       # Chapter 2 questions
├── Chapter3.json       # Chapter 3 questions
├── package.json        # Project configuration
├── vercel.json         # Vercel deployment config
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Customizing Your Quiz

### To Update Questions:
1. **Edit `quiz.json`** with your questions
2. **Keep `sample.json`** as a backup/reference
3. **Redeploy** (if using Vercel): `vercel --prod`

### Quiz Configuration Options:

#### Question Randomization
- **Default**: Questions appear in serial order (as defined in quiz.json)
- **Randomize**: Check the "Randomize questions" checkbox to shuffle questions
- **Answer Options**: Always remain in serial order (A, B, C, D) regardless of randomization

#### Random Selection Mode
- **Random from all chapters**: Select this option to randomly pick questions from all chapters
- **Number of questions**: Specify how many questions to include (1-100, default: 50)
- **Fisher-Yates Algorithm**: Uses proven shuffle algorithm for true randomness
- **Smart Limits**: Automatically adjusts if requested count exceeds available questions

#### Feedback Modes
- **At the end**: See results only after completing all questions
- **After each question**: Get immediate feedback on correct/incorrect answers

#### Language Support
- **English**: Default language with full feature support
- **Greek**: Complete Greek translation for all interface elements
- **Auto-detection**: Automatically detects browser language preference

#### Section Organization
- **Chapter Selection**: Choose specific chapters or all questions
- **Question Counts**: See how many questions are in each section
- **Filtered Quizzes**: Take quizzes focused on specific topics

### Quiz Data Format

The application expects a JSON file with the following structure:

```json
{
  "quizTitle": "Your Quiz Title",
  "questions": [
    {
      "id": 1,
      "section": "1",
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
- `section`: Chapter/section identifier for organizing questions
- `question`: The question text
- `options`: Array of answer choices (2-4 options recommended)
- `correctAnswer`: Index of the correct option (0-based)
- `explanation`: Optional explanation shown in results for wrong answers

**Question Types Supported:**
- **True/False**: Use options `["Σωστό", "Λάθος"]` or `["True", "False"]`
- **Multiple Choice**: Use 2-4 options with A, B, C, D labels
- **Mixed Content**: Combine both types in the same quiz

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

## User Interface Features

### Start Screen Options
- **Chapter Selection**: Choose from available sections, all questions, or random selection
- **Random Selection**: Pick random questions from all chapters (1-100 questions)
- **Feedback Mode**: Select when to receive answer feedback
- **Question Randomization**: Toggle between serial and random question order
- **Language Switcher**: Switch between English and Greek interfaces

### Quiz Experience
- **Progress Tracking**: Visual progress bar and question counter
- **Navigation**: Previous/Next buttons with smart enabling/disabling
- **Answer Selection**: Click or tap to select answers
- **Visual Feedback**: Color-coded correct/incorrect answers
- **Mobile Optimized**: Touch-friendly interface for mobile devices

### Results & Analytics
- **Score Display**: Percentage and detailed score breakdown
- **Wrong Answers Review**: Detailed explanations for incorrect answers
- **Retake Option**: Start over with new question randomization
- **Home Button**: Return to start screen to change settings

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

## Credits

**Created by D.Misios**

A modern, responsive quiz application built with vanilla HTML, CSS, and JavaScript.

## Google Analytics

The application includes Google Analytics 4 (GA4) tracking to monitor user engagement and quiz performance.

### Configuration

The tracking is already configured with Measurement ID: `G-RWFSG8PFSK`. If you need to change this:

1. **Update the Measurement ID** in `index.html` (line 9 and 14):
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_MEASUREMENT_ID"></script>
   <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'YOUR_MEASUREMENT_ID');
   </script>
   ```

### Tracked Events

The application tracks the following user interactions:

- **`quiz_started`**: When a user begins a quiz
  - Parameters: section, question_count, randomize_questions, feedback_mode, language, random_mode, random_count
- **`quiz_completed`**: When a user finishes a quiz
  - Parameters: section, score_percentage, correct_answers, total_questions, wrong_answers, language
- **`section_changed`**: When a user switches quiz sections
  - Parameters: old_section, new_section, language
- **`language_changed`**: When a user switches the interface language
  - Parameters: old_language, new_language, section
- **`quiz_retaken`**: When a user retakes a quiz
  - Parameters: section, previous_score, language

### Privacy Considerations

- No personal information is tracked
- No specific quiz answers are recorded
- Only aggregate performance metrics are collected
- Users can disable tracking through browser settings or ad blockers

## Support

For issues or questions:
- Create an issue on GitHub
- Check the sample.json file for data format examples
- Ensure quiz.json follows the correct structure
