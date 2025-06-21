export const checkEmailExists = async (email) => {
  const response = await fetch('http://localhost:5000/api/users/check-email?email=' + encodeURIComponent(email));
  const data = await response.json();
  return data.exists;
};

export const checkUsernameExists = async (username) => {
  const response = await fetch('http://localhost:5000/api/users/check-username?username=' + encodeURIComponent(username));
  const data = await response.json();
  return data.exists;
};

export const registerUser = async (user) => {
  const response = await fetch('http://localhost:5000/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
  return response;
};

export const loginUser = async (credentials) => {
  const response = await fetch('http://localhost:5000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response;
};