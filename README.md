# SmartKharch - Expense Tracker PWA

A modern, offline-first Progressive Web App for tracking daily expenses with beautiful UI and comprehensive features.

## 🚀 Features

- ✅ **Offline Support**: Works completely offline once installed
- 📊 **Interactive Charts**: Visual expense breakdown with Chart.js
- 🔥 **Streak Tracking**: Track no-spend days
- 🛡️ **Emergency Fund**: Progress tracking for financial goals
- 💡 **Smart Tips**: AI-powered spending suggestions
- 📱 **PWA Ready**: Install on mobile devices
- 🌙 **Dark Mode**: Automatic dark mode support
- 💾 **Data Export/Import**: Backup and restore your data
- 🔔 **Notifications**: Smart alerts and reminders

## 📱 Offline Functionality

SmartKharch is designed to work completely offline:

### What Works Offline:
- ✅ Add/Edit/Delete expenses
- ✅ View expense history
- ✅ Charts and statistics
- ✅ All calculations and features
- ✅ Data persistence (localStorage)

### What Requires Internet:
- 📊 Chart.js library (cached after first load)
- 🔤 Google Fonts (cached after first load)
- 📤 Data export/import (local file operations)

### First-Time Setup:
1. Load the app online once to cache all assets
2. Install as PWA (optional but recommended)
3. App works offline thereafter

### Data Storage:
- All expense data stored locally in browser
- No internet required for core functionality
- Data persists between sessions
- Export feature for backup

## 🛠️ Installation

### Web Version:
1. Visit the app in a modern browser
2. The service worker will cache assets automatically
3. Use offline after first load

### PWA Installation:
1. Open in Chrome/Edge/Safari
2. Look for "Add to Home Screen" prompt
3. Or use browser menu → "Install App"
4. App appears as native mobile app

## 📊 Usage

1. **Add Expenses**: Enter amount, select category, tap "Add Expense"
2. **View Charts**: See spending breakdown by category
3. **Track Progress**: Monitor emergency fund and streaks
4. **Export Data**: Backup your expense history
5. **Offline Mode**: Works without internet connection

## 🔧 Technical Details

- **Framework**: Vanilla JavaScript (ES6+)
- **Styling**: Modern CSS with CSS Variables
- **Charts**: Chart.js (cached for offline use)
- **Storage**: localStorage API
- **PWA**: Service Worker + Web App Manifest
- **Responsive**: Mobile-first design

## 🌐 Browser Support

- Chrome 70+
- Firefox 68+
- Safari 12+
- Edge 79+

## 📝 License

This project is open source and available under the MIT License.

---

**Made with ❤️ for better expense tracking**</content>
<parameter name="filePath">c:\Users\Wave Computer's\OneDrive\Desktop\smartkharch\README.md