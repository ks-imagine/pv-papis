# PV Trivia Game

A fun interactive trivia game website for two teams (Girls vs Boys) with Firebase backend and real-time admin controls.

## Features

- **Team Selection**: Choose between Team Girls and Team Boys
- **10 Questions Per Team**: Each team answers 10 trivia questions
- **Bonus Question**: Double-or-nothing final question with Einstein theme
- **Real-time Scoring**: Live score updates and admin controls
- **Admin Panel**: Control game flow from admin interface
- **Main Display**: TV-friendly display for audience viewing
- **Firebase Integration**: Real-time data storage and synchronization
- **Reset Game**: Admin can reset entire game and delete all answers

## File Structure

```
pv-trivia/
├── index.html              # Team selection page
├── README.md              # This file
├── admin/
│   └── admin.html         # Admin control panel
├── pages/
│   ├── display.html       # Main TV display
│   ├── teams/
│   │   ├── team-girls-1.html    # Girls team question 1
│   │   ├── team-girls-2.html    # Girls team question 2
│   │   ├── ...                  # (continues for all 10 questions)
│   │   ├── team-boys-1.html     # Boys team question 1
│   │   ├── team-boys-2.html     # Boys team question 2
│   │   └── ...                  # (continues for all 10 questions)
│   └── bonus/
│       ├── bonus-girls.html     # Girls team bonus question
│       └── bonus-boys.html      # Boys team bonus question
├── scripts/
│   ├── shared-scripts.js        # Shared JavaScript for team pages
│   └── bonus-scripts.js         # JavaScript for bonus questions
├── styles/
│   ├── shared-styles.css        # Shared CSS for team pages
│   └── bonus-styles.css         # CSS for bonus questions
└── utils/
    └── generate-pages.js        # Script to generate question pages
```

## Setup Instructions

1. **Firebase Configuration**: 
   - The project is configured with Firebase project: `pv-trivia`
   - Database: `pv-trivia.firebaseapp.com`
   - Collections used: `trivia_answers`, `game_control`

2. **Game Flow**:
   - Teams start at `index.html` to select their team
   - Each team progresses through 10 questions
   - After question 10, teams answer a bonus question (double-or-nothing)
   - Admin uses `admin.html` to control the game
   - Main display shows on `display.html`

## Usage

### For Teams:
1. Open `index.html` in a web browser
2. Select your team (Girls or Boys)
3. Answer questions 1-10 in sequence
4. Complete the bonus question for a chance to double your score
5. Answers are automatically saved to Firebase

### For Admin:
1. Open `admin.html` in a web browser
2. Use controls to manage game flow:
   - **Show Welcome**: Display welcome screen
   - **Show Question**: Display current question
   - **Reveal Answers**: Show submitted answers
   - **Show Bonus**: Display bonus question screen
   - **Final Results**: Show final scores and winner
3. Use scoring controls to award points
4. Navigate between questions using Previous/Next buttons
5. **Reset Game**: Delete all answers and start over

### For Main Display:
1. Open `display.html` on the main screen/TV
2. Display automatically updates based on admin controls
3. Shows real-time scores and game state
4. Includes bonus question display with Einstein image

## Firebase Collections

### `trivia_answers`
```javascript
{
  team: "girls" | "boys",
  question: 1-10,
  answer: "string",
  timestamp: serverTimestamp
}
```

### `game_control`
```javascript
// Document: current_state
{
  state: "welcome" | "question" | "answers" | "bonus" | "final",
  question: 1-10,
  timestamp: Date
}

// Document: scores
{
  girls: number,
  boys: number
}
```

## Bonus Question

The bonus question is a special "double-or-nothing" round that appears after teams complete all 10 regular questions:

- **Theme**: Einstein-inspired with his famous image
- **Rules**: Teams can double their current score or lose it all
- **Risk**: High-stakes decision that can change the game outcome
- **Display**: Special bonus screen with Einstein image and dramatic styling

## Sample Questions

1. What is the capital of France?
2. Which planet is known as the Red Planet?
3. Who painted the Mona Lisa?
4. What is the largest ocean on Earth?
5. In which year did World War II end?
6. What is the chemical symbol for gold?
7. Which country invented pizza?
8. What is the tallest mountain in the world?
9. Who wrote the novel 'Pride and Prejudice'?
10. What is the smallest planet in our solar system?

## Customization

### To Change Questions:
1. Edit the `questions` array in `generate-pages.js`
2. Run `node generate-pages.js` to regenerate question pages
3. Update the `questions` array in `display.html` to match

### To Modify Styling:
- Each HTML file contains embedded CSS for easy customization
- Color scheme uses:
  - Girls team: `#ff6b6b` (pink/red)
  - Boys team: `#4ecdc4` (teal/blue)
  - Background: `#667eea` to `#764ba2` (purple gradient)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Safari compatibility with webkit prefixes included

## Technical Notes

- Uses Firebase v11.0.2 Web SDK
- Real-time listeners for live updates
- Responsive design for mobile and desktop
- No server-side code required - pure client-side web app

## Troubleshooting

1. **Firebase Connection Issues**: Check browser console for authentication errors
2. **Real-time Updates Not Working**: Ensure Firebase rules allow read/write access
3. **Mobile Display Issues**: Test on actual devices as mobile emulators may not reflect real performance

## License

This project is created for educational and entertainment purposes.
