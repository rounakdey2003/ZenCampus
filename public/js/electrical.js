const API_BASE = 'http://localhost:3000/api';
const CATEGORY = 'electrical';

function checkAuth() {
    const userData = sessionStorage.getItem('userData');
    if (!userData) {
        window.location.href = '/index.html';
        return null;
    }
    return JSON.parse(userData);
}

const user = checkAuth();
if (user) {
    document.getElementById('headerUserName').textContent = user.name;
    document.getElementById('userUSN').textContent = user.usn;
}

document.querySelectorAll('.nav-item-header').forEach(header => {
    header.addEventListener('click', function() {
        const section = this.parentElement;
        section.classList.toggle('active');
    });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('userData');
        window.location.href = '/index.html';
    }
});

async function loadStats() {
    try {
        const response = await fetch(`${API_BASE}/complaints/${CATEGORY}/stats`);
        const data = await response.json();

        if (data.success) {
            document.getElementById('totalComplaints').textContent = data.stats.total;
            document.getElementById('remainingComplaints').textContent = data.stats.remaining;
            document.getElementById('completedComplaints').textContent = data.stats.completed;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadComplaints() {
    const listEl = document.getElementById('complaintsList');
    listEl.innerHTML = '<p class="loading-text">Loading complaints...</p>';

    try {
        const response = await fetch(`${API_BASE}/complaints/${CATEGORY}`);
        const data = await response.json();

        if (data.success && data.complaints.length > 0) {
            listEl.innerHTML = data.complaints.map(complaint => `
                <div class="complaint-item ${complaint.status}">
                    <div class="complaint-header">
                        <div class="complaint-info">
                            <h4>${complaint.location}</h4>
                            <span class="complaint-status ${complaint.status}">
                                ${complaint.status === 'pending' ? 'Pending' : 'Completed'}
                            </span>
                        </div>
                        <div class="complaint-meta">
                            <span class="complaint-date">${new Date(complaint.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <p class="complaint-description">${complaint.description}</p>
                    ${complaint.photo ? `
                        <div class="complaint-photo" style="margin: 10px 0;">
                            <img src="${complaint.photo}" alt="Complaint photo" style="max-width: 300px; max-height: 300px; border-radius: 8px; cursor: pointer;" onclick="window.open('${complaint.photo}', '_blank')">
                        </div>
                    ` : ''}
                    <div class="complaint-footer">
                        <span class="complaint-user">By: ${complaint.userName} (${complaint.userUSN})</span>
                        ${complaint.status === 'pending' ? `
                            <button class="btn-complete" onclick="markComplete('${complaint._id}')">
                                Mark Complete
                            </button>
                        ` : `
                            <span class="completed-date">Completed: ${new Date(complaint.completedAt).toLocaleDateString()}</span>
                        `}
                    </div>
                </div>
            `).join('');
        } else {
            listEl.innerHTML = '<p class="empty-text">No complaints registered yet.</p>';
        }
    } catch (error) {
        console.error('Error loading complaints:', error);
        listEl.innerHTML = '<p class="error-text">Error loading complaints. Please try again.</p>';
    }
}

document.getElementById('complaintForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.btn-submit');
    const origBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
    }

    const location = document.getElementById('location').value.trim();
    const description = document.getElementById('description').value.trim();
    const photoInput = document.getElementById('photo');
    const messageEl = document.getElementById('formMessage');

    messageEl.className = 'form-message';
    messageEl.textContent = '';

    try {
        const formData = new FormData();
        formData.append('category', CATEGORY);
        formData.append('usn', user.usn);
        formData.append('location', location);
        formData.append('description', description);
        
        if (photoInput.files && photoInput.files[0]) {
            formData.append('photo', photoInput.files[0]);
        }

        const response = await fetch(`${API_BASE}/complaints`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            messageEl.className = 'form-message success';
            messageEl.textContent = 'Complaint registered successfully!';
            this.reset();
            loadStats();
            loadComplaints();
        } else {
            messageEl.className = 'form-message error';
            messageEl.textContent = data.message;
        }
    } catch (error) {
        console.error('Error submitting complaint:', error);
        messageEl.className = 'form-message error';
        messageEl.textContent = 'Unable to connect to server';
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = origBtnText;
        }
    }
});

async function markComplete(complaintId) {
    if (!confirm('Mark this complaint as completed?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/complaints/${complaintId}/complete`, {
            method: 'POST'
        });

        const data = await response.json();

        if (data.success) {
            loadStats();
            loadComplaints();
        } else {
            alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Error marking complete:', error);
        alert('Unable to connect to server');
    }
}

document.getElementById('refreshBtn').addEventListener('click', () => {
    loadStats();
    loadComplaints();
});

loadStats();
loadComplaints();
