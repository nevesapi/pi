export function getUser() {
  return JSON.parse(sessionStorage.getItem("user")) || [];
}

export function getUserInfo() {
  return JSON.parse(sessionStorage.getItem("userInfo")) || [];
}

export function saveUser(value) {
  sessionStorage.setItem("user", JSON.stringify(value));
}

export function saveUserInfo(value) {
  sessionStorage.setItem("userInfo", JSON.stringify(value));
}
