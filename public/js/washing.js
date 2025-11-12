const API_BASE = 'http://localhost:3000/api';

const userData = JSON.parse(sessionStorage.getItem('userData') || localStorage.getItem('userData') || '{}');

if (!userData.usn) {
    window.location.href = '/index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const userNameElements = document.querySelectorAll('#headerUserName');
    userNameElements.forEach(el => {
        el.textContent = userData.name || 'User';
    });

    const usnElement = document.getElementById('userUSN');
    if (usnElement) {
        usnElement.textContent = userData.usn || 'USN';
    }

    initializeSidebar();

    fetchMachineData();

    setupCardHandlers();

    setupModalHandlers();

    setInterval(fetchMachineData, 10000);

    initializeBookingForm();
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
}

async function fetchMachineData() {
    try {
        const response = await fetch(`${API_BASE}/washing-machines`);
        
        if (response.ok) {
            const data = await response.json();
            updateDashboard(data);
        } else {
            console.error('Failed to fetch machine data');
        }
    } catch (error) {
        console.error('Error fetching machine data:', error);
    }
}

function updateDashboard(data) {
    const machines = data.machines || [];
    
    const total = machines.length;
    const available = machines.filter(m => m.status === 'available').length;
    const inUse = machines.filter(m => m.status === 'in-use').length;
    const faulty = machines.filter(m => m.status === 'faulty').length;

    document.getElementById('totalMachines').textContent = total;
    document.getElementById('availableMachines').textContent = available;
    document.getElementById('inUseMachines').textContent = inUse;
    document.getElementById('faultyMachines').textContent = faulty;

}

function calculateTimeRemaining(endTime) {
    if (!endTime) return 'N/A';
    
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Finishing soon...';
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes} min`;
}

function setupCardHandlers() {
    document.getElementById('totalMachinesCard').addEventListener('click', () => {
        showMachineModal('all');
    });

    document.getElementById('availableMachinesCard').addEventListener('click', () => {
        showMachineModal('available');
    });

    document.getElementById('inUseMachinesCard').addEventListener('click', () => {
        showMachineModal('in-use');
    });

    document.getElementById('faultyMachinesCard').addEventListener('click', () => {
        showMachineModal('faulty');
    });
}

async function showMachineModal(filterType) {
    try {
        const response = await fetch(`${API_BASE}/washing-machines`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch machines');
        }
        
        const data = await response.json();
        let machines = data.machines || [];
        
        if (filterType !== 'all') {
            machines = machines.filter(m => m.status === filterType);
        }
        
        const titles = {
            'all': 'All Washing Machines',
            'available': 'Available Machines',
            'in-use': 'Machines In Use',
            'faulty': 'Faulty Machines'
        };
        
        document.getElementById('modalTitle').textContent = titles[filterType];
        
        const modalBody = document.getElementById('modalBody');
        
        if (machines.length === 0) {
            modalBody.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h4>No Machines Found</h4>
                    <p>There are no machines with this status</p>
                </div>
            `;
        } else {
            modalBody.innerHTML = `
                <div class="modal-machines-grid">
                    ${machines.map(machine => generateModalMachineCard(machine)).join('')}
                </div>
            `;
        }
        
        document.getElementById('machineModal').classList.add('active');
        
    } catch (error) {
        console.error('Error showing modal:', error);
        alert('Failed to load machine details');
    }
}

function generateModalMachineCard(machine) {
    const statusClass = machine.status.replace('-', '');
    let additionalInfo = '';
    
    if (machine.status === 'in-use') {
        const timeRemaining = calculateTimeRemaining(machine.endTime);
        additionalInfo = `
            <div class="user-info">
                <strong>${machine.userName || 'Unknown User'}</strong>
                <div>USN: ${machine.userUSN || 'N/A'}</div>
                <div class="time-info"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15 14"></polyline></svg> ${timeRemaining} remaining</div>
            </div>
        `;
    } else if (machine.status === 'faulty') {
        const repairTime = calculateTimeRemaining(machine.repairEndTime);
        additionalInfo = `
            <div class="user-info">
                <strong>Under Maintenance</strong>
                <div class="time-info"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><polyline points="12 7 12 12 15 14"></polyline></svg> ${repairTime} to repair</div>
            </div>
        `;
    }
    
    return `
        <div class="modal-machine-item ${statusClass}">
            <div class="machine-num">M${machine.machineNumber}</div>
            <div class="machine-status">${machine.status.replace('-', ' ')}</div>
            ${additionalInfo}
        </div>
    `;
}

