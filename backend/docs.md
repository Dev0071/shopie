# Cart Controller

This module defines the controller functions for managing the shopping cart.

## Add Product to Cart

### `addToCart` Function

Adds a product to the user's shopping cart.

**Endpoint:** `POST /cart/:product_id/`

**Request:**

- **Parameters:**
  - `product_id` (string, required): The ID of the product to be added to the cart.
  - `user_id` (string, optional): The ID of the user (if authenticated).

- **Request Body:**
  - `session_id` (string, optional): The session ID. If not provided, a new session will be created.

**Response:**

- **Success Response (201 - Created):**
  - **Body:**
    ```json
    {
        "status": "success",
        "message": "Product added to cart successfully",
        "sess": "session_id"
    }
    ```

- **Error Responses:**
  - 404 Not Found:
    - Product Is Not Available
  - 500 Internal Server Error:
    - Error Adding Product to Cart

## Get Cart Items

### `getCartItems` Function

Retrieves the items in the user's shopping cart.

**Endpoint:** `GET /cart/items/:session_id/:user_id?`

**Request:**

- **Parameters:**
  - `session_id` (string, required): The session ID.
  - `user_id` (string, optional): The ID of the user (if authenticated).

**Response:**

- **Success Response (200 - OK):**
  - **Body:**
    ```json
    {
        "status": "success",
        "products": [array_of_products]
    }
    ```

- **Error Responses:**
  - 404 Not Found:
    - Cart is Empty
  - 500 Internal Server Error:
    - Error Getting Items From Cart

## Empty Cart

### `emptyCart` Function

Removes all items from the user's shopping cart.

**Endpoint:** `POST /cart/all/items/`

**Request:**

- **Request Body:**
  - `session_id` (string, required): The session ID.
  - `user_id` (string, optional): The ID of the user (if authenticated).

**Response:**

- **Success Response (200 - OK):**
  - **Body:**
    ```json
    {
        "status": "success",
        "message": "Products were removed from cart"
    }
    ```

- **Error Responses:**
  - 500 Internal Server Error:
    - Error Removing Products From Cart

## Remove Item from Cart

### `removeItemFromCart` Function

Removes a specific item from the user's shopping cart.

**Endpoint:** `POST /cart/item/:product_id/`

**Request:**

- **Parameters:**
  - `product_id` (string, required): The ID of the product to be removed from the cart.

- **Request Body:**
  - `session_id` (string, required): The session ID.
  - `user_id` (string, optional): The ID of the user (if authenticated).

**Response:**

- **Success Response (200 - OK):**
  - **Body:**
    ```json
    {
        "status": "success",
        "message": "Product was removed from cart"
    }
    ```

- **Error Responses:**
  - 404 Not Found:
    - Product was not found in the cart
  - 500 Internal Server Error:
    - Error Removing Product From Cart

## Remove All Such Items from Cart

### `removeallSuchItemsFromCart` Function

Removes all instances of a specific item from the user's shopping cart.

**Endpoint:** `POST /cart/all/items/:product_id/`

**Request:**

- **Parameters:**
  - `product_id` (string, required): The ID of the product to be removed from the cart.

- **Request Body:**
  - `session_id` (string, required): The session ID.
  - `user_id` (string, optional): The ID of the user (if authenticated).

**Response:**

- **Success Response (200 - OK):**
  - **Body:**
    ```json
    {
        "status": "success",
        "message": "Product was removed from cart"
    }
    ```

- **Error Responses:**
  - 404 Not Found:
    - Product was not found in the cart
  - 500 Internal Server Error:
    - Error Removing Item

# Cart Routes

This module defines the routes for the Cart API.

- **POST /cart/:product_id/** - Add Product to Cart
- **GET /cart/items/:session_id/:user_id?** - Get Cart Items
- **POST /cart/item/:product_id/** - Remove Item from Cart
- **POST /cart/all/items/** - Empty Cart
- **POST /cart/all/items/:product_id/** - Remove All Such Items from Cart


Placeholders are `:product_id`, `:session_id`, and `:user_id` 
