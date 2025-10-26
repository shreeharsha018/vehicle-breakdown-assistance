// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Toggle mobile menu
const toggleBtn = document.querySelector('.toggle-menu');
const nav = document.querySelector('nav ul');

toggleBtn.addEventListener('click', function() {
    nav.classList.toggle('show');
});
