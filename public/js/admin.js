const API_BASE = 'http://localhost:3000/api';
let allComplaints = [];

function checkAdminAuth() {
    const adminData = sessionStorage.getItem('adminAuth');
    if (!adminData) {
        window.location.href = '/index.html';
        return null;
    }
    const admin = JSON.parse(adminData);
    document.getElementById('adminName').textContent = `Logged in as ${admin.name}`;
    return admin;
}

document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const section = tab.dataset.section;
        
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');
        
        if (section === 'dashboard') loadDashboard();
        else if (section === 'users') loadUsers();
        else if (section === 'complaints') loadComplaints();
        else if (section === 'machines') loadMachines();
        else if (section === 'system') loadSystemStats();
    });
});

document.querySelectorAll('.machine-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const type = tab.dataset.type;
        
        document.querySelectorAll('.machine-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.machine-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`${type}-machines`).classList.add('active');
    });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminAuth');
        window.location.href = '/index.html';
    }
});

async function loadDashboard() {
    try {
        const [usersRes, complaintsRes, machinesRes] = await Promise.all([
            fetch(`${API_BASE}/admin/users`),
            fetch(`${API_BASE}/admin/complaints`),
            fetch(`${API_BASE}/admin/machines`)
        ]);
        
        const usersData = await usersRes.json();
        const complaintsData = await complaintsRes.json();
        const machinesData = await machinesRes.json();
        
        document.getElementById('totalUsers').textContent = usersData.users?.length || 0;
        
        const pending = complaintsData.complaints?.filter(c => c.status === 'pending').length || 0;
        document.getElementById('pendingComplaints').textContent = pending;
        
        const today = new Date().toDateString();
        const completedToday = complaintsData.complaints?.filter(c => 
            c.status === 'completed' && new Date(c.completedAt).toDateString() === today
        ).length || 0;
        document.getElementById('completedToday').textContent = completedToday;
        
        const activeWashing = machinesData.washingMachines?.filter(m => m.status === 'in-use').length || 0;
        const activeDryer = machinesData.dryerMachines?.filter(m => m.status === 'in-use').length || 0;
        document.getElementById('activeMachines').textContent = activeWashing + activeDryer;
        
        const recentDiv = document.getElementById('recentComplaints');
        const recent = complaintsData.complaints?.slice(0, 5) || [];
        
        if (recent.length > 0) {
            recentDiv.innerHTML = recent.map(c => `
                <div class="dashboard-item">
                    <div class="dashboard-item-badge ${c.status}">${c.category}</div>
                    <div class="dashboard-item-info">
                        <div class="dashboard-item-title">${c.description.substring(0, 50)}...</div>
                        <div class="dashboard-item-meta">${c.location} • ${c.userName}</div>
                    </div>
                    <div class="dashboard-item-status ${c.status}">${c.status}</div>
                </div>
            `).join('');
        } else {
            recentDiv.innerHTML = '<div class="empty-small">No recent complaints</div>';
        }
        
    } catch (error) {
        console.error('Dashboard load error:', error);
    }
}

document.getElementById('addUserForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        usn: document.getElementById('user-usn').value.trim(),
        name: document.getElementById('user-name').value.trim(),
        mobile: document.getElementById('user-mobile').value.trim(),
        password: document.getElementById('user-password').value
    };

    const messageEl = document.getElementById('userFormMessage');
    messageEl.className = 'form-message';
    messageEl.textContent = '';

    try {
        const response = await fetch(`${API_BASE}/admin/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

            if (data.success) {
                messageEl.className = 'form-message success';
                messageEl.textContent = data.message;
                this.reset();
                loadUsers();
            } else {
                messageEl.className = 'form-message error';
                messageEl.textContent = data.message;
        }
    } catch (error) {
        console.error('Add user error:', error);
        messageEl.className = 'form-message error';
        messageEl.textContent = 'Unable to connect to server';
    }
});

async function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading users...</td></tr>';

    try {
        const response = await fetch(`${API_BASE}/admin/users`);
        const data = await response.json();

        if (data.success && data.users.length > 0) {
            tbody.innerHTML = data.users.map(user => `
                <tr data-usn="${user.usn}">
                    <td><strong>${user.usn}</strong></td>
                    <td>${user.name}</td>
                    <td>${user.mobile}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                        <button class="btn-delete" onclick="deleteUser('${user.usn}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="empty">No users found</td></tr>';
        }
    } catch (error) {
        console.error('Load users error:', error);
        tbody.innerHTML = '<tr><td colspan="5" class="empty">Error loading users</td></tr>';
    }
}

