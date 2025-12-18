console.log('emailjs:', typeof emailjs);

// ==================== CACHE DE ELEMENTOS ====================
const elements = {
    hamburger: document.getElementById('hamburger'),
    nav: document.getElementById('nav'),
    overlay: document.getElementById('overlay'),
    overlayPortfolio: document.getElementById('overlayPortfolio'),
    header: document.querySelector('.bateu_a_cara_e_viu header'),
    body: document.querySelector('body'),
    btnFechar: document.getElementById('fecharOverlay'),
    navLinks: document.querySelectorAll('.bateu_a_cara_e_viu nav a'),
    projectContent: document.querySelectorAll('.project-content'),
    projectContentOverlay: document.querySelectorAll('.project-content-overlay')
};

// ==================== CONTROLE DE PROJETOS ====================
const projectController = {
    show(index, isOverlay = false) {
        const contentArray = isOverlay ? elements.projectContentOverlay : elements.projectContent;
        if (contentArray[index]) {
            contentArray[index].style.visibility = "visible";
            contentArray[index].style.opacity = "1";
        }
    },

    hide(index, isOverlay = false) {
        const contentArray = isOverlay ? elements.projectContentOverlay : elements.projectContent;
        if (contentArray[index]) {
            contentArray[index].style.visibility = "hidden";
            contentArray[index].style.opacity = "0";
        }
    }
};

// Funções globais para compatibilidade com HTML inline
function exibirContent(index) {
    projectController.show(index, false);
}

function esconderContent(index) {
    projectController.hide(index, false);
}

function exibirContentOverlay(index) {
    projectController.show(index, true);
}

function esconderContentOverlay(index) {
    projectController.hide(index, true);
}

// ==================== CONTROLE DE OVERLAY DE PROJETOS ====================
function viewAllProjects() {
    elements.overlayPortfolio.style.display = "flex";
    elements.body.style.overflowY = "hidden";

    // Animação suave ao abrir
    setTimeout(() => {
        elements.overlayPortfolio.style.opacity = "1";
    }, 10);
}

function closeProjectsOverlay() {
    elements.overlayPortfolio.style.opacity = "0";

    setTimeout(() => {
        elements.overlayPortfolio.style.display = "none";
        elements.body.style.overflowY = "scroll";
    }, 300);
}

// ==================== MENU HAMBÚRGUER ====================
const menuController = {
    toggle() {
        elements.hamburger.classList.toggle('active');
        elements.nav.classList.toggle('active');
        elements.overlay.classList.toggle('active');

        // Previne scroll quando menu está aberto
        if (elements.nav.classList.contains('active')) {
            elements.body.style.overflow = 'hidden';
        } else {
            elements.body.style.overflow = '';
        }
    },

    close() {
        elements.hamburger.classList.remove('active');
        elements.nav.classList.remove('active');
        elements.overlay.classList.remove('active');
        elements.body.style.overflow = '';
    }
};

// ==================== SCROLL HEADER ====================
let lastScroll = 0;
let ticking = false;

function updateHeader() {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
        elements.header.classList.add('scrolled');
    } else {
        elements.header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
    ticking = false;
}

function requestHeaderUpdate() {
    if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
    }
}

// ==================== EVENT LISTENERS ====================
// Menu hambúrguer
elements.hamburger.addEventListener('click', () => menuController.toggle());
elements.overlay.addEventListener('click', () => menuController.close());

// Links de navegação
elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        menuController.close();

        // Smooth scroll suave
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = elements.header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Overlay de projetos
elements.btnFechar.addEventListener('click', closeProjectsOverlay);

// Fechar overlay ao clicar fora
elements.overlayPortfolio.addEventListener('click', (e) => {
    if (e.target === elements.overlayPortfolio) {
        closeProjectsOverlay();
    }
});

// Scroll com performance otimizada
window.addEventListener('scroll', requestHeaderUpdate, { passive: true });

// Tecla ESC para fechar overlays
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        menuController.close();
        if (elements.overlayPortfolio.style.display === 'flex') {
            closeProjectsOverlay();
        }
    }
});

