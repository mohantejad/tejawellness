import { apiFetch } from '@/api/base';

export async function registerUser(payload: {
  email: string;
  password: string;
  re_password: string;
  first_name?: string;
  last_name?: string;
}) {
  return apiFetch('/auth/users/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: { email: string; password: string; remember_me?: boolean }) {
  return apiFetch('/auth/jwt/create/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMe() {
  return apiFetch('/auth/users/me/');
}

export async function logoutUser() {
  return apiFetch('/auth/logout/', {
    method: 'POST',
  });
}

export async function resendActivation(payload: { email: string }) {
  return apiFetch('/auth/users/resend_activation/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function activateAccount(payload: { uid: string; token: string }) {
  return apiFetch('/auth/users/activation/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(payload: { email: string }) {
  return apiFetch('/auth/users/reset_password/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function confirmPasswordReset(payload: {
  uid: string;
  token: string;
  new_password: string;
  re_new_password: string;
}) {
  return apiFetch('/auth/users/reset_password_confirm/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function requestUsernameReset(payload: { email: string }) {
  return apiFetch('/auth/users/reset_username/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function confirmUsernameReset(payload: {
  uid: string;
  token: string;
  new_username: string;
}) {
  return apiFetch('/auth/users/reset_username_confirm/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function setPassword(payload: {
  current_password: string;
  new_password: string;
  re_new_password: string;
}) {
  return apiFetch('/auth/users/set_password/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function setUsername(payload: {
  current_password: string;
  new_username: string;
}) {
  return apiFetch('/auth/users/set_username/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getGoogleAuthUrl(redirect_uri: string) {
  const query = new URLSearchParams({ redirect_uri }).toString();
  return apiFetch(`/auth/o/google-oauth2/?${query}`);
}

export async function googleLogin(payload: { code: string; state: string; redirect_uri: string }) {
  const query = new URLSearchParams(payload).toString();
  return apiFetch(`/auth/o/google-oauth2/?${query}`, { method: 'POST' });
}
