/**
 * Centralized API functions for making requests to the backend.
 * These functions use the endpoints defined in apiEndpoints.ts.
 */
import { API_ENDPOINTS } from './apiEndpoints';

/**
 * Generic function to make a POST request to the specified endpoint.
 * @param endpoint The API endpoint to call.
 * @param data The data to send in the request body.
 * @returns The response data from the server.
 */
async function postRequest(endpoint: string, data: any) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-API-Key': 'V1' // API key for authentication
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Endpoint not found (404). Please check if the server is running and the endpoint exists: ${endpoint}`);
      }
      if (response.status === 422) {
        return { interpretation: "К сожалению, произошла ошибка при получении ответа от ИИ. Пожалуйста, попробуйте снова через некоторое время." };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Generic function to make a GET request to the specified endpoint.
 * @param endpoint The API endpoint to call.
 * @returns The response data from the server.
 */
async function getRequest(endpoint: string) {
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'X-API-Key': 'V1' // API key for authentication
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Endpoint not found (404). Please check if the server is running and the endpoint exists: ${endpoint}`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Analyze situation based on selected cards and optional category.
 * @param cards The selected cards for analysis.
 * @param category Optional category for focused analysis.
 * @param userId The user ID associated with the request.
 * @returns The analysis result.
 */
export async function analyzeSituation(cards: number[], category: string = '', userId: string = '7300593025') {
  return postRequest(API_ENDPOINTS.ANALYZE, { cards, category, userId });
}

/**
 * Interpret coffee reading based on area or selected cards.
 * @param data The data for interpretation (area or cards).
 * @param readingType Optional reading type for focused interpretation.
 * @param userId The user ID associated with the request.
 * @returns The interpretation result.
 */
export async function interpretCoffee(data: { area?: string; cards?: number[] }, readingType: string = '', userId: string = '7300593025') {
  return postRequest(API_ENDPOINTS.COFFEE_INTERPRET, { ...data, readingType, userId });
}

/**
 * Reveal tarot cards for love readings or general tarot readings.
 * @param cards The selected tarot cards.
 * @param timePeriods The time periods associated with the cards (optional).
 * @param readingType The type of reading selected (optional).
 * @param userId The user ID associated with the request.
 * @returns The revelation result.
 */
export async function revealTarot(cards: number[], timePeriods: string[] = [], readingType: string = '', userId: string = '7300593025') {
  return postRequest(API_ENDPOINTS.TAROT_REVEAL, { cards, timePeriods, readingType, userId });
}

/**
 * Get personal forecast based on selected cards and optional category.
 * @param cards The selected cards for forecast.
 * @param category Optional category for focused forecast.
 * @param userId The user ID associated with the request.
 * @returns The forecast result.
 */
export async function getPersonalForecast(cards: number[], category: string = '', userId: string = '7300593025') {
  return postRequest(API_ENDPOINTS.PERSONAL_FORECAST, { cards, category, userId });
}

/**
 * Reveal runes for relationship status.
 * @param runes The selected runes.
 * @param runeAspect Optional rune aspect of the relationship for focused analysis.
 * @param relationshipAspect Optional relationship aspect for broader context.
 * @param userId The user ID associated with the request.
 * @returns The revelation result.
 */
export async function revealRunes(runes: number[], runeAspect: string = '', relationshipAspect: string = '', userId: string = '7300593025') {
  return postRequest(API_ENDPOINTS.RUNES_REVEAL, { runes, runeAspect, relationshipAspect, userId });
}

/**
 * Get spiritual growth advice based on selected card and optional aspect.
 * @param cards The selected card for advice.
 * @param aspect Optional aspect of spiritual growth for focused advice.
 * @param userId The user ID associated with the request.
 * @returns The advice result.
 */
export async function getSpiritualGrowthAdvice(cards: number[], aspect: string = '', userId: string = '7300593025') {
  return postRequest(API_ENDPOINTS.SPIRITUAL_GROWTH, { cards, aspect, userId });
}

/**
 * Get tarot reading based on reading type.
 * @param type The type of tarot reading.
 * @param userId The user ID associated with the request.
 * @returns The reading result.
 */
export async function getTarotReading(type: string, userId: string = '7300593025') {
  return postRequest(API_ENDPOINTS.TAROT_READING, { type, userId });
}

/**
 * Update autopayment status.
 * @param enabled Whether autopayment is enabled.
 * @param userId The user ID associated with the request.
 * @returns The update result.
 */
export async function updateAutopayment(enabled: boolean, userId: string = '7300593025') {
  return postRequest(API_ENDPOINTS.UPDATE_AUTOPAYMENT, { enabled, userId });
}

/**
 * Get user profile data.
 * @param userId The user ID to fetch profile for.
 * @returns The user profile data.
 */
export async function getUserProfile(userId: string = '7300593025') {
  const url = `${API_ENDPOINTS.GET_USER_PROFILE}?user_id=${userId}`;
  return getRequest(url);
}

/**
 * Get coffee fortune reading.
 * @param userId The user ID.
 * @param question The question for the reading.
 * @param photo The photo for the reading (base64 string).
 * @returns The coffee fortune reading result.
 */
export async function getCoffeeFortune(userId: string = '', question: string = '', photo: string = '') {
  return postRequest(API_ENDPOINTS.COFFEE_FORTUNE, { userId, question, photo });
}

/**
 * Get tarot history.
 * @param userId The user ID associated with the request.
 * @returns The tarot history data as an array.
 */
export async function getTarotHistory(userId: string = '7300593025') {
  const url = `${API_ENDPOINTS.USER_HISTORY}?user_id=${userId}`;
  try {
    const response = await getRequest(url);
    // Ensure the response is an array; if it's an object with a history array, extract it
    if (Array.isArray(response)) {
      return response;
    } else if (response && Array.isArray(response.history)) {
      return response.history;
    } else {
      console.error('Unexpected response format for tarot history:', response);
      return [];
    }
  } catch (error) {
    console.error('Error fetching tarot history:', error);
    return [];
  }
}

/**
 * Delete tarot history entry.
 * @param id The ID of the history entry to delete.
 * @param userId The user ID associated with the request.
 * @returns The deletion result.
 */
export async function deleteTarotHistory(id: string, userId: string = '7300593025') {
  return postRequest(API_ENDPOINTS.USER_DELETE_TAROT_HISTORY, { id, userId });
}

/**
 * Create a payment through Yookassa.
 * @param plan The subscription plan.
 * @param price The price of the plan.
 * @returns The payment creation result.
 */
export async function createPayment(plan: string, price: number) {
  return postRequest(API_ENDPOINTS.CREATE_PAYMENT, { plan, price });
}

/**
 * Get subscription details.
 * @returns The subscription details.
 */
export async function getSubscriptionDetails() {
  return postRequest(API_ENDPOINTS.GET_SUBSCRIPTION_DETAILS, {});
}

/**
 * Cancel subscription.
 * @returns The cancellation result.
 */
export async function cancelSubscription() {
  return postRequest(API_ENDPOINTS.CANCEL_SUBSCRIPTION, {});
}