// ==================== FORMULÁRIO DE CONTATO ====================
const contactForm = {
    inputs: {
        name: document.getElementById('contact-name'),
        email: document.getElementById('contact-email'),
        message: document.getElementById('contact-message')
    },

    validate() {
        const { name, email, message } = this.inputs;

        if (!name.value.trim()) {
            this.showError(name, 'Por favor, insira seu nome');
            return false;
        }

        if (!this.isValidEmail(email.value)) {
            this.showError(email, 'Por favor, insira um e-mail válido');
            return false;
        }

        if (!message.value.trim()) {
            this.showError(message, 'Por favor, insira uma mensagem');
            return false;
        }

        return true;
    },

    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    showError(input, msg) {
        input.style.borderColor = 'red';
        showToast(msg, 'error');
        setTimeout(() => {
            input.style.borderColor = '';
        }, 3000);
    },

    clear() {
        Object.values(this.inputs).forEach(input => input.value = '');
    }
};

// ==================== ENVIO COM EMAILJS ====================
const sendButton = document.querySelector('.send-email');

if (sendButton) {
    sendButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (!contactForm.validate()) return;

        sendButton.disabled = true;
        sendButton.textContent = 'Enviando...';

        emailjs.send('service_s26gimk', 'template_vueeeu6', {
            name: contactForm.inputs.name.value,
            email: contactForm.inputs.email.value,
            message: contactForm.inputs.message.value
        })
            .then(() => {
                showToast('Mensagem enviada com sucesso! 🎉', 'success');
                contactForm.clear();
            })
            .catch(() => {
                showToast('Erro ao enviar mensagem 😢', 'error');
            })
            .finally(() => {
                sendButton.disabled = false;
                sendButton.textContent = 'Enviar';
            });
    });
}


// ==================== ANIMAÇÕES AO SCROLL ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.querySelectorAll('.card, .project, .experience').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== PERFORMANCE ====================
// Debounce para resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Fecha menu em telas maiores
        if (window.innerWidth > 768) {
            menuController.close();
        }
    }, 250);
});

// ==================== INICIALIZAÇÃO ====================
console.log('✅ Portfolio carregado com sucesso!');

// Smooth scroll inicial
document.documentElement.style.scrollBehavior = 'smooth';


// ==================== LOADING SCREEN ====================
const loadingScreen = {
    create() {
        const loader = document.createElement('div');
        loader.id = 'loading-screen';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: #252930;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            transition: opacity 0.5s ease;
        `;

        loader.innerHTML = `
            <div style="width: 100px; height: 100px; border: 4px solid rgba(255, 217, 0, 0.1); 
                        border-top: 4px solid rgb(255, 217, 0); border-radius: 50%; 
                        animation: spin 1s linear infinite;"></div>
            <p style="color: rgb(255, 217, 0); margin-top: 20px; font-size: 18px; font-weight: 700;">
                Carregando Portfolio...
            </p>
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;

        document.body.appendChild(loader);
        return loader;
    },

    hide(loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }, 800);
    }
};

// ==================== SCROLL PROGRESS BAR ====================
const scrollProgress = {
    init() {
        const progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, rgb(255, 217, 0), rgb(255, 165, 0));
            z-index: 10000;
            transition: width 0.1s ease;
        `;

        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }, { passive: true });
    }
};

// ==================== SCROLL TO TOP BUTTON ====================
const scrollToTop = {
    button: null,

    init() {
        this.button = document.createElement('button');
        this.button.innerHTML = '↑';
        this.button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: rgb(255, 217, 0);
            color: #000;
            border: none;
            border-radius: 50%;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        `;

        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        this.button.addEventListener('mouseenter', () => {
            this.button.style.transform = 'scale(1.1)';
            this.button.style.boxShadow = '0 6px 20px rgba(255, 217, 0, 0.5)';
        });

        this.button.addEventListener('mouseleave', () => {
            this.button.style.transform = 'scale(1)';
            this.button.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
        });

        document.body.appendChild(this.button);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.button.style.opacity = '1';
                this.button.style.visibility = 'visible';
            } else {
                this.button.style.opacity = '0';
                this.button.style.visibility = 'hidden';
            }
        }, { passive: true });
    }
};

