// js/script.js
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
    
    // Trigger animation for elements already in viewport on load
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight) {
                el.classList.add('is-visible');
            }
        });
    }, 100);

    // Dynamic catalog loading
    const catalogGrid = document.getElementById('dynamic-catalog');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (catalogGrid) {
        const categories = ['topotushki', 'wreaths', 'bowls', 'birds', 'hedgehogs', 'babki', 'mice', 'frogs'];
        let hasLoadedAny = false;
        
        Promise.all(categories.map(category => {
            return fetch(`images/${category}/${category}.txt`)
                .then(res => {
                    if (!res.ok) throw new Error('Not found');
                    return res.text();
                })
                .then(text => {
                    const lines = text.trim().split('\n');
                    lines.forEach(line => {
                        if (!line.trim()) return;
                        const parts = line.split('\t');
                        if (parts.length >= 3) {
                            const filename = parts[0];
                            const name = parts[1];
                            const price = parts[2];
                            
                            const article = document.createElement('article');
                            article.className = 'product-card animate-on-scroll fade-up is-visible';
                            article.setAttribute('data-category', category);
                            
                            article.innerHTML = `
                                <div class="product-image-wrapper">
                                    <div class="product-placeholder" style="background: url('images/${category}/${filename}') center/cover;"></div>
                                </div>
                                <div class="product-info">
                                    <h3 class="product-name">${name}</h3>
                                    <span class="product-price">${price}</span>
                                </div>
                            `;
                            catalogGrid.appendChild(article);
                            hasLoadedAny = true;
                        }
                    });
                })
                .catch(err => {
                    console.log('Category empty or not found:', category);
                });
        })).then(() => {
            if (!hasLoadedAny) {
                catalogGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--light-text);">Для локального просмотра (без сервера) используйте расширение Live Server или Firefox, так как браузеры блокируют CORS при загрузке локальных текстовых файлов. Либо откройте сайт на Github Pages.</p>';
            }
        });
        
        if (filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filterValue = btn.getAttribute('data-filter');
                    const productCards = document.querySelectorAll('.catalog-grid .product-card');

                    productCards.forEach(card => {
                        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
        }
    }
});
