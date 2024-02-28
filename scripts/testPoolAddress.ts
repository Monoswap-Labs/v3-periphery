import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const factoryAddress = '0xAAe602EE88e9eA8D107b73b1Df8896cF043d392F';
  const tokenA = '0x4200000000000000000000000000000000000022';
  const tokenB = '0x54D12b155dA569aaEa910A778Eb3EC9cd2B26230';
  const fee = 3000;

  const TestPool = await ethers.deployContract('PoolAddressTest');
  console.log(
    `Pool Address: factory:${factoryAddress} tokenA:${tokenA} tokenB:${tokenB} fee: ${fee}\n =>`,
    (
      await TestPool.computeAddress(factoryAddress, tokenA, tokenB, fee)
    ).toString()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
