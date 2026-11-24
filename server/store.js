/**
 * Shared in-memory users and bios. Demo only; restarts wipe state.
 */

const users = {
  alice: { password: 'password123', bio: 'Hello, I am Alice.' },
  bob: { password: 'password123', bio: 'Bob was here.' },
};

function findUser(username) {
  return users[username] || null;
}

function checkCredentials(username, password) {
  const user = findUser(username);
  if (!user) return false;
  return user.password === password;
}

function getBio(username) {
  const user = findUser(username);
  return user ? user.bio : null;
}

function setBio(username, bio) {
  const user = findUser(username);
  if (!user) return false;
  user.bio = bio;
  return true;
}

module.exports = {
  users,
  findUser,
  checkCredentials,
  getBio,
  setBio,
};
