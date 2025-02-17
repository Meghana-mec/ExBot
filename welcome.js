document.getElementById('start-btn').addEventListener('click', function() {
    const loader = document.getElementById('loader');
    const welcomeContent = document.querySelector('.welcome-content');
    
    // Hide welcome content and show loader
    welcomeContent.style.opacity = '0';
    loader.style.display = 'flex';
    
    // After 3 seconds, redirect to chat page
    setTimeout(() => {
        window.location.href = 'bot.html';
    }, 3000);
});
