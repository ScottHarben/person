export default function checkStorageForUser() {
  const localUser = localStorage.getItem("user");
  const sessionUser = sessionStorage.getItem("user");
  let user = {};
  if (localUser) {
    user = JSON.parse(localUser);
  } else if (sessionUser) {
    user = JSON.parse(sessionUser);
  }
  const loggedIn = user.username && user.token ? true : false;
  return { user, loggedIn };
}
