const { createApp } = require('./app');

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
  console.log(`  Vulnerable: http://localhost:${PORT}/vulnerable/login`);
  console.log(`  Hardened:   http://localhost:${PORT}/hardened/login`);
});
