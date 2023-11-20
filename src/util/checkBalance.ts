import { detectFeatures } from '@thirdweb-dev/sdk';
import { contractAddress } from '../../config';

export default async function checkBalance(sdk: any, address: string) {
  const contract = await sdk.getContract(contractAddress);

  let balance;

  const features = detectFeatures(contract.abi);
  if (features?.ERC1155?.enabled) {
    balance = await contract.erc1155.balanceOf(address, 0);
  } else if (features?.ERC721?.enabled) {
    balance = await contract.erc721.balanceOf(address);
  }
  // gte = greater than or equal to
  return balance.gte(1);
}
