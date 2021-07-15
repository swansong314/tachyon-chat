const usersOnline = [];

function addUser(user) {
  usersOnline.push(user);
}

function getUsers() {
  return usersOnline;
}

function removeUser(user) {
  usersOnline = usersOnline.filter((users) => {
    users.id != user.id;
  });
}

// export module
module.exports = { usersOnline, addUser, getUsers, removeUser };
