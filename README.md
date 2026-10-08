# 💊 Medicine Reminder
# 💊 [Medicine Reminder](https://aashfaak.github.io/Medicine-Reminder/)
A simple and user-friendly web application that helps you keep track of your medicines and never miss a dose.

The app allows users to add medicines, set multiple dose times, choose meal timing, add notes, and mark doses as taken.

---

## ✨ Features

* 💊 Add and manage medicines
* ⏰ Set multiple dose times per day
* 🔔 Medicine reminder notifications
* 🍽️ Set meal timing — Before, After, With, or Any time
* 🔄 Set medicine repetition for a specific number of days
* ♾️ Option to continue medicine until manually stopped
* ✅ Mark doses as **Taken** or **Pending**
* 📝 Add notes for each medicine
* 💾 Data stored locally using **LocalStorage**
* 📱 Mobile-friendly responsive design
* 🌐 Progressive Web App (PWA) support
* 🎨 Clean and modern user interface
* ✨ Smooth animations and interactions
* 🌍 Bangla / English language support

---

## 🛠️ Technologies Used

* **HTML5** — Structure
* **CSS3** — Styling & Responsive Design
* **JavaScript** — Application logic
* **LocalStorage** — Data persistence
* **Web Notifications API** — Reminder notifications
* **Service Worker** — PWA & offline support
* **Web App Manifest** — Installable web app
* **Node.js + Web Push** — Server-side reminders while the app is closed

---

## 📂 Project Structure

```text
Medicine-Reminder/
│
├── index.html          # Main application
├── style.css           # Styling
├── app.js              # Application logic
├── manifest.json       # PWA configuration
├── sw.js               # Service worker
├── server.js           # Web Push API and reminder scheduler
├── package.json        # Node.js dependencies and commands
└── README.md           # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aashfaak/medicine-reminder.git
```

### 2. Open the project

```bash
cd medicine-reminder
```

### 3. Configure Web Push

Background reminders need a running Node.js server and HTTPS. Opening `index.html` directly or using a static-only host will not send reminders while the app is closed.

1. Install Node.js 20 or later.
2. Install the dependencies:

   ```bash
   npm install
   ```

   In Windows PowerShell, use `npm.cmd install` if script execution policy blocks `npm`.

3. Generate a VAPID key pair:

   ```bash
   npx web-push generate-vapid-keys
   ```

   In Windows PowerShell, use `npx.cmd web-push generate-vapid-keys`.

4. Copy `.env.example` to `.env`, then set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` using the generated keys and an email address you control. Keep the private key secret.
5. Start the app:

   ```bash
   npm start
   ```

   In Windows PowerShell, use `npm.cmd start`.

6. Open `http://localhost:3000` for local testing. For a phone or production, deploy the app on an always-on host with HTTPS and persistent storage. Set `DATA_FILE` to a persistent disk path on that host.
7. Open the deployed URL on the phone, install the app from the browser if available, tap the bell, and allow notifications.

The host must keep the Node.js process running for reminders to be sent on time. A sleeping/free-tier service cannot guarantee delivery while it is asleep.

---

## 📱 How It Works

1. Click **Add Medicine**
2. Enter the medicine name and dosage
3. Select how many times a day you need to take it
4. Set the dose times
5. Choose when to take the medicine
6. Set the repetition period
7. Add optional notes
8. Save the medicine
9. Enable notifications by tapping the bell while online
10. Mark each dose as **Taken** after taking it

---

## 🔔 Notifications

The app stores its full medicine list in the browser's **LocalStorage**. When push is enabled, it sends the server only medicine name, dosage, dose times, repeat duration, active/stopped status, and time zone so the server can schedule Web Push notifications.

> **Note:** Web Push can arrive when the app is closed, but delivery timing depends on the phone OS, browser notification settings, network, and the server remaining online. Android Chrome/Edge generally support installed PWAs. iPhone/iPad require a supported iOS version and the site added to the Home Screen. Grant notification permission and disable any battery restrictions that prevent the browser from receiving push.

---

## 🔒 Privacy

The full medicine list remains in **LocalStorage**. When push is enabled, the server stores a minimal schedule and the push subscription in `DATA_FILE`; this includes medicine names and dosage. Keep the data file and VAPID private key private, use HTTPS, and configure a persistent disk before deployment.

This project has no user accounts or multi-user access controls. Use a private deployment; anyone with access to the deployed server or its data file may be able to read stored schedules.

---

## 🎯 Future Improvements

* 📲 Android application
* ☁️ Cloud synchronization
* 👤 User accounts
* 👨‍👩‍👧 Family medicine management
* 🔔 Reliable background push notifications (Node.js Web Push backend included)
* 📊 Medicine history and reports
* 🩺 Doctor / caregiver sharing
* 💾 Backup and restore
* 🌙 Dark mode improvements

---

## 📸 Preview

> Screenshots coming soon.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

If you find a bug or have an idea for a new feature, feel free to open an **Issue** or submit a **Pull Request**.

---

## 👨‍💻 Developer

**Ashfak**

[**Ashfak — Build · Think · Explore**](https://mohammadashfak.vercel.app/)



---

## 📄 License

This project is open-source and available for educational and personal use.

---

⭐ **If you find this project useful, consider giving it a star!**