async function deleteUser(usn) {
    if (!confirm(`Are you sure you want to delete user ${usn}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/admin/users/${usn}`, {
            method: 'DELETE'
        });

        const data = await response.json();

            if (data.success) {
                alert('User deleted successfully');
                loadUsers();
            } else {
                alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Delete user error:', error);
        alert('Unable to connect to server');
    }
}

document.getElementById('searchUser').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#usersTableBody tr');

    rows.forEach(row => {
        const usn = row.dataset.usn?.toLowerCase() || '';
        const text = row.textContent.toLowerCase();

        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

document.getElementById('refreshUsers').addEventListener('click', loadUsers);

async function loadComplaints() {
    const tbody = document.getElementById('complaintsTableBody');
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Loading complaints...</td></tr>';

    try {
        const response = await fetch(`${API_BASE}/admin/complaints`);
        const data = await response.json();
        allComplaints = data.complaints || [];

        displayComplaints(allComplaints);
    } catch (error) {
        console.error('Load complaints error:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="empty">Error loading complaints</td></tr>';
    }
}

function displayComplaints(complaints) {
    const tbody = document.getElementById('complaintsTableBody');
    
    if (complaints.length > 0) {
        tbody.innerHTML = complaints.map(complaint => `
            <tr>
                <td><span class="category-badge ${complaint.category}">${complaint.category}</span></td>
                <td>
                    <div><strong>${complaint.userName}</strong></div>
                    <div style="font-size:12px;color:#718096;">${complaint.userUSN}</div>
                </td>
                <td>${complaint.location}</td>
                <td style="max-width:300px;">${complaint.description}</td>
                <td><span class="status-badge ${complaint.status}">${complaint.status}</span></td>
                <td>${new Date(complaint.createdAt).toLocaleDateString()}</td>
                <td>
                    ${complaint.status === 'pending' ? `
                        <button class="btn-complete" onclick="completeComplaint('${complaint._id}')">
                            Complete
                        </button>
                    ` : ''}
                    ${complaint.photo ? `
                        <button class="btn-view" onclick="window.open('${complaint.photo}', '_blank')">
                            View Photo
                        </button>
                    ` : ''}
                    <button class="btn-delete" onclick="deleteComplaint('${complaint._id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    } else {
        tbody.innerHTML = '<tr><td colspan="7" class="empty">No complaints found</td></tr>';
    }
}

function filterComplaints() {
    const category = document.getElementById('filterCategory').value;
    const status = document.getElementById('filterStatus').value;
    
    let filtered = allComplaints;
    
    if (category !== 'all') {
        filtered = filtered.filter(c => c.category === category);
    }
    
    if (status !== 'all') {
        filtered = filtered.filter(c => c.status === status);
    }
    
    displayComplaints(filtered);
}

document.getElementById('filterCategory').addEventListener('change', filterComplaints);
document.getElementById('filterStatus').addEventListener('change', filterComplaints);
document.getElementById('refreshComplaints').addEventListener('click', loadComplaints);

async function completeComplaint(id) {
    try {
        const response = await fetch(`${API_BASE}/complaints/${id}/complete`, {
            method: 'POST'
        });

        const data = await response.json();

            if (data.success) {
                alert('Complaint marked as completed');
                loadComplaints();
                loadDashboard();
            } else {
                alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Complete complaint error:', error);
        alert('Unable to connect to server');
    }
}

async function deleteComplaint(id) {
    if (!confirm('Are you sure you want to delete this complaint?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/complaints/${id}`, {
            method: 'DELETE'
        });

        const data = await response.json();

            if (data.success) {
                alert('Complaint deleted successfully');
                loadComplaints();
                loadDashboard();
            } else {
                alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Delete complaint error:', error);
        alert('Unable to connect to server');
    }
}

async function loadMachines() {
    try {
        const response = await fetch(`${API_BASE}/admin/machines`);
        const data = await response.json();

        displayMachines('washing', data.washingMachines || []);
        displayMachines('dryer', data.dryerMachines || []);
    } catch (error) {
        console.error('Load machines error:', error);
    }
}

function displayMachines(type, machines) {
    const gridId = type === 'washing' ? 'washingMachinesGrid' : 'dryerMachinesGrid';
    const grid = document.getElementById(gridId);
    
    if (machines.length > 0) {
        grid.innerHTML = machines.map(machine => {
            const statusClass = machine.status === 'available' ? 'available' : 
                               machine.status === 'in-use' ? 'in-use' : 'faulty';
            
            let statusHTML = '';
            if (machine.status === 'in-use') {
                const endTime = new Date(machine.endTime);
                statusHTML = `
                    <div class="machine-user">${machine.userName}</div>
                    <div class="machine-time">Until ${endTime.toLocaleTimeString()}</div>
                `;
            } else if (machine.status === 'faulty') {
                const repairEnd = machine.repairEndTime ? new Date(machine.repairEndTime) : null;
                statusHTML = repairEnd ? 
                    `<div class="machine-time">Repair until ${repairEnd.toLocaleTimeString()}</div>` : 
                    `<div class="machine-time">Under maintenance</div>`;
            }
            
            return `
                <div class="machine-card ${statusClass}">
                    <div class="machine-number">${type === 'washing' ? 'W' : 'D'}-${machine.machineNumber}</div>
                    <div class="machine-status">${machine.status.replace('-', ' ')}</div>
                    ${statusHTML}
                    <div class="machine-actions">
                        ${machine.status === 'in-use' ? `
                            <button class="btn-machine-action" onclick="releaseMachine('${type}', ${machine.machineNumber})">
                                Release
                            </button>
                        ` : ''}
                        ${machine.status !== 'faulty' ? `
                            <button class="btn-machine-action danger" onclick="markFaulty('${type}', ${machine.machineNumber})">
                                Mark Faulty
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } else {
        grid.innerHTML = '<div class="empty">No machines found. Initialize machines in System section.</div>';
    }
}

async function releaseMachine(type, machineNumber) {
    const endpoint = type === 'washing' ? 'washing-machines' : 'dryer-machines';
    
    try {
        const response = await fetch(`${API_BASE}/${endpoint}/${machineNumber}/release`, {
            method: 'POST'
        });

        const data = await response.json();

            if (data.success) {
                loadMachines();
                loadDashboard();
            } else {
                alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Release machine error:', error);
        alert('Unable to connect to server');
    }
}

async function markFaulty(type, machineNumber) {
    const duration = prompt('Enter repair duration in minutes (default: 120):');
    const repairDurationMinutes = duration ? parseInt(duration) : 120;
    
    if (isNaN(repairDurationMinutes) || repairDurationMinutes < 0) {
        alert('Invalid duration');
        return;
    }
    
    const endpoint = type === 'washing' ? 'washing-machines' : 'dryer-machines';
    
    try {
        const response = await fetch(`${API_BASE}/${endpoint}/${machineNumber}/faulty`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ repairDurationMinutes })
        });

        const data = await response.json();

            if (data.success) {
                loadMachines();
                loadDashboard();
            } else {
                alert('Error: ' + data.message);
        }
    } catch (error) {
        console.error('Mark faulty error:', error);
        alert('Unable to connect to server');
    }
}

document.getElementById('initMachinesForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!confirm('This will reset all machines. Continue?')) {
        return;
    }

    const washingCount = parseInt(document.getElementById('washing-count').value);
    const dryerCount = parseInt(document.getElementById('dryer-count').value);
    
    const messageEl = document.getElementById('initFormMessage');
    messageEl.className = 'form-message';
    messageEl.textContent = '';

    try {
        const response = await fetch(`${API_BASE}/admin/init-machines`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ washingCount, dryerCount })
        });

        const data = await response.json();

        if (data.success) {
            messageEl.className = 'form-message success';
            messageEl.textContent = data.message;
            loadSystemStats();
        } else {
            messageEl.className = 'form-message error';
            messageEl.textContent = data.message;
        }
    } catch (error) {
        console.error('Init machines error:', error);
        messageEl.className = 'form-message error';
        messageEl.textContent = 'Unable to connect to server';
    }
});

