// Shared JavaScript for Team Question Pages

import { addDoc, collection, doc, getDocs, getFirestore, onSnapshot, query, serverTimestamp, where } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

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

// Initialize question page
window.initializeQuestionPage = function(team, questionNumber, nextPage) {
    // Store team globally for other functions
    window.currentTeam = team;
    window.currentQuestionNumber = questionNumber;
    
    checkQuestionAccess(team, questionNumber);
    
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
        const hasAnswered = await checkIfAlreadyAnswered(team, questionNumber);
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
                team: team,
                question: questionNumber,
                answer: answer,
                timestamp: serverTimestamp()
            });

            showMessage('Answer submitted successfully!', 'success');
            
            // Disable the form permanently
            form.style.display = 'none';
            
            // Show waiting message
            showWaitingForNextQuestion(team);

        } catch (error) {
            console.error('Error submitting answer:', error);
            showMessage('Error submitting answer. Please try again.', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Answer';
        }
    });
};

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
                if (questionContainer) questionContainer.style.display = 'block';
                if (waitingMessage) waitingMessage.style.display = 'none';
                
                // Check if already answered
                const hasAnswered = await checkIfAlreadyAnswered(team, questionNumber);
                if (hasAnswered) {
                    showWaitingForNextQuestion();
                }
            } else {
                // Question not accessible yet - show waiting message
                if (questionContainer) questionContainer.style.display = 'none';
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
        container.innerHTML = `
            <div class="team-header">
                <div class="team-name">Team ${team === 'girls' ? 'Girls' : 'Boys'}</div>
            </div>
            <div style="text-align: center; padding: 40px;">
                <h2 style="color: #28a745; margin-bottom: 20px;">✅ Answer Submitted!</h2>
                <p style="font-size: 1.2rem; color: #333; line-height: 1.6;">
                    Great job! Please wait for the admin to reveal the next question.
                </p>
                <div style="margin-top: 30px; font-size: 3rem;">⏱️</div>
            </div>
        `;
    }
}

// Show message function
function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'block';
    
    if (type === 'error') {
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    }
}

// Export for use in other files
window.showMessage = showMessage;
