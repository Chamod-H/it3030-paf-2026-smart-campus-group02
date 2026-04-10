/**
 * Local Storage Utility Library
 * Centralizes the keys and serialization logic for interacting with the browser's 
 * window.localStorage. Prevents nasty bugs caused by typos in key names across files.
 */

const KEYS = {
  TOKEN: 'smart_campus_token',
  USER: 'smart_campus_user'
};

/**
 * ── Token Persistence ──
 */

export const saveToken = (token) => {
  if (!token || typeof window === 'undefined') return;
  localStorage.setItem(KEYS.TOKEN, token);
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEYS.TOKEN);
};

export const removeToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.TOKEN);
};

/**
 * ── User Payload Persistence ──
 */

export const saveUser = (userObj) => {
  if (!userObj || typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.USER, JSON.stringify(userObj));
  } catch (error) {
    console.error("Failed to serialize user object into storage:", error);
  }
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(KEYS.USER);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to parse user object from storage:", error);
    return null;
  }
};

export const removeUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.USER);
};

/**
 * ── Universal Clearance ──
 */

export const clearAppStorage = () => {
  if (typeof window === 'undefined') return;
  // If there are other system keys you don't want to wipe (like Theme settings),
  // target remove actions instead of a raw `.clear()`.
  removeToken();
  removeUser();
};

const localStorageUtils = {
  KEYS,
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
  clearAppStorage
};

export default localStorageUtils;
