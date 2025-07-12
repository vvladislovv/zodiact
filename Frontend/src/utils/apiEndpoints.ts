/**
 * Centralized API endpoints configuration.
 * All API URLs are defined here to facilitate easy updates and maintenance.
 */
const API_BASE_URL = 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  ANALYZE: `${API_BASE_URL}/analyze`,
  COFFEE_INTERPRET: `${API_BASE_URL}/coffee-interpret`,
  TAROT_REVEAL: `${API_BASE_URL}/tarot-reveal`,
  PERSONAL_FORECAST: `${API_BASE_URL}/personal-forecast`,
  RUNES_REVEAL: `${API_BASE_URL}/runes-reveal`,
  SPIRITUAL_GROWTH: `${API_BASE_URL}/spiritual-growth`,
  TAROT_READING: `${API_BASE_URL}/tarot-reading`,
  GET_USER_PROFILE: `${API_BASE_URL}/user/profile`,
  COFFEE_FORTUNE: `${API_BASE_URL}/coffee/fortune`,
  TAROT_HISTORY: `${API_BASE_URL}/tarot-history`,
  USER_HISTORY: `${API_BASE_URL}/user/history`,
  DELETE_TAROT_HISTORY: `${API_BASE_URL}/delete-tarot-history`,
  USER_DELETE_TAROT_HISTORY: `${API_BASE_URL}/user/delete-tarot-history`,
  UPDATE_AUTOPAYMENT: `${API_BASE_URL}/payment/update-autopayment`,
  CREATE_PAYMENT: `${API_BASE_URL}/payment/yookassa/create-payment`,
  GET_SUBSCRIPTION_DETAILS: `${API_BASE_URL}/payment/subscription-details`,
  CANCEL_SUBSCRIPTION: `${API_BASE_URL}/payment/cancel-subscription`,
};
