const API_BASE = 'http://localhost:3000/api';

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const usn = document.getElementById('usn').value.trim();
    const password = document.getElementById('password').value;
    
    if (!usn || !password) {
        alert('Please enter both USN and password');
        return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usn, password })
        });

        const data = await response.json();

        if (data.success) {
            sessionStorage.setItem('userData', JSON.stringify(data.user));
            localStorage.setItem('userData', JSON.stringify(data.user));
            window.location.href = '/dashboard.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Unable to connect to server. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
let slideInterval = null;

function showSlide(index) {
    slides.forEach(s => {
        s.classList.remove('active');
        s.setAttribute('aria-hidden', 'true');
    });
    dots.forEach(d => d.classList.remove('active'));

    const slide = slides[index];
    if (slide) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
    }
    const dot = dots[index];
    if (dot) dot.classList.add('active');
    currentSlide = index;
}

const forgotLink = document.getElementById('forgotLink');
const forgotModal = document.getElementById('forgotModal');
const modalClose = forgotModal ? forgotModal.querySelector('.modal-close') : null;
const forgotForm = document.getElementById('forgotForm');
const resetForm = document.getElementById('resetForm');
const fpBack = document.getElementById('fp-back');

function openModal() {
    if (!forgotModal) return;
    forgotModal.classList.add('active');
    forgotModal.setAttribute('aria-hidden', 'false');
    showModalStep(1);
}

function closeModal() {
    if (!forgotModal) return;
    forgotModal.classList.remove('active');
    forgotModal.setAttribute('aria-hidden', 'true');
}

function showModalStep(n) {
    const steps = forgotModal.querySelectorAll('.modal-step');
    steps.forEach(s => s.classList.add('hidden'));
    const active = forgotModal.querySelector('.modal-step[data-step="' + n + '"]');
    if (active) active.classList.remove('hidden');
}

if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (forgotModal) forgotModal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

if (forgotForm) {
    forgotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('fp-usn-error').textContent = '';
        document.getElementById('fp-mobile-error').textContent = '';

        const fpUsn = document.getElementById('fp-usn').value.trim();
        const fpMobile = document.getElementById('fp-mobile').value.trim();
        let ok = true;
        if (!/^[A-Za-z0-9]+$/.test(fpUsn)) {
            document.getElementById('fp-usn-error').textContent = 'Enter a valid USN (alphanumeric).';
            ok = false;
        }
        if (!/^\d{10}$/.test(fpMobile)) {
            document.getElementById('fp-mobile-error').textContent = 'Enter a valid 10-digit mobile number.';
            ok = false;
        }
        if (!ok) return;

        const verifyBtn = forgotForm.querySelector('button[type="submit"]');
        const orig = verifyBtn.textContent;
        verifyBtn.textContent = 'Verifying...';
        verifyBtn.disabled = true;

        fetch(`${API_BASE}/forgot-password/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usn: fpUsn, mobile: fpMobile })
        })
        .then(res => res.json())
        .then(data => {
            verifyBtn.textContent = orig;
            verifyBtn.disabled = false;
            if (data.success) {
                forgotModal.dataset.verifiedUsn = data.usn;
                showModalStep(2);
            } else {
                document.getElementById('fp-usn-error').textContent = data.message || 'Verification failed';
            }
        })
        .catch(err => {
            console.error('Verify error:', err);
            verifyBtn.textContent = orig;
            verifyBtn.disabled = false;
            document.getElementById('fp-usn-error').textContent = 'Unable to connect to server';
        });
    });
}

if (resetForm) {
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        document.getElementById('fp-new-error').textContent = '';
        document.getElementById('fp-confirm-error').textContent = '';

        const pw = document.getElementById('fp-new').value;
        const pwc = document.getElementById('fp-confirm').value;
        let ok = true;
        if (pw.length < 6) {
            document.getElementById('fp-new-error').textContent = 'Password must be at least 6 characters.';
            ok = false;
        }
        if (pw !== pwc) {
            document.getElementById('fp-confirm-error').textContent = 'Passwords do not match.';
            ok = false;
        }
        if (!ok) return;

        const submitBtn = resetForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Updating...';
        submitBtn.disabled = true;

        const verifiedUsn = forgotModal.dataset.verifiedUsn;
        if (!verifiedUsn) {
            alert('Session expired. Please verify again.');
            showModalStep(1);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        fetch(`${API_BASE}/forgot-password/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usn: verifiedUsn, newPassword: pw })
        })
        .then(res => res.json())
        .then(data => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            if (data.success) {
                alert('Password changed successfully. You can now sign in with your new password.');
                closeModal();
                forgotForm.reset();
                resetForm.reset();
            } else {
                document.getElementById('fp-new-error').textContent = data.message || 'Password reset failed';
            }
        })
        .catch(err => {
            console.error('Reset error:', err);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            document.getElementById('fp-new-error').textContent = 'Unable to connect to server';
        });
    });
}

if (fpBack) fpBack.addEventListener('click', () => showModalStep(1));

function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
}

function startSlider() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3500);
}

dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        const idx = Number(dot.getAttribute('data-index')) || 0;
        showSlide(idx);
        startSlider();
    });
});

if (slides.length && dots.length) {
    showSlide(0);
    startSlider();
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

const passwordInput = document.getElementById('password');
const toggleBtn = document.querySelector('.toggle-password');
if (toggleBtn && passwordInput) {
    const eyeOpen = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5z" stroke="#4a5568" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>\n                            <circle cx="12" cy="12" r="3" stroke="#4a5568" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>\n                        </svg>';
    const eyeClosed = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n                            <path d="M17.94 17.94C16.24 19.17 14.2 20 12 20c-5 0-9.27-3.11-11-7.5 1.04-2.64 2.74-4.76 4.8-6.11" stroke="#4a5568" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>\n                            <path d="M1 1l22 22" stroke="#4a5568" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>\n                        </svg>';

    function setIcon(open) {
        toggleBtn.innerHTML = open ? eyeClosed : eyeOpen;
        toggleBtn.setAttribute('aria-pressed', String(open));
        toggleBtn.setAttribute('aria-label', open ? 'Hide password' : 'Show password');
    }

    setIcon(false);

    toggleBtn.addEventListener('click', function() {
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        setIcon(isPassword);
    });
}

const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminModal = document.getElementById('adminModal');
const adminModalClose = adminModal ? adminModal.querySelector('.modal-close') : null;
const adminLoginForm = document.getElementById('adminLoginForm');

function openAdminModal() {
    if (!adminModal) return;
    adminModal.classList.add('active');
    adminModal.setAttribute('aria-hidden', 'false');
}

function closeAdminModal() {
    if (!adminModal) return;
    adminModal.classList.remove('active');
    adminModal.setAttribute('aria-hidden', 'true');
}

if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openAdminModal();
    });
}

if (adminModalClose) adminModalClose.addEventListener('click', closeAdminModal);
if (adminModal) adminModal.querySelector('.modal-backdrop').addEventListener('click', closeAdminModal);

if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const adminId = document.getElementById('admin-id').value.trim();
        const adminPassword = document.getElementById('admin-password').value;
        
        if (!adminId || !adminPassword) {
            alert('Please enter both Admin ID and password');
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Authenticating...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ adminId, password: adminPassword })
            });

            const data = await response.json();

            if (data.success) {
                sessionStorage.setItem('adminAuth', JSON.stringify(data.admin));
                window.location.href = '/admin.html';
            } else {
                alert(data.message || 'Admin authentication failed');
            }
        } catch (error) {
            console.error('Admin login error:', error);
            alert('Unable to connect to server. Please try again.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}
