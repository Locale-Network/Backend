# Locale Lending Backend (Node.js)

## Overview
This repository contains the backend application for Locale Lending, a decentralized lending platform on the Arbitrum network.

## Getting Started

### Prerequisites
- Node.js (v14 or later recommended)
- Yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Locale-Network/Backend.git
   cd Backend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set up environment variables (see Configuration section below)

4. Start the development server:
   ```bash
   yarn start
   ```

## Configuration

Create a `.env` file in the root directory and configure the following environment variables:

```
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
ETRAN_API_KEY=your_etran_api_key
ETRAN_API_URL=https://api.etran.com
WEB3_PROVIDER_URL=https://arbitrum-mainnet.infura.io/v3/your_infura_project_id
PRIVATE_KEY=your_private_key
ROLLUP_HTTP_SERVER=http://localhost:8545
BRAL_API_URL=https://api.brale.io
SMART_CONTRACT_ADDRESS=0x0
PRIVATE_KEY=0x0
```

### Environment Variables

- `JWT_SECRET`: Secret key for JWT token generation and verification
- `MONGO_URI`: MongoDB connection string
- `PLAID_CLIENT_ID`: Plaid API client ID
- `PLAID_SECRET`: Plaid API secret
- `PLAID_ENV`: Plaid environment (sandbox, development, or production)
- `ETRAN_API_KEY`: API key for ETRAN service
- `ETRAN_API_URL`: URL for ETRAN API
- `WEB3_PROVIDER_URL`: RPC endpoint for the Arbitrum network
- `PRIVATE_KEY`: Private key for blockchain transactions (keep this secure!)
- `ROLLUP_HTTP_SERVER`: URL for the local rollup server
- `BRAL_API_URL`: URL for the Brale API, used for converting funds to stablecoins
- `SMART_CONTRACT_ADDRESS`: Ethereum address of the smart contract used for depositing funds
- `PRIVATE_KEY`: Private key for blockchain transactions (keep this secure!)

Note: The `PRIVATE_KEY` is already mentioned in the list above. It's crucial to emphasize the importance of keeping this key secure and never sharing it or committing it to version control.

## Security Note

Ensure that you never commit your `.env` file or share sensitive information like private keys. Add `.env` to your `.gitignore` file to prevent accidental commits.
