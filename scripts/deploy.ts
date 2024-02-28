import { ethers } from 'hardhat';
import { ContractFactory, Contract } from 'ethers';
import { deployContract, deployContractWithArtifact } from './helper';
import TransparentUpgradeableProxy from '@openzeppelin/contracts/build/contracts/TransparentUpgradeableProxy.json';
import ProxyAdmin from '@openzeppelin/contracts/build/contracts/ProxyAdmin.json';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const wethLabelHex = ethers.encodeBytes32String('WETH');
  const v2Factory = {
    address: '0x3Ff3AC9d1423e6a07cc0891500983F924dDFBffb',
  };
  const v3Factory = {
    address: '0xAAe602EE88e9eA8D107b73b1Df8896cF043d392F',
  };
  const blast = {
    address: '0x4300000000000000000000000000000000000002',
  };
  const blastPoints = {
    address: '0x2fc95838c71e76ec69ff817983BFf17c710F34E0',
  };

  const weth = await ethers.getContractAt(
    'IERC20',
    '0x4200000000000000000000000000000000000023'
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
  // await erc20.approve(
  //   await nftPositionManager.getAddress(),
  //   ethers.parseEther('1000000000')
  // );
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
