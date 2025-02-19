// DOM Elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');


function positionEmojis() {
    const emojis = document.querySelectorAll('.emoji');
    const usedPositions = [];
    const padding = 5; // Minimum spacing from edges
    const minDistance = 10; // Minimum distance between emojis (in percentage)

    emojis.forEach((emoji) => {
        let x, y;
        let attempts = 0;
        const maxAttempts = 200;

        // Find a non-overlapping position with a minimum distance
        do {
            x = Math.random() * (100 - padding * 2) + padding;
            y = Math.random() * (100 - padding * 2) + padding;
            attempts++;
        } while (
            usedPositions.some(pos => getDistance(x, y, pos.x, pos.y) < minDistance) &&
            attempts < maxAttempts
        );

        usedPositions.push({ x, y });

        // Apply styles
        emoji.style.position = 'absolute';
        emoji.style.top = `${y}%`;
        emoji.style.left = `${x}%`;
        emoji.style.fontSize = `${1 + Math.random() * 2}rem`;
        emoji.style.opacity = '0.8';
        emoji.style.animation = `floatAnimation ${10 + Math.random() * 10}s infinite ease-in-out alternate`;
    });
}

// Calculate distance between two points
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Call function on load and resize
window.addEventListener('load', positionEmojis);
window.addEventListener('resize', positionEmojis);



// Cohere API Configuration


// Function to add message to chat box
function addMessageToChat(message, isUser) {
    if (!message) return;

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Event listener for send button
sendBtn.addEventListener('click', () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessageToChat(userMessage, true);
        userInput.value = '';
        
        // Call Cohere API
        getBotResponse(userMessage)
            .then(response => {
                addMessageToChat(response, false);
            })
            .catch(error => {
                console.error('Error:', error);
                addMessageToChat("Ugh, I'm too emotional to respond right now. 🙄", false);
            });
    }
});

// Allow pressing Enter to send message
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

// Function to get bot response from Cohere API
async function getBotResponse(userMessage) {
    try {
        const response = await fetch(COHERE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${COHERE_API_KEY}`
            },
            body: JSON.stringify({
                message: userMessage,
                model: 'command',
                temperature: 0.9, // Higher temperature for more dramatic responses
                max_tokens: 100,
                preamble: `You are a dramatic ex-partner. Respond in an overly emotional and dramatic way. Use emojis and exaggerated language.`
            })
        });

        const data = await response.json();
        return data.text || "I'm too emotional to respond right now... 😭";
    } catch (error) {
        throw error;
    }
}
