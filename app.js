// SmartKharch - Modern PWA Expense Tracker
let expenses = [];
let savings = 0;

try {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        // Filter out invalid expenses
        expenses = expenses.filter(exp => exp && typeof exp.amount === 'number' && exp.amount > 0 && exp.category && exp.date);
    }
    savings = Number(localStorage.getItem('savings')) || 0;
} catch (error) {
    console.warn('Error loading data from localStorage:', error);
    // Reset to defaults
    expenses = [];
    savings = 0;
}
let chartInstance = null;
let deferredPrompt;

// DOM Elements (will be set in init)
let amountInput, categorySelect, expenseList, chartCanvas, totalExpensesEl, streakElement, progressElement, emTextElement, tipsElement, addBtnText, addBtnSpinner, installPrompt, installBtn, dismissBtn, offlineIndicator;

// Add Expense Function
function addExpense() {
    // Ensure DOM elements are initialized
    if (!amountInput || !categorySelect) {
        showNotification('App is loading, please wait...', 'error');
        return;
    }

    const amount = parseFloat(amountInput.value);
    const category = categorySelect.value;

    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount greater than 0', 'error');
        return;
    }

    // Show loading state
    addBtnText.style.display = 'none';
    addBtnSpinner.style.display = 'inline-block';
    amountInput.disabled = true;
    categorySelect.disabled = true;

    const expense = {
        amount: amount,
        category: category,
        date: new Date().toISOString()
    };

    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Clear input
    amountInput.value = '';
    categorySelect.value = 'Food'; // Reset to default

    // Update UI
    updateUI();

    // Hide loading state
    setTimeout(() => {
        addBtnText.style.display = 'inline';
        addBtnSpinner.style.display = 'none';
        amountInput.disabled = false;
        categorySelect.disabled = false;
    }, 500);

    // Show success message
    showNotification('Expense added successfully!', 'success');
}

// Update all UI elements
function updateUI() {
    updateTotalExpenses();
    updateChart();
    updateStreak();
    updateEmergencyFund();
    updateTips();
    updateExpenseList();
}

// Update Total Expenses
function updateTotalExpenses() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyTotal = expenses
        .filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        })
        .reduce((sum, expense) => sum + expense.amount, 0);

    totalExpensesEl.textContent = `৳${monthlyTotal.toFixed(2)}`;
}
// Update Pie Chart
function updateChart() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not available offline. Chart will not display.');
        const ctx = chartCanvas.getContext('2d');
        ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Chart unavailable offline', chartCanvas.width / 2, chartCanvas.height / 2);
        return;
    }

    if (chartInstance) {
        chartInstance.destroy();
    }

    // Filter expenses for current month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const categoryTotals = {};
    monthlyExpenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    if (labels.length === 0) {
        // Clear canvas if no data
        const ctx = chartCanvas.getContext('2d');
        ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
        ctx.fillStyle = '#666';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Add expenses to see chart', chartCanvas.width / 2, chartCanvas.height / 2);
        return;
    }

    chartInstance = new Chart(chartCanvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ],
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ৳${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Update No Spend Streak
function updateStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const spentToday = expenses.some(expense => expense.date.startsWith(today));

    let streakDays = JSON.parse(localStorage.getItem('streakDays')) || [];

    if (!spentToday && !streakDays.includes(today)) {
        streakDays.push(today);
        localStorage.setItem('streakDays', JSON.stringify(streakDays));
    }

    streakElement.textContent = `🔥 ${streakDays.length} Days`;
}

// Update Emergency Fund Progress
function updateEmergencyFund() {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const target = totalExpenses * 6 || 1; // 6 months of expenses
    const percentage = Math.min((savings / target) * 100, 100);

    progressElement.style.width = percentage + '%';
    emTextElement.textContent = percentage >= 100 ? 'Safe 💪' : 'Build Emergency Fund';
}

