// Points Management
let userPoints = parseInt(localStorage.getItem('userPoints')) || 0;

// Constants
const POINTS_PER_AD = 10;
const POINTS_PER_POPUP = 15;
const POINTS_PER_INTERSTITIAL = 5;

// Ad Integration
function initializeAds() {
    (adsbygoogle = window.adsbygoogle || []).push({});
    initializeInAppAds();
}

// Rewarded Interstitial Ad
function handleAdWatch() {
    show_8980914().then(() => {
        updateUserPoints(POINTS_PER_AD);
        alert(`Thank you for watching the ad! ${POINTS_PER_AD} points have been added to your balance.`);
    });
}

// Rewarded Popup Ad
function handlePopupAd() {
    show_8980914('pop').then(() => {
        updateUserPoints(POINTS_PER_POPUP);
        alert(`Thank you for watching the popup ad! ${POINTS_PER_POPUP} points have been added to your balance.`);
    }).catch(e => {
        console.error('Error playing popup ad:', e);
    });
}

// In-App Interstitial Ad
function initializeInAppAds() {
    show_8980914({ 
        type: 'inApp', 
        inAppSettings: { 
            frequency: 2, 
            capping: 0.1, 
            interval: 30, 
            timeout: 5, 
            everyPage: false 
        } 
    });
    // Reward user for viewing in-app ads
    setTimeout(() => {
        updateUserPoints(POINTS_PER_INTERSTITIAL);
    }, 5000);
}

function updateUserPoints(amount) {
    userPoints += amount;
    localStorage.setItem('userPoints', userPoints);
    document.getElementById('userBalance').textContent = `Points: ${userPoints}`;
}

// Payment Processing
function handleWithdraw(e) {
    e.preventDefault();
    const withdrawAmount = parseInt(document.getElementById('withdrawAmount').value);
    const payeerEmail = document.getElementById('payeerEmail').value;

    if (withdrawAmount < 100) {
        alert('Minimum withdrawal amount is 100 points');
        return;
    }

    if (withdrawAmount > userPoints) {
        alert('Insufficient points balance');
        return;
    }

    // Process payment through Payeer
    const usdAmount = withdrawAmount / 100; // Convert points to USD
    processPayeerPayment(usdAmount, payeerEmail);
}

function processPayeerPayment(amount, email) {
    // Here you would integrate with Payeer's API
    // For demonstration, we'll just deduct points and show success message
    updateUserPoints(-amount * 100);
    alert(`Withdrawal of $${amount} to ${email} has been processed. Please check your Payeer account.`);
    document.getElementById('withdrawForm').reset();
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });
}

// Event Listeners
document.getElementById('watchAdBtn').addEventListener('click', handleAdWatch);
document.getElementById('withdrawForm').addEventListener('submit', handleWithdraw);

// Navigation Event Listeners
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.getAttribute('data-section');
        showSection(sectionId);
    });
});

// Update points
function updateUserPoints(amount) {
    userPoints += amount;
    localStorage.setItem('userPoints', userPoints);
    document.getElementById('userBalance').textContent = `Points: ${userPoints}`;
}

// Initialize ads and navigation when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeAds();
    document.getElementById('userBalance').textContent = `Points: ${userPoints}`;
    updateProfileStats();
    // Show home section by default
    showSection('homeSection');
});