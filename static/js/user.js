// Animate cards on scroll with improved animations
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card, .info-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(card);
    });

    // Enhanced form submission with validation and feedback
    const reportForm = document.getElementById('reportForm');
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const fraudType = document.getElementById('fraudType').value;
        const description = document.getElementById('description').value.trim();
        
        // Enhanced form validation
        if (!name || !fraudType || !description) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('Submitting report...', 'info');
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Report submitted successfully!', 'success');
            reportForm.reset();
        }, 1500);
    });

    // Handle health question responses with enhanced feedback
    const questions = document.querySelectorAll('.question');
    questions.forEach(question => {
        const yesBtn = question.querySelector('.yes-btn');
        const noBtn = question.querySelector('.no-btn');
        
        [yesBtn, noBtn].forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from both buttons
                yesBtn.classList.remove('active');
                noBtn.classList.remove('active');
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Enhanced button animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);

                // Show feedback
                const response = this.classList.contains('yes-btn') ? 'Yes' : 'No';
                showNotification(`Response recorded: ${response}`, 'info');
            });
        });
    });
});

// Smooth scrolling with enhanced behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px 24px',
        borderRadius: '8px',
        backgroundColor: type === 'error' ? '#ff4444' : 
                       type === 'success' ? '#00C851' : 
                       type === 'info' ? '#33b5e5' : '#ffbb33',
        color: 'white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: '1000',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all 0.3s ease'
    });

    // Add to DOM
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}