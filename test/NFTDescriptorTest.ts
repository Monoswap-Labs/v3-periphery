import {
  time,
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { ethers } from 'hardhat';
describe('NFTDescriptorTest', function () {
  it('Gen svg', async () => {
    const nftDescriptor = await ethers.deployContract('NFTDescriptor', []);

    const nFTDescriptorTest = await ethers.deployContract(
      'NFTDescriptorTest',
      [],
      {
        libraries: {
          NFTDescriptor: await nftDescriptor.getAddress(),
        },
      }
    );
    console.log(
      await nFTDescriptorTest.constructTokenURI({
        tokenId: 1,
        quoteTokenAddress: '0xd978724d457f441603e550a8e0d59848515e21A2',
        baseTokenAddress: '0x7Cb0C805544C5BA83A6e014A9e199E1C8ed16137',
        quoteTokenSymbol: 'USDT',
        baseTokenSymbol: 'WETH',
        quoteTokenDecimals: 6,
        baseTokenDecimals: 18,
        flipRatio: false,
        tickLower: 56789,
        tickUpper: 78901,
        tickCurrent: 67890,
        tickSpacing: 100,
        fee: 3000,
        poolAddress: '0x7Cb0C805544C5BA83A6e014A9e199E1C8ed16137',
      })
    );
  });
});
