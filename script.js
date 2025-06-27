// Performance Optimized Profile Picture Fade-in Animation
// This version uses requestAnimationFrame and modern techniques for better performance

document.addEventListener('DOMContentLoaded', function() {
    const profileCircle = document.querySelector('.profile-circle');
    
   
    let animationId = null;
    let startTime = null;
    const duration = 3000; 
    
    // Use transform3d to enable hardware acceleration
    profileCircle.style.opacity = '0';
    profileCircle.style.transform = 'scale3d(0.8, 0.8, 1)';
    profileCircle.style.willChange = 'opacity, transform'; 
    profileCircle.style.transition = 'none';
    

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    
   
    function animate(currentTime) {
       
        if (!startTime) {
            startTime = currentTime;
        }
        
       
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        
        const easedProgress = easeOutCubic(progress);
        
       
        const opacity = easedProgress;
        const scale = 0.8 + (easedProgress * 0.2); 
        
        
        profileCircle.style.cssText = `
            opacity: ${opacity};
            transform: scale3d(${scale}, ${scale}, 1);
            will-change: opacity, transform;
            transition: none;
        `;
        
        
        if (progress < 1) {
            animationId = requestAnimationFrame(animate);
        } else {
            
            completeAnimation();
        }
    }
    
    // Cleanup function
    function completeAnimation() {
        
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        
        profileCircle.style.cssText = `
            opacity: 1;
            transform: scale3d(1, 1, 1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: auto;
        `;
        
        console.log('Optimized fade-in animation completed');
    }
    
    // Use Intersection Observer for performance (only animate when visible)
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                   
                    observer.unobserve(entry.target);
                    requestAnimationFrame(animate);
                }
            });
        }, {
            rootMargin: '50px' 
        });
        
        observer.observe(profileCircle);
    } else {
       
        requestAnimationFrame(animate);
    }
    
    // Performance monitoring (optional - remove in production)
    if (typeof performance !== 'undefined' && performance.mark) {
        performance.mark('profile-animation-start');
        
        const originalComplete = completeAnimation;
        completeAnimation = function() {
            performance.mark('profile-animation-end');
            performance.measure('profile-animation-duration', 'profile-animation-start', 'profile-animation-end');
            originalComplete();
        };
    }
    
    // Cleanup on page unload to prevent memory leaks
    window.addEventListener('beforeunload', function() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
});