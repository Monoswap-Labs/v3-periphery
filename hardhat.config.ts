import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
dotenv.config();

const LOW_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 2_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
};

const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
};

const DEFAULT_COMPILER_SETTINGS = {
  version: '0.7.6',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
};

export default {
  networks: {
    ganache: {
      url: 'http://localhost:8545',
      gasPrice: 20000000000,
      accounts: [process.env.GANACHE_PRIVATE_KEY || ''],
    },
    testnet: {
      url: 'https://data-seed-prebsc-2-s1.binance.org:8545/',
      chainId: 97,
      gasPrice: 5000000000,
      accounts: [process.env.BNB_TESTNET_PRIVATE_KEY || ''],
    },
    scrollTestnet: {
      url: 'https://sepolia-rpc.scroll.io/',
      chainId: 534351,
      accounts: [process.env.SCROLL_TESTNET_PRIVATE_KEY || ''],
      gasPrice: 1100000000, // 1.1 gwei
    },
    // for mainnet
    blastMainnet: {
      url: 'coming end of February',
      accounts: [process.env.BLAST_MAINNET_PRIVATE_KEY || ''],
      gasPrice: 1000000000,
    },
    // for Sepolia testnet
    blastSepolia: {
      url: 'https://sepolia.blast.io',
      accounts: [process.env.BLAST_SEPOLIA_PRIVATE_KEY || ''],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: {
      scrollTestnet: 'I54U798A8ZAHR2MSRK6QX9H5QAFYWX2K6F',
      scroll: 'I54U798A8ZAHR2MSRK6QX9H5QAFYWX2K6F',
      blastSepolia: 'My API key',
    },
    customChains: [
      {
        network: 'scrollTestnet',
        chainId: 534351,
        urls: {
          apiURL: 'https://api-sepolia.scrollscan.com/api',
          browserURL: 'https://sepolia.scrollscan.com/',
        },
      },
      {
        network: 'scroll',
        chainId: 534352,
        urls: {
          apiURL: 'https://api.scrollscan.com/api',
          browserURL: 'https://scrollscan.com/',
        },
      },
      {
        network: 'blastSepolia',
        chainId: 168587773,
        urls: {
          apiURL:
            'https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan',
          browserURL: 'https://testnet.blastscan.io',
        },
      },
    ],
  },
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
    overrides: {
      'contracts/NonfungiblePositionManager.sol':
        LOW_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/MockTimeNonfungiblePositionManager.sol':
        LOW_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/test/NFTDescriptorTest.sol':
        LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/NonfungibleTokenPositionDescriptor.sol':
        LOWEST_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/libraries/NFTDescriptor.sol':
        LOWEST_OPTIMIZER_COMPILER_SETTINGS,
    },
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true,
    },
  },
  sourcify: {
    enabled: true,
  },
};
