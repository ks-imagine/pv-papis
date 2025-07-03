// Shared JavaScript for Bonus Question Pages

import { addDoc, collection, doc, getFirestore, onSnapshot } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

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

// Initialize bonus page
window.initializeBonusPage = function(team, teamDisplayName) {
    // Check if bonus question is revealed
    checkBonusRevealed();
    
    // Handle form submission
    const form = document.getElementById('bonusForm');
    const answerInput = document.getElementById('answer');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const answer = answerInput.value.trim();
        
        if (!answer) {
            showMessage('Please enter an answer before submitting.', 'error');
            return;
        }
        
        try {
            // Submit answer to Firebase
            await addDoc(collection(db, 'trivia_answers'), {
                team: team,
                question: 'bonus',
                answer: answer,
                timestamp: new Date()
            });
            
            showMessage('Bonus answer submitted successfully!', 'success');
            
            // Disable form
            form.style.display = 'none';
            
            // Show completion message
            setTimeout(() => {
                document.querySelector('.container').innerHTML = `
                    <div class="team-header">
                        <div class="team-name">${getTeamEmoji(team)} ${teamDisplayName}</div>
                    </div>
                    <div style="text-align: center; padding: 40px;">
                        <h2 style="color: ${getTeamColor(team)}; margin-bottom: 20px;">🎯 Bonus Answer Submitted!</h2>
                        <p style="font-size: 1.2rem; color: #333;">
                            Your fate is now in the hands of the judges!<br>
                            Good luck, ${teamDisplayName}! 🤞
                        </p>
                    </div>
                `;
            }, 2000);
            
        } catch (error) {
            console.error('Error submitting answer:', error);
            showMessage('Error submitting answer. Please try again.', 'error');
        }
    });
};

// Check if bonus question is revealed
function checkBonusRevealed() {
    const gameStateRef = doc(db, 'game_control', 'current_state');
    onSnapshot(gameStateRef, (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            if (data.state === 'bonus') {
                // Show bonus question
                document.getElementById('waitingMessage').style.display = 'none';
                document.getElementById('bonusContainer').classList.remove('hidden');
            } else {
                // Hide bonus question
                document.getElementById('waitingMessage').style.display = 'block';
                document.getElementById('bonusContainer').classList.add('hidden');
            }
        }
    });
}

// Show message function
function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message ${type}-message`;
    message.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            message.style.display = 'none';
        }, 5000);
    }
}

// Helper functions
function getTeamEmoji(team) {
    return team === 'girls' ? '💃' : '🕺';
}

function getTeamColor(team) {
    return team === 'girls' ? '#ff6b6b' : '#4ecdc4';
}

// Export for use in other files
window.showMessage = showMessage;
