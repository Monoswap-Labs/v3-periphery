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
    // for mainnet
    blastMainnet: {
      url: `https://rpc.ankr.com/blast/${process.env.NODE_API_KEY || ''}`,
      accounts: [process.env.BLAST_MAINNET_PRIVATE_KEY || ''],
      gasPrice: 1000000000,
    },
    // for Sepolia testnet
    blastSepolia: {
      url: `https://rpc.ankr.com/blast_testnet_sepolia/${
        process.env.NODE_API_KEY || ''
      }`,
      accounts: [process.env.BLAST_SEPOLIA_PRIVATE_KEY || ''],
      gasPrice: 4000000000,
    },
  },
  etherscan: {
    apiKey: {
      blastSepolia: 'your API key',
    },
    customChains: [
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
  sourcify: {
    enabled: false,
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
};
