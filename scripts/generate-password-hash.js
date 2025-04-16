// generatePasswordHashSync.js
const bcrypt = require('bcryptjs');

// Replace this with the actual password you want to hash
const password = 'Admin123!';

// Generate salt and hash in one step (synchronously)
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

// Output the generated hash
console.log('Password:', password);
console.log('Hashed Password:', hash);