const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Redirect root of :3001 to dashboard
app.get('/', (req, res) => res.redirect('/dashboard/'));
app.get('/dashboard', (req, res) => res.redirect('/dashboard/'));

// Serve dashboard
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard')));

app.listen(PORT, () => {
  console.log(`Dar Tanur Dashboard running at http://localhost:${PORT}/dashboard`);
});
