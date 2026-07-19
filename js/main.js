// Theme Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const icon = themeToggle.querySelector('i');
const body = document.body;

// Default to dark mode unless light mode is explicitly saved
if (localStorage.getItem('theme') === 'light') {
    body.classList.remove('dark-mode');
    icon.classList.replace('fa-sun', 'fa-moon');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if(body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        localStorage.setItem('theme', 'light');
        icon.classList.replace('fa-sun', 'fa-moon');
    }
});

// Navbar Scroll Transition
const navbar = document.getElementById('navbar-main');
const handleScroll = () => {
    if (window.scrollY > 30) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
};
window.addEventListener('scroll', handleScroll);
handleScroll();

// Firebase Logic
const firebaseConfig = {
    apiKey: "AIzaSyCNQ0W-qYslgV5sLYQkP2M7lYYLJXorhoA",
    authDomain: "hemangir-portfolio.firebaseapp.com",
    projectId: "hemangir-portfolio",
    storageBucket: "hemangir-portfolio.firebasestorage.app",
    messagingSenderId: "730216664742",
    appId: "1:730216664742:web:fb396c98ee235a75152e67",
    measurementId: "G-KE2ZDCVBK6"
};

// Initialize Firebase using Global Compat SDK
let db = null;
if (typeof firebase !== 'undefined') {
    const app = firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
}

const contactForm = document.getElementById('contactForm');
const statusMessage = document.getElementById('statusMessage');

if(contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;

        btn.innerText = 'Sending...';
        btn.disabled = true;
        statusMessage.innerHTML = '';

        try {
            // 1. Save to Firestore (backup)
            if (db) {
                await db.collection('messages').add({ name, email, message, timestamp: new Date() });
            }

            // 2. Send email via Web3Forms (FREE - https://web3forms.com)
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: "ab487a99-1d01-4dd3-98b4-50910499d7af",
                    name: name,
                    email: email,
                    message: message,
                    subject: "New Portfolio Message from " + name,
                    from_name: "Portfolio Contact Form"
                })
            });

            const result = await response.json();
            if (result.success) {
                statusMessage.innerHTML = '<span class="text-success">Message sent successfully!</span>';
                contactForm.reset();
            } else {
                console.error("Web3Forms error:", result);
                throw new Error(result.message || 'Failed to send');
            }
        } catch (error) {
            console.error(error);
            statusMessage.innerHTML = '<span class="text-danger">Error sending message. Please try again.</span>';
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
}

// Project Filtering Logic
const filterBtns = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectItems.forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.classList.remove('hidden');
                // Trigger a small fade-in transition
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 50);
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

// Auto-close mobile navbar on link click
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });
});



