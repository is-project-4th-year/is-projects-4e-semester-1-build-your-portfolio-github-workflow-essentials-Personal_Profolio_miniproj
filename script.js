
// Using basic DOM manipulation and setTimeout

document.addEventListener('DOMContentLoaded', function() {
    const profileImage = document.querySelector('.profile-circle');
    
    // Initially hide the profile image
    profileImage.style.opacity = '0';
    profileImage.style.transform = 'scale(0.8)';
    profileImage.style.transition = 'opacity 1.5s ease-out, transform 1.5s ease-out';
    
    // Function to animate the profile picture
    function animateProfilePicture() {
        // Check if element is in viewport (basic intersection check)
        const rect = profileImage.getBoundingClientRect();
        const isInViewport = (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
        
        if (isInViewport) {
            // Animate in with delay
            setTimeout(() => {
                profileImage.style.opacity = '1';
                profileImage.style.transform = 'scale(1)';
                
                // Add a subtle bounce effect
                setTimeout(() => {
                    profileImage.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        profileImage.style.transform = 'scale(1)';
                    }, 200);
                }, 1000);
                
            }, 500); // 500ms delay before starting animation
            
            // Remove scroll listener once animated
            window.removeEventListener('scroll', animateProfilePicture);
            window.removeEventListener('resize', animateProfilePicture);
        }
    }
    
    // Listen for scroll and resize events
    window.addEventListener('scroll', animateProfilePicture);
    window.addEventListener('resize', animateProfilePicture);
    
    // Initial check in case element is already in viewport
    animateProfilePicture();
    
    // Add hover effects (performance-heavy approach)
    profileImage.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
        this.style.transform = 'scale(1.1) rotate(5deg)';
        this.style.boxShadow = '0 25px 50px rgba(102, 126, 234, 0.5)';
    });
    
    profileImage.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
        this.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.3)';
    });
});