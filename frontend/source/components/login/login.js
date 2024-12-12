async function register() {
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
  alert(data.message);
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
  alert(data.message);
}

async function logout() {
  const response = await fetch("/logout");
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
  alert(data.message);
}