// ==================== TYPING EFFECT ====================
const typingEffect = {
    init() {
        const targetElement = document.querySelector('.about-perfil h2');
        if (!targetElement) return;

        const text = targetElement.textContent;
        const roles = ['Junior Developer', 'Frontend Developer', 'Web Designer'];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        targetElement.textContent = '';

        const type = () => {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                targetElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                targetElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        type();
    }
};

// ==================== PARALLAX EFFECT ====================
const parallax = {
    init() {
        const parallaxElements = document.querySelectorAll('#foto-deu, .about-perfil');

        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;

            parallaxElements.forEach((el, index) => {
                const speed = index === 0 ? 0.5 : 0.3;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        }, { passive: true });
    }
};

// ==================== CONTADOR DE SKILLS ====================
const skillCounter = {
    counted: false,

    init() {
        const skillsSection = document.querySelector('.skills');
        if (!skillsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.counted) {
                    this.animateCount();
                    this.counted = true;
                }
            });
        });

        observer.observe(skillsSection);
    },

    animateCount() {
        const cards = document.querySelectorAll('.skills .card');
        const totalSkills = cards.length;
        const counterDisplay = document.createElement('p');

        counterDisplay.style.cssText = `
            text-align: center;
            color: rgb(255, 217, 0);
            font-size: 20px;
            font-weight: 700;
            margin-top: 30px;
        `;

        document.querySelector('.skills').appendChild(counterDisplay);

        let count = 0;
        const interval = setInterval(() => {
            count++;
            counterDisplay.textContent = `${count} Skills Dominadas`;

            if (count >= totalSkills) {
                clearInterval(interval);
                counterDisplay.textContent = `${totalSkills}+ Skills Dominadas 🚀`;
            }
        }, 100);
    }
};

// ==================== DARK MODE TOGGLE ====================
const darkMode = {
    button: null,

    init() {
        this.button = document.createElement('button');
        this.button.innerHTML = '🌙';
        this.button.title = 'Alternar tema';
        this.button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            background: rgba(255, 217, 0, 0.2);
            border: 2px solid rgb(255, 217, 0);
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            z-index: 999;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `;

        // Verificar preferência salva
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.enableLightMode();
        }

        this.button.addEventListener('click', () => this.toggle());
        document.body.appendChild(this.button);
    },

    toggle() {
        if (document.body.classList.contains('light-mode')) {
            this.enableDarkMode();
        } else {
            this.enableLightMode();
        }
    },

    enableLightMode() {
        document.body.style.background = '#f0f0f0';
        document.body.style.color = '#252930';
        this.button.innerHTML = '☀️';
        localStorage.setItem('theme', 'light');
        document.body.classList.add('light-mode');
    },

    enableDarkMode() {
        document.body.style.background = '#252930';
        document.body.style.color = '#ffffff';
        this.button.innerHTML = '🌙';
        localStorage.setItem('theme', 'dark');
        document.body.classList.remove('light-mode');
    }
};

// ==================== TOAST (BALÃO DE NOTIFICAÇÃO) ====================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');

    toast.textContent = message;

    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #ffd900, #ffa500)' : '#ff4d4d'};
        color: #000;
        font-weight: 700;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s ease;
    `;

    document.body.appendChild(toast);

    // animação de entrada
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    // remover após 3s
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}


// ==================== BOOT SEQUENCE ====================
window.addEventListener('DOMContentLoaded', () => {
    const loader = loadingScreen.create();

    Promise.all([
        new Promise(resolve => setTimeout(resolve, 500)),
        new Promise(resolve => {
            if (document.readyState === 'complete') resolve();
            else window.addEventListener('load', resolve);
        })
    ]).then(() => {
        loadingScreen.hide(loader);

        // Inicializar recursos
        scrollProgress.init();
        scrollToTop.init();
        typingEffect.init();
        parallax.init();
        skillCounter.init();

    });
});

// ==================== CONSOLE STYLING ====================
console.log('%c🚀 Portfolio Arthur Antunes', 'color: #ffd900; font-size: 20px; font-weight: bold;');
console.log('%cGitHub: https://github.com/thz-tunes', 'color: #ffd900; font-size: 12px;');