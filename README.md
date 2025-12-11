PayShare – Collaborative Expense Manager

PayShare is a lightweight and interactive web-based tool designed to simplify group expense tracking, shared payments, and balance settlement among friends, family, or teams. It helps users log shared expenses, calculate individual shares, and understand who owes whom — all in real-time and directly in the browser with no setup required.

Features

Add and manage shared expenses with descriptions, amounts, and contributors
Automatic calculation of each member’s share and outstanding balance
Dashboard view for total, paid, and pending amounts
Editable and removable expense entries with instant recalculation
Visual, structured table for all logged expenses
Lightweight, responsive interface suitable for all devices

Optional Enhancements

Export group summaries to PDF or CSV
Notifications or reminders for pending payments
Integration with payment APIs for mock settlements
Multi-group management for trips, events, offices, etc.
Pie/Bar charts for expense distribution using Chart.js

PayShare/
│
├── index.html
├── style.css
├── app.js
├── README.md
│
├── data/
│   └── sample_expenses.json
│
└── assets/
    └── (icons, images, etc.)

Challenges

Handling floating-point precision in financial calculations
Designing a clean UI for quick data entry and clarity
Efficient dynamic updates when expenses are added, edited, or deleted
Managing multiple contributors and ensuring fair balance distribution

Usage

Open index.html in your browser.
Add a new shared expense using the input fields.
View auto-calculated totals and balances on the dashboard.
Edit or delete expenses dynamically as needed.
Use sample data (optional) to test the system.

Author
Jaesha Safoora
