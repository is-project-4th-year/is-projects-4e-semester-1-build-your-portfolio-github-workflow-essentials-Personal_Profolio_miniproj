// Performance-Optimized Profile Picture Fade-in Animation
// Uses Intersection Observer API, requestAnimationFrame, and CSS transforms

class ProfileAnimator {
    constructor() {
        this.profileImage = null;
        this.observer = null;
        this.isAnimated = false;
        this.rafId = null;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.profileImage = document.querySelector('.profile-circle');
        
        if (!this.profileImage) {
            console.warn('Profile image not found');
            return;
        }
        
        this.profileImage.classList.add('profile-fade-initial');
        
        this.createIntersectionObserver();
        
        this.addHoverEffects();
    }
    
    createIntersectionObserver() {
        const options = {
            root: null, 
            rootMargin: '50px',
            threshold: 0.1 
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimated) {
                    this.animateIn();
                }
            });
        }, options);
        
        this.observer.observe(this.profileImage);
    }
    
    animateIn() {
        if (this.isAnimated) return;
        
        this.isAnimated = true;
        
        // Use requestAnimationFrame for smooth animations
        this.rafId = requestAnimationFrame(() => {
            
            setTimeout(() => {
                this.profileImage.classList.add('profile-fade-in');
                
                
                this.profileImage.addEventListener('animationend', this.handleAnimationEnd.bind(this), { once: true });
                
            }, 300); 

        });
        this.observer.disconnect();
    }
    
    handleAnimationEnd(event) {
        if (event.animationName === 'profileFadeIn') {
           
            this.profileImage.classList.add('profile-bounce-in');
        }
    }
    
    addHoverEffects() {
        // Use CSS classes instead of inline styles for better performance
        this.profileImage.addEventListener('mouseenter', this.handleMouseEnter.bind(this), { passive: true });
        this.profileImage.addEventListener('mouseleave', this.handleMouseLeave.bind(this), { passive: true });
    }
    
    handleMouseEnter() {
        this.profileImage.classList.add('profile-hover');
    }
    
    handleMouseLeave() {
        this.profileImage.classList.remove('profile-hover');
    }
    
    // Clean up method for better memory management
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        if (this.profileImage) {
            this.profileImage.removeEventListener('mouseenter', this.handleMouseEnter);
            this.profileImage.removeEventListener('mouseleave', this.handleMouseLeave);
        }
    }
}

// Initialize the animator
const profileAnimator = new ProfileAnimator();

// Clean up on page unload for better memory management
window.addEventListener('beforeunload', () => {
    if (profileAnimator) {
        profileAnimator.destroy();
    }
});