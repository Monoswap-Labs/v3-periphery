import { ethers } from 'hardhat';
import { ContractFactory, Contract } from 'ethers';
import { deployContract, deployContractWithArtifact } from './helper';
import TransparentUpgradeableProxy from '@openzeppelin/contracts/build/contracts/TransparentUpgradeableProxy.json';
import ProxyAdmin from '@openzeppelin/contracts/build/contracts/ProxyAdmin.json';

async function main() {
  const wethLabelHex = ethers.encodeBytes32String('WETH');
  const v2Factory = {
    address: '0xE63D69fFdB211dD747ad8970544043fADE7d20f5',
  };
  console.log(wethLabelHex);
  const v3Factory = {
    address: '0xbAB2F66B5B3Be3cC158E3aC1007A8DF0bA5d67F4',
  };
  const weth = await ethers.getContractAt(
    'IERC20',
    '0x4200000000000000000000000000000000000023'
  );

  const swapRouter = await deployContract(
    'SwapRouter',
    [v3Factory.address, await weth.getAddress()],
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
    [v3Factory.address, await weth.getAddress()],
    'QuoterV2',
    {}
  );
  const tickLens = await deployContract('TickLens', [], 'TickLens', {});
  const uniswapInteraceMulticall = await deployContract(
    'UniswapInterfaceMulticall',
    [],
    'UniswapInterfaceMulticall',
    {}
  );

  const quoter = await deployContract(
    'Quoter',
    [v3Factory.address, await weth.getAddress()],
    'Quoter',
    {}
  );
  const v3Migrator = await deployContract(
    'V3Migrator',
    [
      v3Factory.address,
      await weth.getAddress(),
      await nftPositionManager.getAddress(),
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
