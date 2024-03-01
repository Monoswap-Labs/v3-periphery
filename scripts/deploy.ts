import { ethers } from 'hardhat';
import { ContractFactory, Contract } from 'ethers';
import { deployContract, deployContractWithArtifact } from './helper';
import TransparentUpgradeableProxy from '@openzeppelin/contracts/build/contracts/TransparentUpgradeableProxy.json';
import ProxyAdmin from '@openzeppelin/contracts/build/contracts/ProxyAdmin.json';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const wethLabelHex = ethers.encodeBytes32String('WETH');
  const v3Factory = {
    address: '0x48d0F09710794313f33619c95147F34458BF7C3b',
  };
  const blast = {
    address: '0x4300000000000000000000000000000000000002',
  };
  const blastPoints = {
    address: '0x2536FE9ab3F511540F2f9e2eC2A805005C3Dd800',
  };

  const weth = await ethers.getContractAt(
    'IERC20',
    '0x4300000000000000000000000000000000000004'
  );

  const swapRouter = await deployContract(
    'SwapRouter',
    [
      v3Factory.address,
      await weth.getAddress(),
      blast.address,
      blastPoints.address,
    ],
    'SwapRouter',
    {}
  );
  const nftDescriptor = await deployContract(
    'NFTDescriptor',
    [],
    'NFTDescriptor',
    {}
  );

  const proxyAdmin = await deployContractWithArtifact(
    ProxyAdmin,
    [],
    'ProxyAdmin',
    {}
  );

  const nftPositionDescriptor = await deployContract(
    'NonfungibleTokenPositionDescriptor',
    [await weth.getAddress(), wethLabelHex],
    'NonfungibleTokenPositionDescriptor',
    {
      libraries: {
        NFTDescriptor: await nftDescriptor.getAddress(),
      },
    }
  );
  const nftPositionDescriptorProxy = await deployContractWithArtifact(
    TransparentUpgradeableProxy,
    [
      await nftPositionDescriptor.getAddress(),
      await proxyAdmin.getAddress(),
      '0x',
    ],
    'NonfungibleTokenPositionDescriptorProxy',
    {}
  );
  const nftPositionManager = await deployContract(
    'NonfungiblePositionManager',
    [
      v3Factory.address,
      await weth.getAddress(),
      await nftPositionDescriptorProxy.getAddress(),
      blast.address,
      blastPoints.address,
    ],
    'NonfungiblePositionManager',
    {}
  );
  const quoterV2 = await deployContract(
    'QuoterV2',
    [
      v3Factory.address,
      await weth.getAddress(),
      blast.address,
      blastPoints.address,
    ],
    'QuoterV2',
    {}
  );
  const tickLens = await deployContract('TickLens', [], 'TickLens', {});
  const uniswapInteraceMulticall = await deployContract(
    'UniswapInterfaceMulticall',
    [blast.address, blastPoints.address],
    'UniswapInterfaceMulticall',
    {}
  );

  const quoter = await deployContract(
    'Quoter',
    [
      v3Factory.address,
      await weth.getAddress(),
      blast.address,
      blastPoints.address,
    ],
    'Quoter',
    {}
  );
  const v3Migrator = await deployContract(
    'V3Migrator',
    [
      v3Factory.address,
      await weth.getAddress(),
      await nftPositionManager.getAddress(),
      blast.address,
      blastPoints.address,
    ],
    'V3Migrator',
    {}
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
