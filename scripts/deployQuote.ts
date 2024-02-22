import { ethers } from 'hardhat';
import { ContractFactory, Contract } from 'ethers';
import { deployContract, deployContractWithArtifact } from './helper';
import TransparentUpgradeableProxy from '@openzeppelin/contracts/build/contracts/TransparentUpgradeableProxy.json';
import ProxyAdmin from '@openzeppelin/contracts/build/contracts/ProxyAdmin.json';
async function main() {
  const v3Factory = {
    address: '0x7DfB29428833618f9990e959D6529CDD10FC7Bf4',
  };
  const weth = {
    address: '0x5300000000000000000000000000000000000004',
  };
  const nftPositionManager = {
    address: '0x9fCCf6BcAaF91a83699cC5608146B01d1ad4f4C3',
  };
  const quoter = await deployContract(
    'Quoter',
    [v3Factory.address, weth.address],
    'Quoter',
    {}
  );
  // const v3Migrator = await deployContract(
  //   'V3Migrator',
  //   [v3Factory.address, weth.address, nftPositionManager.address],
  //   'V3Migrator',
  //   {}
  // );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
