class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.today = new Date();
        this.monthNames = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        this.init();
    }
    
    init() {
        this.render();
        this.attachEventListeners();
        this.loadEventsForMonth();
    }
    
    attachEventListeners() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                this.render();
                this.loadEventsForMonth();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                this.render();
                this.loadEventsForMonth();
            });
        }
    }
    
    loadEventsForMonth() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth() + 1;
        
        fetch(`/get-events?month=${month}&year=${year}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            this.updateEventsList(data.events);
        })
        .catch(error => {
            console.error('Error loading events:', error);
            this.updateEventsList([]);
        });
    }
    
    updateEventsList(events) {
        const eventsContainer = document.querySelector('.calendar-events');
        if (!eventsContainer) return;
        
        const eventItems = eventsContainer.querySelectorAll('.event-item');
        eventItems.forEach(item => item.remove());
        
        let eventsTitle = eventsContainer.querySelector('h4');
        if (!eventsTitle) {
            eventsTitle = document.createElement('h4');
            eventsTitle.textContent = 'Kegiatan Mendatang';
            eventsContainer.appendChild(eventsTitle);
        }
        
        if (events.length === 0) {
            const emptyEvent = document.createElement('div');
            emptyEvent.className = 'event-item';
            emptyEvent.innerHTML = '<div class="event-title">Tidak ada kegiatan bulan ini</div>';
            eventsContainer.appendChild(emptyEvent);
        } else {
            events.forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                
                const eventDate = new Date(event.date);
                const formattedDate = eventDate.toLocaleDateString('id-ID', { 
                    day: 'numeric', 
                    month: 'short' 
                });
                
                eventItem.innerHTML = `
                    <div class="event-date">${formattedDate}</div>
                    <div class="event-title">${event.title}</div>
                    ${event.location ? `<div class="event-location">${event.location}</div>` : ''}
                `;
                
                eventsContainer.appendChild(eventItem);
            });
        }
    }
    
    render() {
        const monthElement = document.getElementById('currentMonth');
        if (!monthElement) return;
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        monthElement.textContent = `${this.monthNames[month]} ${year}`;
        this.generateCalendar(year, month);
    }
    
    generateCalendar(year, month) {
        const calendarGrid = document.querySelector('.calendar-grid');
        if (!calendarGrid) return;
        
        const existingDays = calendarGrid.querySelectorAll('.calendar-day:not(.header)');
        existingDays.forEach(day => day.remove());
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            if (year === this.today.getFullYear() && 
                month === this.today.getMonth() && 
                day === this.today.getDate()) {
                dayElement.classList.add('today');
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
}
class AnnouncementModal {
    constructor() {
        this.modal = document.getElementById('announcementModal');
        this.init();
    }
    
    init() {
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        document.addEventListener('click', (e) => {
            const announcementItem = e.target.closest('.announcement-item[data-announcement-id]');
            if (announcementItem) {
                const announcementId = announcementItem.dataset.announcementId;
                this.showModal(announcementId);
            }
        });
        const closeBtn = this.modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideModal();
            });
        }
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.hideModal();
            }
        });
    }
    
    showModal(announcementId) {
        this.modal.style.display = 'block';
        this.showLoading();
        fetch(`/announcement/${announcementId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.populateModal(data.data);
            } else {
                this.showError(data.message || 'Terjadi kesalahan saat memuat data');
            }
        })
        .catch(error => {
            console.error('Error fetching announcement:', error);
            this.showError('Terjadi kesalahan saat memuat data');
        });
    }
    
    hideModal() {
        this.modal.style.display = 'none';
        this.clearModal();
    }
    
    showLoading() {
        const modalBody = this.modal.querySelector('.modal-body');
        modalBody.innerHTML = '<div class="modal-loading">Memuat data...</div>';
        const modalTitle = this.modal.querySelector('#modalTitle');
        modalTitle.textContent = 'Memuat...';
    }
    
    showError(message) {
        const modalBody = this.modal.querySelector('.modal-body');
        modalBody.innerHTML = `<div class="modal-error">❌ ${message}</div>`;
        const modalTitle = this.modal.querySelector('#modalTitle');
        modalTitle.textContent = 'Error';
    }
    
    populateModal(data) {
        const modalTitle = this.modal.querySelector('#modalTitle');
        modalTitle.textContent = data.title;
        const modalBody = this.modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="modal-icon-container">
                <span id="modalIcon">${data.icon}</span>
            </div>
            <div class="modal-content-text">
                <p id="modalContent">${data.content}</p>
            </div>
            <div class="modal-footer">
                <div class="modal-date-info">
                    <small>Diposting: <span id="modalCreatedDate">${data.created_at}</span></small>
                    <small>Diperbarui: <span id="modalUpdatedDate">${data.updated_at}</span></small>
                </div>
            </div>
        `;
    }
    
    clearModal() {
        const modalTitle = this.modal.querySelector('#modalTitle');
        const modalBody = this.modal.querySelector('.modal-body');
        
        if (modalTitle) modalTitle.textContent = '';
        if (modalBody) modalBody.innerHTML = '';
    }
}
document.addEventListener('DOMContentLoaded', function() {
    new Calendar();
    new AnnouncementModal();
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
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                const increment = target / 100;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.ceil(current);
                    }
                }, 20);
                
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/300x200/6c757d/ffffff?text=Gambar+Tidak+Tersedia';
        });
    });
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(45deg, #1e3c72, #2a5298);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;
    
    scrollButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    const handlePaginationClick = function(event) {
        if (event.target.classList.contains('page-link')) {
            const href = event.target.getAttribute('href');
            if (href && href.includes('facilities')) {
                setTimeout(() => {
                    document.querySelector('.facilities-section').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            } else if (href && href.includes('docs')) {
                setTimeout(() => {
                    document.querySelector('.dokumentasi-section').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            } else if (href && href.includes('announcements')) {
                setTimeout(() => {
                    document.querySelector('.announcement-widget').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        }
    };
    document.querySelectorAll('.pagination-wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', handlePaginationClick);
    });



















let currentSlideIndex = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dot');
const totalSlides = slides.length;
let slideInterval;

// Extract slide data from HTML elements
let heroSlidesData = [];

// Initialize slider data from DOM
function initSlideData() {
    heroSlidesData = [];
    
    // Get data from dots if available
    if (dots.length > 0) {
        dots.forEach(dot => {
            heroSlidesData.push({
                title: dot.getAttribute('data-title') || '',
                subtitle: dot.getAttribute('data-subtitle') || ''
            });
        });
    } else {
        // Fallback: get initial text from hero elements
        const titleElement = document.getElementById('hero-title');
        const subtitleElement = document.getElementById('hero-subtitle');
        
        heroSlidesData.push({
            title: titleElement ? titleElement.textContent : '',
            subtitle: subtitleElement ? subtitleElement.textContent : ''
        });
    }
}

// Initialize slider
function initSlider() {
    initSlideData();
    showSlide(currentSlideIndex);
    if (totalSlides > 1) {
        startAutoSlide();
    }
}

// Show specific slide
function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    if (dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
    }

    // Add active class to current slide and dot
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (dots.length > 0 && dots[index]) {
        dots[index].classList.add('active');
    }
    
    // Update text content
    updateHeroText(index);
}

// Update hero text based on current slide
function updateHeroText(index) {
    const titleElement = document.getElementById('hero-title');
    const subtitleElement = document.getElementById('hero-subtitle');
    
    if (heroSlidesData[index] && titleElement) {
        titleElement.textContent = heroSlidesData[index].title;
        
        if (subtitleElement) {
            if (heroSlidesData[index].subtitle) {
                subtitleElement.textContent = heroSlidesData[index].subtitle;
                subtitleElement.style.display = 'block';
            } else {
                subtitleElement.style.display = 'none';
            }
        }
    }
}

// Next slide
function nextSlide() {
    if (totalSlides > 1) {
        currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
        showSlide(currentSlideIndex);
    }
}

// Previous slide
function prevSlide() {
    if (totalSlides > 1) {
        currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
        showSlide(currentSlideIndex);
    }
}

// Go to specific slide
function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
        currentSlideIndex = index;
        showSlide(currentSlideIndex);
        if (totalSlides > 1) {
            resetAutoSlide();
        }
    }
}

// Start automatic sliding
function startAutoSlide() {
    if (totalSlides > 1) {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
}

// Stop automatic sliding
function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

// Reset automatic sliding  
function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// Global functions for button clicks
window.changeSlide = function(direction) {
    if (direction === 1) {
        nextSlide();
    } else {
        prevSlide();
    }
    if (totalSlides > 1) {
        resetAutoSlide();
    }
};

window.currentSlide = function(index) {
    goToSlide(index - 1); // Convert to 0-based index
};

// Pause slider on hover
const heroSection = document.querySelector('.hero-section');
if (heroSection && totalSlides > 1) {
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (totalSlides > 1) {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (heroSection && totalSlides > 1) {
    heroSection.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    heroSection.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            changeSlide(1);
        } else {
            // Swipe right - previous slide
            changeSlide(-1);
        }
    }
}

// Preload images for better performance
function preloadImages() {
    slides.forEach(slide => {
        const bgImage = slide.style.backgroundImage;
        if (bgImage) {
            const imageUrl = bgImage.slice(4, -1).replace(/"/g, "");
            const img = new Image();
            img.src = imageUrl;
        }
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
    initSlider();
});

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // Do nothing, DOMContentLoaded will fire
} else {
    // DOM already loaded
    preloadImages();
    initSlider();
}
});
        // Enhanced Visitor Statistics Class
        class VisitorStats {
            constructor() {
                this.liveCounterElement = document.getElementById('liveCounter');
                this.stats = this.generateRealisticStats();
                this.baseOnlineCount = this.stats.online;
                this.currentOnlineCount = this.baseOnlineCount;
                this.updateInterval = null;
                this.animationInterval = null;
                
                this.init();
            }
            
            // Generate realistic visitor statistics
            generateRealisticStats() {
                const now = new Date();
                const currentHour = now.getHours();
                const currentDay = now.getDate();
                const currentMonth = now.getMonth() + 1;
                const currentYear = now.getFullYear();
                
                // Base numbers for a realistic website
                const baseDaily = Math.floor(Math.random() * 500) + 200; // 200-700 daily
                const baseMonthly = Math.floor(Math.random() * 8000) + 12000; // 12k-20k monthly
                const baseTotal = Math.floor(Math.random() * 150000) + 250000; // 250k-400k total
                
                // Adjust based on time of day for online users
                let onlineMultiplier;
                if (currentHour >= 9 && currentHour <= 17) {
                    onlineMultiplier = 1.2; // Peak hours
                } else if (currentHour >= 19 && currentHour <= 22) {
                    onlineMultiplier = 1.5; // Evening peak
                } else {
                    onlineMultiplier = 0.6; // Off hours
                }
                
                const baseOnline = Math.floor((Math.random() * 40 + 25) * onlineMultiplier); // 15-95 online
                
                // Add some randomness to make it more realistic
                const variations = {
                    total: Math.floor(Math.random() * 5000) - 2500,
                    monthly: Math.floor(Math.random() * 1000) - 500,
                    daily: Math.floor(Math.random() * 50) - 25,
                    online: Math.floor(Math.random() * 10) - 5
                };
                
                return {
                    total: Math.max(baseTotal + variations.total, 100000),
                    monthly: Math.max(baseMonthly + variations.monthly, 5000),
                    daily: Math.max(baseDaily + variations.daily, 50),
                    online: Math.max(baseOnline + variations.online, 10)
                };
            }
            
            init() {
                this.setInitialValues();
                this.startLiveCounter();
                this.initVisitorCounters();
                this.simulateRealTimeUpdates();
            }
            
            // Set initial values to the generated stats
            setInitialValues() {
                const counters = document.querySelectorAll('.visitor-stat-number.counter');
                const stats = [this.stats.total, this.stats.monthly, this.stats.daily, this.stats.online];
                
                counters.forEach((counter, index) => {
                    counter.dataset.target = stats[index];
                });
                
                // Set live counter initial value
                if (this.liveCounterElement) {
                    this.liveCounterElement.textContent = this.stats.online;
                }
            }
            
            // Initialize visitor counter animations with improved timing
            initVisitorCounters() {
                const visitorCounters = document.querySelectorAll('.visitor-stat-number.counter');
                
                const visitorCounterObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const counter = entry.target;
                            const target = parseInt(counter.dataset.target);
                            
                            // Add delay based on card position
                            const cards = Array.from(document.querySelectorAll('.visitor-stat-card'));
                            const cardIndex = cards.findIndex(card => card.contains(counter));
                            const delay = cardIndex * 200;
                            
                            setTimeout(() => {
                                this.animateCounter(counter, target);
                            }, delay);
                            
                            visitorCounterObserver.unobserve(counter);
                        }
                    });
                }, { threshold: 0.3 });
                
                visitorCounters.forEach(counter => {
                    visitorCounterObserver.observe(counter);
                });
            }
            
            // Enhanced counter animation with easing
            animateCounter(element, target) {
                element.classList.add('counting');
                
                const duration = 2500;
                const startTime = Date.now();
                
                const updateCounter = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function for smooth animation
                    const easedProgress = this.easeOutQuart(progress);
                    const current = Math.floor(target * easedProgress);
                    
                    element.textContent = this.formatNumber(current);
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        element.classList.remove('counting');
                        element.textContent = this.formatNumber(target);
                    }
                };
                
                requestAnimationFrame(updateCounter);
            }
            
            // Easing function for smooth animation
            easeOutQuart(t) {
                return 1 - Math.pow(1 - t, 4);
            }
            
            // Format number with Indonesian locale
            formatNumber(num) {
                return num.toLocaleString('id-ID');
            }
            
            // Enhanced live counter with better animations
            startLiveCounter() {
                if (!this.liveCounterElement) return;
                
                this.updateInterval = setInterval(() => {
                    this.updateLiveCounter();
                }, 4000);
                
                this.animationInterval = setInterval(() => {
                    this.animateLiveCounter();
                }, 3000);
            }
            
            // Improved live counter updates with realistic patterns
            updateLiveCounter() {
                const now = new Date();
                const currentHour = now.getHours();
                
                // Different patterns based on time
                let changeRange;
                if (currentHour >= 9 && currentHour <= 17) {
                    changeRange = [-2, 5]; // Mostly increasing during work hours
                } else if (currentHour >= 19 && currentHour <= 22) {
                    changeRange = [-3, 7]; // Peak evening hours
                } else if (currentHour >= 0 && currentHour <= 6) {
                    changeRange = [-5, 1]; // Mostly decreasing at night
                } else {
                    changeRange = [-3, 3]; // Balanced other times
                }
                
                const change = Math.floor(Math.random() * (changeRange[1] - changeRange[0] + 1)) + changeRange[0];
                const newCount = Math.max(8, Math.min(120, this.currentOnlineCount + change));
                
                this.currentOnlineCount = newCount;
                
                if (this.liveCounterElement) {
                    // Enhanced animation sequence
                    this.liveCounterElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    this.liveCounterElement.style.transform = 'scale(1.15) rotateY(10deg)';
                    this.liveCounterElement.style.textShadow = '0 4px 30px rgba(16, 185, 129, 0.6)';
                    
                    setTimeout(() => {
                        this.liveCounterElement.textContent = newCount;
                        this.liveCounterElement.style.transform = 'scale(1) rotateY(0deg)';
                        this.liveCounterElement.style.textShadow = '0 4px 20px rgba(16, 185, 129, 0.4)';
                    }, 150);
                }
            }
            
            // Enhanced live counter animation
            animateLiveCounter() {
                if (!this.liveCounterElement) return;
                
                const originalShadow = this.liveCounterElement.style.textShadow;
                this.liveCounterElement.style.textShadow = '0 4px 40px rgba(16, 185, 129, 0.8)';
                
                setTimeout(() => {
                    this.liveCounterElement.style.textShadow = originalShadow || '0 4px 20px rgba(16, 185, 129, 0.4)';
                }, 800);
            }
            
            // Enhanced real-time updates simulation with realistic increments
            simulateRealTimeUpdates() {
                setInterval(() => {
                    this.updateDailyStats();
                }, 20000); // Every 20 seconds for more activity
            }
            
            updateDailyStats() {
                const now = new Date();
                const currentHour = now.getHours();
                
                // More realistic update patterns
                const updates = [
                    {
                        selector: '.visitor-stat-card:nth-child(3) .visitor-stat-number', // Daily
                        increment: () => {
                            if (currentHour >= 9 && currentHour <= 17) {
                                return Math.floor(Math.random() * 8) + 3; // 3-10 during work hours
                            } else if (currentHour >= 19 && currentHour <= 22) {
                                return Math.floor(Math.random() * 12) + 5; // 5-16 evening peak
                            } else {
                                return Math.floor(Math.random() * 3) + 1; // 1-3 off hours
                            }
                        },
                        chance: 0.7 // 70% chance to update
                    },
                    {
                        selector: '.visitor-stat-card:nth-child(2) .visitor-stat-number', // Monthly
                        increment: () => Math.floor(Math.random() * 15) + 8, // 8-22
                        chance: 0.4 // 40% chance
                    },
                    {
                        selector: '.visitor-stat-card:nth-child(1) .visitor-stat-number', // Total
                        increment: () => Math.floor(Math.random() * 25) + 10, // 10-34
                        chance: 0.2 // 20% chance
                    }
                ];
                
                updates.forEach(update => {
                    if (Math.random() < update.chance) {
                        const element = document.querySelector(update.selector);
                        if (element) {
                            const current = parseInt(element.textContent.replace(/[.,]/g, ''));
                            const increment = update.increment();
                            const newValue = current + increment;
                            
                            this.animateStatUpdate(element, newValue);
                        }
                    }
                });
                
                // Update online counter's reference in the 4th card occasionally
                if (Math.random() < 0.3) {
                    const onlineStatElement = document.querySelector('.visitor-stat-card:nth-child(4) .visitor-stat-number');
                    if (onlineStatElement) {
                        const variation = Math.floor(Math.random() * 6) - 3; // -3 to +3
                        const newOnlineRef = Math.max(this.currentOnlineCount + variation, 5);
                        this.animateStatUpdate(onlineStatElement, newOnlineRef);
                    }
                }
            }
            
            animateStatUpdate(element, newValue) {
                element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                element.style.transform = 'scale(1.1)';
                element.style.color = '#667eea';
                
                setTimeout(() => {
                    element.textContent = this.formatNumber(newValue);
                    element.dataset.target = newValue;
                    element.style.transform = 'scale(1)';
                    element.style.color = '#1f2937';
                }, 200);
            }
            
            destroy() {
                if (this.updateInterval) clearInterval(this.updateInterval);
                if (this.animationInterval) clearInterval(this.animationInterval);
            }
        }

        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            if (document.querySelector('.visitor-stats-section')) {
                window.visitorStats = new VisitorStats();
            }
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            if (window.visitorStats) {
                window.visitorStats.destroy();
            }
        });