import { ChakraProvider } from '@chakra-ui/react';
import { ethers } from 'ethers';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createClient, WagmiConfig } from 'wagmi';
import App from './App';
import './index.css';

const client = createClient({
  autoConnect: true,
  provider: new ethers.providers.AnkrProvider(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </WagmiConfig>
  </React.StrictMode>
);
