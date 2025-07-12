# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Backend Endpoints

Below is a comprehensive list of all endpoints used in the ZodiacBot Frontend project for communication with the backend. Each endpoint includes the HTTP method, path, and data sent to the backend. Note that paths are listed as they appear in the codebase, with or without the "/api" prefix based on their implementation.

### User Management
- **GET /user/profile**
  - **Description**: Retrieves user profile information.
  - **Data Sent**: Query parameter `user_id` (e.g., '7300593025').
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000
- **POST /user/subscribe**
  - **Description**: Subscribes a user to a plan.
  - **Data Sent**: JSON body with `plan` (e.g., 'День', 'Неделя', 'Месяц').
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000
- **POST /user/purchase**
  - **Description**: Processes a subscription purchase.
  - **Data Sent**: JSON body with `plan` and `paymentDetails` (object with payment information).
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000
- **PUT /user/update-profile** (Potential Endpoint)
  - **Description**: Updates user profile information (not currently implemented in frontend but suggested for completeness).
  - **Data Sent**: JSON body with updated user information (e.g., `telegram_name`, `email`).
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000

### Card and Tarot Operations
- **GET /cards/list**
  - **Description**: Fetches a list of available cards.
  - **Data Sent**: None.
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000
- **GET /cards/interpret/{cardName}**
  - **Description**: Gets interpretation for a specific card based on a question.
  - **Data Sent**: Path parameter `cardName`, query parameter `question`.
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000
- **POST /tarot/draw**
  - **Description**: Draws tarot cards for a reading based on a question and layout type.
  - **Data Sent**: JSON body with `question` and `layoutType` (default '3_cards').
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000
- **GET /tarot/history**
  - **Description**: Retrieves the history of tarot readings for a user.
  - **Data Sent**: Query parameter `user_id` (e.g., '7300593025').
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000
- **DELETE /tarot/clear-history**
  - **Description**: Clears the tarot reading history for a user.
  - **Data Sent**: Query parameter `user_id` (e.g., '7300593025').
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000
- **PUT /tarot/update-entry** (Potential Endpoint)
  - **Description**: Updates a specific tarot reading entry, e.g., to add user notes or modify details (not currently implemented in frontend but suggested for completeness).
  - **Data Sent**: JSON body with `entry_id` and updated data (e.g., `notes`, `summary`).
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000

### Coffee Fortune Telling
- **POST /coffee/fortune**
  - **Description**: Submits a coffee fortune reading request with an image and question.
  - **Data Sent**: JSON body with `user_id` (e.g., '7300593025'), `question`, and `image_base64` (base64 encoded image data).
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000
- **GET /coffee/history** (Potential Endpoint)
  - **Description**: Retrieves the history of coffee fortune readings for a user (not currently implemented in frontend but suggested for completeness).
  - **Data Sent**: Query parameter `user_id` (e.g., '7300593025').
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000
- **DELETE /coffee/clear-history** (Potential Endpoint)
  - **Description**: Clears the coffee fortune reading history for a user (not currently implemented in frontend but suggested for completeness).
  - **Data Sent**: Query parameter `user_id` (e.g., '7300593025').
  - **Headers**: `X-API-Key` for authentication.
  - **Base URL**: http://localhost:8000

### Additional Endpoints (Direct Fetch Calls)
- **POST /update-autopayment**
  - **Description**: Updates the autopayment status for a user.
  - **Data Sent**: JSON body with `enabled` (boolean indicating autopayment status).
  - **Headers**: `Content-Type: application/json`.
  - **Base URL**: Relative path, likely resolved by frontend server or proxy.
  - **Note**: Path updated to remove "/api" prefix as per project requirements.
- **POST /yookassa/create-payment**
  - **Description**: Creates a payment request for subscription purchase via Yookassa.
  - **Data Sent**: JSON body with `plan` (subscription plan) and `price` (amount in rubles).
  - **Headers**: `Content-Type: application/json`.
  - **Base URL**: Relative path, likely resolved by frontend server or proxy.
  - **Note**: Path updated to remove "/api" prefix as per project requirements.
