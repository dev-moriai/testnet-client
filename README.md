# testnet-client

A lightweight package to interact with the Mori Testnet Token Manager API. This package provides methods to handle token transfers, pay requests, and ticket status management.

## Features
- **Authentication**: Obtain an auth token via login.
- **Ticket Management**: Submit pay requests and check ticket status.
- **Mori Testnet**: Retrieve event details on the Mori Testnet using `tonviewer`.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/dev-moriai/testnet-client.git
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your secret:
    ```bash
    SECRET=your_secret_key
    ```

## Usage

### Import Methods

To use the package, import the required methods from `methods.js`:
```javascript
import { get, post } from "./methods.js";
import fs from 'fs';
import CryptoJS from "crypto-js";
import dotenv from 'dotenv';

dotenv.config();
```

### Methods

#### 1. **Test API Connection**
Check if the Mori Testnet API is responsive:
```javascript
async function test() {
    await get(baseURL + "test", (data) => {
        let result = JSON.parse(data);
        console.log(result);
    });
}
```

#### 2. **Login**
Authenticate using a password and retrieve an auth token. This token is saved to `auth-token.json` for future requests.
```javascript
async function login(password) {
    await get(baseURL + "login?password=" + password, (data) => {
        let result = JSON.parse(data);
        console.log(result);

        if (result.status === 'error') {
            console.error('Login failed: ' + result.msg);
        } else {
            fs.writeFileSync('auth-token.json', JSON.stringify({ auth_token: result.token }));
        }
    });
}
```

#### 3. **Get All Pay Requests**
Retrieve all pay requests made on the Mori Testnet:
```javascript
async function getAllPayRequests() {
    await get(baseURL + "allPay", (data) => {
        let result = JSON.parse(data);
        console.log(result);
        
        // Viewing the transaction on tonviewer
        let viewer = 'https://testnet.tonviewer.com/transaction/';
        console.log('To see more on ' + viewer + result.data[0].result.event_id);
    });
}
```

#### 4. **Get Request Status by Ticket ID**
Check the status of a specific ticket by its `ticketId`:
```javascript
async function getRequestStatus(ticketId) {
    await get(baseURL + "getTicketById?ticketId=" + ticketId, (data) => {
        let result = JSON.parse(data);
        console.log(result);
        
        let viewer = 'https://testnet.tonviewer.com/transaction/';
        console.log('To see more on ' + viewer + result.data.result.event_id);
    });
}
```

#### 5. **Send a Pay Request**
Submit a payment request to the API. The request includes an encrypted ticket, containing the ticket ID, address, and amount.

```javascript
async function sendPayRequest(address, amount) {
    // Fetching the auth token
    let rawData = fs.readFileSync('auth-token.json');
    let token = 'bearer ' + JSON.parse(rawData).auth_token;
    
    // Generating a unique ticket ID
    let ticketId = 'T' + Date.now();
    
    // Creating the ticket object
    let ticket = {
        ticketId: ticketId,
        address: address,
        amount: amount
    };
    
    // Encrypting the ticket
    let ticketString = JSON.stringify(ticket);
    let encrypted = CryptoJS.AES.encrypt(ticketString, process.env.SECRET).toString();
    
    // Defining the request body
    let body = { encryptedTicket: encrypted };

    // Sending the request
    let result = await post(baseURL + "sendticket", body, token);
    console.log("result: ", result);
}
```

## Example Usage

Here’s an example flow that tests the API connection, logs in, fetches all pay requests, and sends a new pay request:
```javascript
// Test API connection
await test();

// Login and get auth token
await login('your_password');

// Get all pay requests
await getAllPayRequests();

// Check the status of a specific ticket
await getRequestStatus('T123456789');

// Send a pay request
await sendPayRequest('0QAWlM-TfzMBM6upSg6vfsy8WZirJkJFusRVPL75JD6gn-wG', 11);
```

## License

This project is licensed under the No License.
```

## Contact

For any technical inquiries, please get in touch with bdevatmoriai@gmail.com.


