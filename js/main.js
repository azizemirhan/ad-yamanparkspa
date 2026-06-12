document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Header Scroll Event
    const header = document.querySelector('.main-header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on load
    
    // 2. Mobile Drawer Navigation Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const drawer = document.querySelector('.mobile-drawer');
    const drawerClose = document.querySelector('.drawer-close');
    const overlay = document.querySelector('.drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-nav a');
    
    const openDrawer = () => {
        drawer.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Disable scroll behind drawer
    };
    
    const closeDrawer = () => {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = ''; // Re-enable scroll
    };
    
    if (menuToggle) menuToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
    
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // 3. Mobile Bottom Navigation Active Class Handler
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    
    bottomNavItems.forEach(item => {
        const link = item.querySelector('.bottom-nav-link');
        link.addEventListener('click', (e) => {
            // Remove active class from all items
            bottomNavItems.forEach(navItem => navItem.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
        });
    });

    // 4. Smooth Scroll for all anchors
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile drawer just in case
                closeDrawer();
                
                const headerOffset = window.innerWidth <= 768 ? 70 : 90;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update bottom menu active status matching target element if it exists in navigation
                const correspondingBottomItem = Array.from(bottomNavItems).find(item => {
                    const itemLink = item.querySelector('.bottom-nav-link');
                    return itemLink.getAttribute('href') === targetId;
                });
                
                if (correspondingBottomItem) {
                    bottomNavItems.forEach(navItem => navItem.classList.remove('active'));
                    correspondingBottomItem.classList.add('active');
                }
            }
        });
    });

    // 5. Active state sync on page scroll
    const sections = document.querySelectorAll('section[id], main[id]');
    
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + (window.innerHeight / 3);
        let matched = false;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Desktop nav update
                const activeDesktopLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
                if (activeDesktopLink) {
                    document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
                    activeDesktopLink.classList.add('active');
                    matched = true;
                }
                
                // Mobile bottom nav update
                const activeBottomItem = Array.from(bottomNavItems).find(item => {
                    const bottomLink = item.querySelector('.bottom-nav-link');
                    if (!bottomLink) return false;
                    const href = bottomLink.getAttribute('href');
                    return href === `#${sectionId}` || href === `index.html#${sectionId}`;
                });
                
                if (activeBottomItem) {
                    bottomNavItems.forEach(navItem => navItem.classList.remove('active'));
                    activeBottomItem.classList.add('active');
                }
            }
        });

        // Fallback for services page top scroll
        if (!matched && document.body.classList.contains('services-page')) {
            const masajlarSection = document.getElementById('masajlar');
            if (masajlarSection && window.scrollY < masajlarSection.offsetTop - 150) {
                document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
                const servicesLink = document.querySelector('.nav-menu a[href="hizmetler.html"]');
                if (servicesLink) servicesLink.classList.add('active');
                
                // Active Hizmetler in bottom nav
                bottomNavItems.forEach(navItem => navItem.classList.remove('active'));
                const servicesBottomItem = Array.from(bottomNavItems).find(item => {
                    const link = item.querySelector('.bottom-nav-link');
                    return link && link.getAttribute('href').includes('hizmetler.html');
                });
                if (servicesBottomItem) servicesBottomItem.classList.add('active');
            }
        }
    };
    
    window.addEventListener('scroll', scrollSpy);

    // 6. Accordion Functionality for Massage Terapileri
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    // Initialize active accordion item height
    const initAccordion = () => {
        accordionItems.forEach(item => {
            const body = item.querySelector('.accordion-body');
            if (item.classList.contains('active')) {
                body.style.maxHeight = body.scrollHeight + 'px';
            } else {
                body.style.maxHeight = '0px';
            }
        });
    };
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-body').style.maxHeight = '0px';
            });
            
            // If the clicked item was not active, open it
            if (!isActive) {
                item.classList.add('active');
                const body = item.querySelector('.accordion-body');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });
    
    // Recalculate heights on resize to prevent cutoff issues
    window.addEventListener('resize', () => {
        accordionItems.forEach(item => {
            if (item.classList.contains('active')) {
                const body = item.querySelector('.accordion-body');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });

    initAccordion();

    // 7. Form Submission Handler
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const service = document.getElementById('form-service').options[document.getElementById('form-service').selectedIndex].text;
            const date = document.getElementById('form-date').value;
            const time = document.getElementById('form-time').value;
            
            // Format Turkish Date
            const formattedDate = new Date(date).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            // Simulate booking confirmation dialog
            alert(`Sayın ${name},\n\n${service} randevu talebiniz alınmıştır.\n\nTarih: ${formattedDate}\nSaat: ${time}\n\nEn kısa sürede +90 533 000 00 00 numaramızdan onay için sizinle iletişime geçeceğiz. Teşekkür ederiz!`);
            
            // Reset form
            appointmentForm.reset();
        });
    }

    // 8. Demo Notice Bar Close Handler
    const noticeBar = document.querySelector('.demo-notice-bar');
    const noticeClose = document.querySelector('.notice-close');
    
    if (noticeBar && noticeClose) {
        // Check if user previously closed it in this session
        if (sessionStorage.getItem('demoNoticeClosed') === 'true') {
            noticeBar.style.display = 'none';
            document.body.classList.add('demo-banner-hidden');
        } else {
            document.body.classList.add('demo-banner-visible');
        }

        noticeClose.addEventListener('click', () => {
            noticeBar.classList.add('hide');
            document.body.classList.remove('demo-banner-visible');
            document.body.classList.add('demo-banner-hidden');
            sessionStorage.setItem('demoNoticeClosed', 'true');
            
            // Wait for transition to finish before hiding display
            setTimeout(() => {
                noticeBar.style.display = 'none';
            }, 300);
        });
    }
});
