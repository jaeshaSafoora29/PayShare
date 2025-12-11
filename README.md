# PayShare
**Domain:** Finance

PayShare is a small, self-contained shared expense splitter built as a static web app (HTML/CSS/JavaScript).
It lets you add expenses, auto-calculates equal shares among contributors, shows a dashboard of totals,
allows edit/delete/settle operations, and exports CSV.

## Files
- `index.html` — main app
- `css/style.css` — styles
- `js/app.js` — application logic (vanilla JS)
- `data/sample_expenses.json` — example dataset
- `README.md` — this file

## Features Implemented
- Add and manage shared expenses (title, amount, payer, contributors).
- Auto-calculation of each member's share (equal split).
- Dashboard for total spent, pending amounts, and member list.
- List of expenses with edit / delete / settle actions.
- Summary table and simple bar chart showing net balances.
- Export expenses to CSV.
- Local storage persistence so data stays in browser.

## How to run
1. Unzip the provided folder.
2. Open `index.html` in your browser (no server required).
3. Use the form to add sample expenses, or click "Load Sample Data".

## Notes / Challenges
- Floating-point rounding handled by rounding to two decimals for display and calculations.
- This is a demo static app; to extend:
  - Add user accounts, real authentication and a backend.
  - Integrate payment APIs for actual settlements.
  - Add more robust splitting rules (percent, shares etc.)

## Deliverables You Can Upload to GitHub
- All project files in this folder can be pushed to a GitHub repository.
- Optionally create a `gh-pages` branch to host the static site via GitHub Pages.

