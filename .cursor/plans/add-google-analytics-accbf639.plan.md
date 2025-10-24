<!-- accbf639-2cae-4fd2-b94f-5f483bbbf947 f7903d28-7775-4a42-ab08-719ad8092ced -->
# Add Google Analytics to DypaQuiz

## Overview

Integrate Google Analytics 4 (GA4) into the quiz application to track page views and user interactions.

## Steps

### 1. Setup Google Analytics Account

Before implementing, you'll need to:

- Go to https://analytics.google.com/
- Create a new GA4 property for your quiz app
- Get your Measurement ID (format: `G-XXXXXXXXXX`)
- Once you have the ID, you'll replace the placeholder in the code

### 2. Add GA4 Tracking Script

Add the Google Analytics script to the `<head>` section of `index.html` (around line 6, after the viewport meta tag):

- Include the gtag.js script
- Initialize with your Measurement ID
- Use a placeholder `G-XXXXXXXXXX` that you'll replace with your actual ID

### 3. Track User Interactions

Add event tracking throughout the JavaScript code for:

- **Quiz Start**: When user clicks the start button (in `startQuiz()` method)
- **Quiz Completion**: When user finishes the quiz (in `finishQuiz()` method)
- **Section Selection**: When user changes the chapter/section (in section select event listener)
- **Language Change**: When user switches language (in `setLanguage()` method)
- **Quiz Retake**: When user retakes the quiz (in `retakeQuiz()` method)

### 4. Update README

Add a section in `README.md` about Google Analytics:

- How to configure the tracking ID
- What events are being tracked
- Privacy considerations

## Files to Modify

- `index.html` (lines 1-6 in head section, and JavaScript methods throughout)
- `README.md` (add new section about analytics)

## Implementation Notes

- Use gtag.js (official GA4 library)
- Track events with descriptive names: `quiz_started`, `quiz_completed`, `section_changed`, `language_changed`, `quiz_retaken`
- Include relevant parameters (e.g., section name, language code, score percentage)
- Keep privacy-friendly: don't track personal information or specific quiz answers

### To-dos

- [ ] Add Google Analytics 4 script and initialization code to index.html head section
- [ ] Add event tracking for quiz start in startQuiz() method
- [ ] Add event tracking for quiz completion in finishQuiz() method with score data
- [ ] Add event tracking for section selection changes
- [ ] Add event tracking for language switching in setLanguage() method
- [ ] Add event tracking for quiz retake in retakeQuiz() method
- [ ] Add Google Analytics configuration section to README.md