async function loadSystemStats() {
    try {
        const [usersRes, complaintsRes, machinesRes] = await Promise.all([
            fetch(`${API_BASE}/admin/users`),
            fetch(`${API_BASE}/admin/complaints`),
            fetch(`${API_BASE}/admin/machines`)
        ]);
        
        const usersData = await usersRes.json();
        const complaintsData = await complaintsRes.json();
        const machinesData = await machinesRes.json();
        
        document.getElementById('dbUsers').textContent = usersData.users?.length || 0;
        document.getElementById('dbComplaints').textContent = complaintsData.complaints?.length || 0;
        document.getElementById('dbWashing').textContent = machinesData.washingMachines?.length || 0;
        document.getElementById('dbDryer').textContent = machinesData.dryerMachines?.length || 0;
    } catch (error) {
        console.error('Load system stats error:', error);
    }
}

document.getElementById('refreshDbStats').addEventListener('click', loadSystemStats);

document.getElementById('releaseAllMachines').addEventListener('click', async () => {
    if (!confirm('Release all machines currently in use?')) {
        return;
    }
    
    try {
        const machinesRes = await fetch(`${API_BASE}/admin/machines`);
        const machinesData = await machinesRes.json();
        
        const inUseWashing = machinesData.washingMachines?.filter(m => m.status === 'in-use') || [];
        const inUseDryer = machinesData.dryerMachines?.filter(m => m.status === 'in-use') || [];
        
        for (const machine of inUseWashing) {
            await fetch(`${API_BASE}/washing-machines/${machine.machineNumber}/release`, { method: 'POST' });
        }
        
        for (const machine of inUseDryer) {
            await fetch(`${API_BASE}/dryer-machines/${machine.machineNumber}/release`, { method: 'POST' });
        }
        
            alert(`Released ${inUseWashing.length + inUseDryer.length} machines`);
        loadMachines();
        loadDashboard();
    } catch (error) {
        console.error('Release all error:', error);
            alert('Unable to release machines');
    }
});

checkAdminAuth();
loadDashboard();