function setupModalHandlers() {
    const modal = document.getElementById('machineModal');
    const closeBtn = document.getElementById('closeModal');
    const backdrop = modal.querySelector('.modal-backdrop');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    backdrop.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('userData');
        localStorage.removeItem('userData');
        window.location.href = '/index.html';
    }
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
        margin-right: 12px;
    `;
    hamburger.addEventListener('click', toggleSidebar);
    header.querySelector('.header-left').prepend(hamburger);
}

document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const hamburger = document.querySelector('.hamburger-menu');
        
        if (sidebar && sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            (!hamburger || !hamburger.contains(e.target))) {
            sidebar.classList.remove('active');
        }
    }
});

let selectedWashType = null;
let selectedDuration = null;
let selectedTimeSlot = null;
let selectedMachine = null;

function initializeBookingForm() {
    resetBookingForm();

    generateTimeSlots();
    loadAvailableMachines();

    setupBookingFormHandlers();
}

function setupBookingFormHandlers() {
    const cancelBooking = document.getElementById('cancelBooking');
    const confirmBooking = document.getElementById('confirmBooking');

    if (cancelBooking) {
        cancelBooking.addEventListener('click', () => {
            resetBookingForm();
        });
    }

    if (confirmBooking) {
        confirmBooking.addEventListener('click', handleBookingConfirm);
    }

    const washTypeBtns = document.querySelectorAll('.wash-type-btn');
    washTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            washTypeBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedWashType = btn.dataset.type;
            selectedDuration = parseInt(btn.dataset.duration);
            updateBookingSummary();
        });
    });

    const machineSelect = document.getElementById('machineSelect');
    if (machineSelect) {
        machineSelect.addEventListener('change', () => {
            selectedMachine = machineSelect.value;
            updateBookingSummary();
        });
    }
}

function generateTimeSlots() {
    const timeSlotsGrid = document.getElementById('timeSlots');
    timeSlotsGrid.innerHTML = '';
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    for (let hour = 6; hour < 22; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            if (hour < currentHour || (hour === currentHour && minute <= currentMinute)) {
                continue;
            }
            
            const timeSlot = document.createElement('button');
            timeSlot.className = 'time-slot-btn';
            timeSlot.type = 'button';
            
            const period = hour >= 12 ? 'PM' : 'AM';
            const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
            const displayMinute = minute.toString().padStart(2, '0');
            const timeString = `${displayHour}:${displayMinute} ${period}`;
            
            timeSlot.textContent = timeString;
            timeSlot.dataset.hour = hour;
            timeSlot.dataset.minute = minute;
            
            timeSlot.addEventListener('click', () => {
                document.querySelectorAll('.time-slot-btn').forEach(btn => {
                    btn.classList.remove('selected');
                });
                timeSlot.classList.add('selected');
                
                selectedTimeSlot = {
                    hour: parseInt(timeSlot.dataset.hour),
                    minute: parseInt(timeSlot.dataset.minute),
                    display: timeString
                };
                
                updateBookingSummary();
            });
            
            timeSlotsGrid.appendChild(timeSlot);
        }
    }
}

async function loadAvailableMachines() {
    try {
        const response = await fetch(`${API_BASE}/washing-machines`);
        if (!response.ok) throw new Error('Failed to fetch machines');
        
        const data = await response.json();
        const availableMachines = data.machines.filter(m => m.status === 'available');
        
        const machineSelect = document.getElementById('machineSelect');
        machineSelect.innerHTML = '<option value="">Select a machine...</option>';
        
        availableMachines.forEach(machine => {
            const option = document.createElement('option');
            option.value = machine.machineNumber;
            option.textContent = `Machine ${machine.machineNumber}`;
            machineSelect.appendChild(option);
        });

        if (availableMachines.length === 0) {
            machineSelect.innerHTML = '<option value="">No machines currently available</option>';
        }
    } catch (error) {
        console.error('Error loading machines:', error);
        const machineSelect = document.getElementById('machineSelect');
        machineSelect.innerHTML = '<option value="">Error loading machines</option>';
    }
}

function updateBookingSummary() {
    const bookingSummary = document.getElementById('bookingSummary');
    const confirmBooking = document.getElementById('confirmBooking');
    
    if (selectedWashType && selectedTimeSlot && selectedMachine) {
        const today = new Date();
        const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
                                   selectedTimeSlot.hour, selectedTimeSlot.minute);
        const endTime = new Date(startTime.getTime() + selectedDuration * 60000);
        
        const endHour = endTime.getHours();
        const endMinute = endTime.getMinutes();
        const endPeriod = endHour >= 12 ? 'PM' : 'AM';
        const endDisplayHour = endHour > 12 ? endHour - 12 : (endHour === 0 ? 12 : endHour);
        const endDisplayMinute = endMinute.toString().padStart(2, '0');
        const endTimeString = `${endDisplayHour}:${endDisplayMinute} ${endPeriod}`;
        
        document.getElementById('summaryMachine').textContent = `Machine ${selectedMachine}`;
        document.getElementById('summaryType').textContent = selectedWashType.charAt(0).toUpperCase() + selectedWashType.slice(1) + ' Wash';
        document.getElementById('summaryStart').textContent = selectedTimeSlot.display;
        document.getElementById('summaryEnd').textContent = endTimeString;
        
        bookingSummary.style.display = 'block';
        confirmBooking.disabled = false;
    } else {
        bookingSummary.style.display = 'none';
        confirmBooking.disabled = true;
    }
}

async function handleBookingConfirm() {
    if (!selectedWashType || !selectedTimeSlot || !selectedMachine) {
        alert('Please complete all booking details');
        return;
    }
    
    const confirmBooking = document.getElementById('confirmBooking');
    confirmBooking.disabled = true;
    confirmBooking.textContent = 'Booking...';
    
    try {
        const today = new Date();
        const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 
                                   selectedTimeSlot.hour, selectedTimeSlot.minute);
        const endTime = new Date(startTime.getTime() + selectedDuration * 60000);
        
        const response = await fetch(`${API_BASE}/washing-machines/book`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                machineNumber: parseInt(selectedMachine),
                washType: selectedWashType,
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                userUSN: userData.usn,
                userName: userData.name
            })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            alert(`Booking successful! Machine ${selectedMachine} is reserved for ${selectedWashType} wash at ${selectedTimeSlot.display}.`);
            
            setupBookingNotification(selectedMachine, endTime);

            resetBookingForm();
            fetchMachineData();
        } else {
            alert(result.message || 'Booking failed. Please try again.');
            confirmBooking.disabled = false;
            confirmBooking.textContent = 'Confirm Booking';
        }
    } catch (error) {
        console.error('Error booking machine:', error);
        alert('Error booking machine. Please try again.');
        confirmBooking.disabled = false;
        confirmBooking.textContent = 'Confirm Booking';
    }
}

function resetBookingForm() {
    selectedWashType = null;
    selectedDuration = null;
    selectedTimeSlot = null;
    selectedMachine = null;
    
    document.querySelectorAll('.wash-type-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.time-slot-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('machineSelect').value = '';
    document.getElementById('bookingSummary').style.display = 'none';
    document.getElementById('confirmBooking').disabled = true;
    document.getElementById('confirmBooking').textContent = 'Confirm Booking';
}

function setupBookingNotification(machineNumber, endTime) {
    const now = new Date();
    const end = new Date(endTime);
    const timeUntilEnd = end - now;
    
    const notificationTime = timeUntilEnd - (5 * 60 * 1000);
    
    if (notificationTime > 0) {
        setTimeout(() => {
            if (Notification.permission === 'granted') {
                new Notification('ZenCampus - Washing Machine', {
                    body: `Machine ${machineNumber} will be free in 5 minutes!`,
                    icon: '/favicon.ico'
                });
            } else {
                alert(`Machine ${machineNumber} will be free in 5 minutes!`);
            }
        }, notificationTime);
    }
    
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }
}