// Update Tips
function updateTips() {
    const foodExpenses = expenses
        .filter(expense => expense.category === 'Food')
        .reduce((sum, expense) => sum + expense.amount, 0);

    tipsElement.innerHTML = '';

    if (foodExpenses > 3000) {
        tipsElement.innerHTML += '<li>Reduce outside food expenses 🍔</li>';
    }

    if (expenses.length === 0) {
        tipsElement.innerHTML += '<li>Start tracking your expenses!</li>';
    }
}

// Update Expense List
function updateExpenseList() {
    expenseList.innerHTML = '';

    // Show last 10 expenses
    const recentExpenses = expenses.slice(-10).reverse();

    recentExpenses.forEach(expense => {
        const li = document.createElement('li');
        const date = new Date(expense.date).toLocaleDateString();
        li.textContent = `${expense.category}: ৳${expense.amount} (${date})`;
        expenseList.appendChild(li);
    });

    if (expenses.length === 0) {
        expenseList.innerHTML = '<li>No expenses yet</li>';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        animation: 'slideInRight 0.3s ease-out',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });

    if (type === 'success') {
        notification.style.backgroundColor = '#51cf66';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ff6b6b';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#ffd43b';
        notification.style.color = '#000';
    } else {
        notification.style.backgroundColor = '#0072ff';
    }

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Show install prompt if not dismissed before
    if (!localStorage.getItem('installDismissed')) {
        installPrompt.classList.remove('hidden');
    }
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            showNotification('App installed successfully!', 'success');
        }
        deferredPrompt = null;
    }
    installPrompt.classList.add('hidden');
});

dismissBtn.addEventListener('click', () => {
    installPrompt.classList.add('hidden');
    localStorage.setItem('installDismissed', 'true');
});

// Language Toggle
function toggleLanguage() {
    // This would be implemented with the lang.js file
    showNotification('Language switching coming soon!', 'info');
}

// Export Data
function exportData() {
    const data = {
        expenses: expenses,
        savings: savings,
        streakDays: JSON.parse(localStorage.getItem('streakDays')) || [],
        exportDate: new Date().toISOString(),
        version: '2.0'
    };

    try {
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `smartkharch-backup-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        showNotification('Data exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Export failed. Check console for details.', 'error');
    }
}

// Import Data
function importData() {
    document.getElementById('importFile').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            if (data.expenses && Array.isArray(data.expenses)) {
                expenses = data.expenses;
                localStorage.setItem('expenses', JSON.stringify(expenses));
            }

            if (data.savings !== undefined) {
                savings = data.savings;
                localStorage.setItem('savings', JSON.stringify(savings));
            }

            if (data.streakDays) {
                localStorage.setItem('streakDays', JSON.stringify(data.streakDays));
            }

            updateUI();
            showNotification('Data imported successfully!', 'success');
        } catch (error) {
            console.error('Import error:', error);
            showNotification('Invalid file format', 'error');
        }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
}

// Initialize app
function init() {
    // Get DOM elements
    amountInput = document.getElementById('amount');
    categorySelect = document.getElementById('category');
    expenseList = document.getElementById('expenseList');
    chartCanvas = document.getElementById('chart');
    totalExpensesEl = document.getElementById('totalExpenses');
    streakElement = document.getElementById('streak');
    progressElement = document.getElementById('progress');
    emTextElement = document.getElementById('emText');
    tipsElement = document.getElementById('tips');
    addBtnText = document.getElementById('addBtnText');
    addBtnSpinner = document.getElementById('addBtnSpinner');
    installPrompt = document.getElementById('installPrompt');
    installBtn = document.getElementById('installBtn');
    dismissBtn = document.getElementById('dismissBtn');
    offlineIndicator = document.getElementById('offlineIndicator');

    updateUI();

    // Request notification permission for PWA
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        installPrompt.classList.add('hidden');
    }

    // Online/Offline detection
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

// Update online/offline status
function updateOnlineStatus() {
    if (navigator.onLine) {
        offlineIndicator.classList.add('hidden');
        showNotification('Back online!', 'success');
    } else {
        offlineIndicator.classList.remove('hidden');
        showNotification('You are offline. Data will sync when connection returns.', 'warning');
    }
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