- **POST /coffee-interpret**
  - **Description**: Interprets coffee reading symbols or cards based on user selection.
  - **Data Sent**: JSON body with `area` (selected area of coffee cup) or `cards` (array of selected card indices).
  - **Headers**: `Content-Type: application/json`.
  - **Base URL**: Relative path, likely resolved by frontend server or proxy.
  - **Note**: Path updated to remove "/api" prefix as per project requirements.
- **POST /tarot-reveal**
  - **Description**: Reveals the meaning of selected tarot cards for various readings.
  - **Data Sent**: JSON body with `cards` (array of selected card indices).
  - **Headers**: `Content-Type: application/json`.
  - **Base URL**: Relative path, likely resolved by frontend server or proxy.
  - **Note**: Path updated to remove "/api" prefix as per project requirements.
- **POST /personal-forecast**
  - **Description**: Provides a personal forecast based on selected cards.
  - **Data Sent**: JSON body with `cards` (array of selected card indices).
  - **Headers**: `Content-Type: application/json`.
  - **Base URL**: Relative path, likely resolved by frontend server or proxy.
  - **Note**: Path updated to remove "/api" prefix as per project requirements.
- **POST /runes-reveal**
  - **Description**: Interprets selected runes for relationship analysis.
  - **Data Sent**: JSON body with `runes` (array of selected rune indices).
  - **Headers**: `Content-Type: application/json`.
  - **Base URL**: Relative path, likely resolved by frontend server or proxy.
  - **Note**: Path updated to remove "/api" prefix as per project requirements.
- **POST /analyze**
  - **Description**: Analyzes a situation based on selected cards.
  - **Data Sent**: JSON body with `cards` (array of selected card indices).
  - **Headers**: `Content-Type: application/json`.
  - **Base URL**: Relative path, likely resolved by frontend server or proxy.
  - **Note**: Path updated to remove "/api" prefix as per project requirements.
- **POST /spiritual-growth**
  - **Description**: Provides spiritual growth advice based on a selected card.
  - **Data Sent**: JSON body with `cards` (array of selected card indices, typically one card).
  - **Headers**: `Content-Type: application/json`.
  - **Base URL**: Relative path, likely resolved by frontend server or proxy.
  - **Note**: Path updated to remove "/api" prefix as per project requirements.
- **POST /tarot-reading**
  - **Description**: Provides a tarot reading based on the specified type.
  - **Data Sent**: JSON body with `type` (string indicating the type of reading).
  - **Headers**: `Content-Type: application/json`.
  - **Base URL**: Relative path, likely resolved by frontend server or proxy.
  - **Note**: Path updated to remove "/api" prefix as per project requirements.

### Requirements for API Calls
- **Authentication**: Most API calls to endpoints under `/user/`, `/cards/`, `/tarot/`, and `/coffee/` require an `X-API-Key` header for authentication. This key is typically sourced from environment variables or local storage (`api_key`).
- **Content Type**: All POST requests must include a `Content-Type: application/json` header to specify the format of the request body.
- **Base URL**: Endpoints managed via `apiClient` (axios instance) use a base URL of `http://localhost:8000`. Direct fetch calls (e.g., `/update-autopayment`, `/yookassa/create-payment`, and endpoints listed under "Additional Endpoints") use relative paths, which are likely resolved by a frontend server or proxy to the appropriate backend service.
- **Authorization Header**: For endpoints using `apiClient`, an `Authorization` header with a Bearer token may be dynamically added if an `api_key` is found in local storage.

This documentation covers all backend interactions found in the ZodiacBot frontend codebase as of the latest analysis, along with suggested endpoints for update operations and history management that could be implemented on the backend for a more complete API.
