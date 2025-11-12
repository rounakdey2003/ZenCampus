const userData = JSON.parse(sessionStorage.getItem('userData') || localStorage.getItem('userData') || '{}');

if (!userData.usn) {
    window.location.href = '/index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const userNameElements = document.querySelectorAll('#userName, #headerUserName');
    userNameElements.forEach(el => {
        el.textContent = userData.name || 'User';
    });

    const usnElement = document.getElementById('userUSN');
    if (usnElement) {
        usnElement.textContent = userData.usn || 'USN';
    }

    initializeSidebar();

    fetchDashboardStats();
});

function initializeSidebar() {
    const navSections = document.querySelectorAll('.nav-section');

    navSections.forEach(section => {
        const header = section.querySelector('.nav-item-header');

        header.addEventListener('click', function() {
            navSections.forEach(s => {
                if (s !== section) {
                    s.classList.remove('active');
                }
            });

            section.classList.toggle('active');
        });
    });

    if (navSections.length > 0) {
        navSections[0].classList.add('active');
    }
}

async function fetchDashboardStats() {
    try {
        const response = await fetch('http://localhost:3000/api/dashboard/stats');

        if (response.ok) {
            const data = await response.json();
            updateDashboardStats(data);
        } else {
            console.log('Using default statistics');
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
    }
}

function updateDashboardStats(data) {
    if (data.totalStudents !== undefined) {
        document.getElementById('totalStudents').textContent = data.totalStudents.toLocaleString();
    }

    if (data.workDoneToday !== undefined) {
        document.getElementById('workDoneToday').textContent = data.workDoneToday;
    }

    if (data.dueWork !== undefined) {
        document.getElementById('dueWork').textContent = data.dueWork;
    }
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('userData');
        localStorage.removeItem('userData');

        window.location.href = '/index.html';
    }
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        if (href && !href.startsWith('#')) {
            return;
        }

        e.preventDefault();
        const target = href ? href.substring(1) : '';

        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        this.classList.add('active');

        console.log('Navigating to:', target);

        if (target) {
            alert(`Navigating to ${target} section - This will be implemented next!`);
        }
    });
});

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

if (window.innerWidth <= 768) {
    const header = document.querySelector('.dashboard-header');
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger-menu';
    hamburger.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    `;
    hamburger.style.cssText = `
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    hamburger.addEventListener('click', toggleSidebar);
    header.querySelector('.header-left').prepend(hamburger);
}

document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const hamburger = document.querySelector('.hamburger-menu');

        if (sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !hamburger.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});
