document.addEventListener('DOMContentLoaded', function() {
    const texts = [
        "Yayasan Pendidikan Islam Purnama Cendekia",
        "Sekolah Penggerak dengan Nilai Islami",
        "Generasi Qur'ani yang Berkarakter",
        "Akreditasi A - Unggul di Jakarta Barat",
        "TKIT, SDIT, dan SMPIT Al Qomar",
        "Tahfidz Qur'an dan Metode Ummi",
        "550 Siswa Berprestasi Nasional",
        "Berdiri Sejak 1991 - 30+ Tahun",
        "Kurikulum Merdeka dan Guru Penggerak",
        "Fasilitas Lengkap dan Modern"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let typeSpeed = 100;
    
    function typeWriter() {
        const typewriterElement = document.getElementById('typewriter');
        if (!typewriterElement) {
            console.error('Element dengan ID "typewriter" tidak ditemukan');
            return;
        }
        
        const fullText = texts[textIndex];
        
        if (isDeleting) {
            currentText = fullText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; 
        } else {
            currentText = fullText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; 
        }
        
        typewriterElement.textContent = currentText;
        if (charIndex === fullText.length && !isDeleting) {
            typewriterElement.innerHTML = currentText + '<span class="cursor">|</span>';
        } else if (isDeleting && charIndex === 0) {
            typewriterElement.innerHTML = currentText + '<span class="cursor">|</span>';
        } else {
            typewriterElement.innerHTML = currentText + '<span class="cursor">|</span>';
        }
        
        if (!isDeleting && charIndex === fullText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 800; 
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    typeWriter();
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
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);
    document.querySelectorAll('.section-card, .sidebar-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const isNumber = !isNaN(finalValue);
            
            if (isNumber) {
                const targetValue = parseInt(finalValue);
                let currentValue = 0;
                const increment = targetValue / 50; 
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= targetValue) {
                        stat.textContent = targetValue;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(currentValue);
                    }
                }, 30);
            }
        });
    }
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
            }, 100);
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
        });
    });
    document.querySelectorAll('.quick-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    document.querySelectorAll('.schedule-item').forEach((item, index) => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const currentTimeMinutes = currentHour * 60 + currentMinute;
        
        const scheduleTime = item.querySelector('.schedule-time').textContent;
        const [hour, minute] = scheduleTime.split('.').map(num => parseInt(num));
        const scheduleTimeMinutes = hour * 60 + minute;
        if (Math.abs(currentTimeMinutes - scheduleTimeMinutes) <= 30) {
            item.style.background = 'rgba(37, 99, 235, 0.1)';
            item.style.borderLeft = '4px solid var(--primary-color)';
        }
    });
    const fab = document.querySelector('.fab');
    if (fab) {
        fab.style.opacity = '0';
        fab.style.transform = 'scale(0.8)';
    }
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        img.style.opacity = '0';
        img.style.transform = 'scale(0.9)';
        img.style.transition = 'all 0.3s ease';
    });
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    const heroSlides = document.querySelectorAll('.hero-slide');
    
    if (hero) {
        heroSlides.forEach(slide => {
            slide.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    }
    
    ticking = false;
}

function requestParallaxUpdate() {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
}
window.addEventListener('scroll', function() {
    const fab = document.querySelector('.fab');
    if (fab) {
        if (window.scrollY > 500) {
            fab.style.opacity = '1';
            fab.style.transform = 'scale(1)';
        } else {
            fab.style.opacity = '0';
            fab.style.transform = 'scale(0.8)';
        }
    }
    requestParallaxUpdate();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Home') {
        e.preventDefault();
        scrollToTop();
    }
});
window.addEventListener('beforeprint', function() {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing');
});
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && window.innerWidth < 768) {
            heroSection.style.height = '80vh';
        } else if (heroSection) {
            heroSection.style.height = '100vh';
        }
    }, 250);
});