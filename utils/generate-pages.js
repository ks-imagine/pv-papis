// Script to generate all team question pages
const fs = require('fs');
const path = require('path');

// Sample questions for the trivia game
const questions = [
    "What is the capital of France?",
    "Which planet is known as the Red Planet?",
    "Who painted the Mona Lisa?",
    "What is the largest ocean on Earth?",
    "In which year did World War II end?",
    "What is the chemical symbol for gold?",
    "Which country invented pizza?",
    "What is the tallest mountain in the world?",
    "Who wrote the novel 'Pride and Prejudice'?",
    "What is the smallest planet in our solar system?"
];

function generateQuestionPage(team, questionNumber, question) {
    const teamColor = team === 'girls' ? '#ff6b6b' : '#4ecdc4';
    const teamColorHover = team === 'girls' ? '#ee5a52' : '#44a08d';
    const teamEmoji = team === 'girls' ? '👩‍🎓' : '👨‍🎓';
    const teamName = team === 'girls' ? 'Team Girls' : 'Team Boys';
    const nextPage = questionNumber < 10 ? `team-${team}-${questionNumber + 1}.html` : `../bonus/bonus-${team}.html`;
    const progressPercent = (questionNumber / 10) * 100;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${teamName} - Question ${questionNumber}</title>
    <link rel="stylesheet" href="../../styles/shared-styles.css">
</head>
<body class="${team}-theme">
    <div class="waiting-message" id="waitingMessage">
        <h2>🎯 ${teamName} - Question ${questionNumber}</h2>
        <p>Please wait for the admin to reveal this question!</p>
        <p>🤔 Question ${questionNumber} of 10 is coming up...</p>
    </div>

    <div class="container hidden" id="questionContainer">
        <div class="team-header">
            <div class="team-name">${teamEmoji} ${teamName}</div>
            <div class="question-number">Question ${questionNumber} of 10</div>
        </div>
        
        <div class="progress-bar">
            <div class="progress-fill progress-${questionNumber * 10}"></div>
        </div>
        
        <div class="question-text">
            ${question}
        </div>
        
        <form class="answer-form" id="answerForm">
            <input type="text" class="answer-input" id="answer" placeholder="Type your answer here..." required>
            <button type="submit" class="submit-button" id="submitButton">Submit Answer</button>
        </form>
        
        <div class="message" id="message"></div>
    </div>

    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
        import { getFirestore, collection, addDoc, doc, onSnapshot, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyA1ayS7BnUHBCCVs-BooYGOdlrSSdmo7Bk",
            authDomain: "pv-trivia.firebaseapp.com",
            projectId: "pv-trivia",
            storageBucket: "pv-trivia.firebasestorage.app",
            messagingSenderId: "1021041174389",
            appId: "1:1021041174389:web:8ed1d9d914fac43bae153c"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Check if team has access to this question
        async function checkQuestionAccess(team, questionNumber) {
            const gameStateRef = doc(db, 'game_control', 'current_state');
            
            onSnapshot(gameStateRef, async (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    const currentGameQuestion = data.question || 1;
                    const gameState = data.state;
                    
                    // Check if this question is accessible
                    const questionContainer = document.getElementById('questionContainer');
                    const waitingMessage = document.getElementById('waitingMessage');
                    
                    if (gameState === 'question' && currentGameQuestion === questionNumber) {
                        // Question is being displayed by admin - allow access
                        if (questionContainer) questionContainer.classList.remove('hidden');
                        if (waitingMessage) waitingMessage.style.display = 'none';
                        
                        // Check if already answered
                        const hasAnswered = await checkIfAlreadyAnswered(team, questionNumber);
                        if (hasAnswered) {
                            showWaitingForNextQuestion(team);
                        }
                    } else {
                        // Question not accessible yet - show waiting message
                        if (questionContainer) questionContainer.classList.add('hidden');
                        if (waitingMessage) waitingMessage.style.display = 'block';
                    }
                }
            });
        }

        // Check if team has already answered this question
        async function checkIfAlreadyAnswered(team, questionNumber) {
            try {
                const answersRef = collection(db, 'trivia_answers');
                const q = query(answersRef, where('team', '==', team), where('question', '==', questionNumber));
                const querySnapshot = await getDocs(q);
                return !querySnapshot.empty;
            } catch (error) {
                console.error('Error checking if answered:', error);
                return false;
            }
        }

        // Show waiting message after submission
        function showWaitingForNextQuestion(team) {
            const container = document.querySelector('.container');
            if (container) {
                container.innerHTML = \`
                    <div class="team-header">
                        <div class="team-name">Team \${team === 'girls' ? 'Girls' : 'Boys'}</div>
                    </div>
                    <div style="text-align: center; padding: 40px;">
                        <h2 style="color: #28a745; margin-bottom: 20px;">✅ Answer Submitted!</h2>
                        <p style="font-size: 1.2rem; color: #333; line-height: 1.6;">
                            Great job! Please wait for the admin to reveal the next question.
                        </p>
                        <div style="margin-top: 30px; font-size: 3rem;">⏱️</div>
                    </div>
                \`;
            }
        }

        // Show message function
        function showMessage(text, type) {
            const message = document.getElementById('message');
            if (message) {
                message.textContent = text;
                message.className = \`message \${type}\`;
                message.style.display = 'block';
                
                if (type === 'error') {
                    setTimeout(() => {
                        message.style.display = 'none';
                    }, 3000);
                }
            }
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            checkQuestionAccess('${team}', ${questionNumber});
            
            // Handle form submission
            const form = document.getElementById('answerForm');
            const answerInput = document.getElementById('answer');
            const submitButton = document.getElementById('submitButton');
            
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const answer = answerInput.value.trim();
                
                if (!answer) {
                    showMessage('Please enter an answer before submitting.', 'error');
                    return;
                }
                
                // Check if already answered
                const hasAnswered = await checkIfAlreadyAnswered('${team}', ${questionNumber});
                if (hasAnswered) {
                    showMessage('You have already submitted an answer for this question.', 'error');
                    return;
                }
                
                // Disable form during submission
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...';
                
                try {
                    // Save answer to Firebase
                    await addDoc(collection(db, 'trivia_answers'), {
                        team: '${team}',
                        question: ${questionNumber},
                        answer: answer,
                        timestamp: serverTimestamp()
                    });

                    showMessage('Answer submitted successfully!', 'success');
                    
                    // Redirect to next question page after a short delay
                    setTimeout(() => {
                        window.location.href = '${nextPage}';
                    }, 1500);

                } catch (error) {
                    console.error('Error submitting answer:', error);
                    showMessage('Error submitting answer. Please try again.', 'error');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit Answer';
                }
            });
        });
    </script>
</body>
</html>`;
}

// Generate all question pages
for (let i = 1; i <= 10; i++) {
    // Girls team pages
    const girlsContent = generateQuestionPage('girls', i, questions[i - 1]);
    fs.writeFileSync(`../pages/teams/team-girls-${i}.html`, girlsContent);
    
    // Boys team pages
    const boysContent = generateQuestionPage('boys', i, questions[i - 1]);
    fs.writeFileSync(`../pages/teams/team-boys-${i}.html`, boysContent);
}

console.log('All question pages generated successfully!');
