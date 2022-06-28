import { ethers } from 'ethers';

export const getEtherscanTxUrl = (txHash: string) => {
  return `https://etherscan.io/tx/${txHash}`;
};

export const getEtherscanAddressUrl = (address: string) => {
  return `https://etherscan.io/address/${address}`;
};

export const getTruncated = (str: string) => {
  if (!str) {
    return null;
  }
  return `${str.substring(0, 4)}...${str.substring(str.length - 4)}`;
};

export const getEnsName = async (address: string) => {
  const provider = new ethers.providers.AnkrProvider();
  const ensName = await provider.lookupAddress(address);
  return ensName;
};

export const appendIpfsGateway = (ipfsHash: string) => {
  return `https://ipfs.infura.io/ipfs/${ipfsHash}`;
};

export const processImgURI = (url: string) => {
  if (!url) {
    return null;
  }

  const replacedUrl = url.replace('ipfs://', '');

  if (replacedUrl !== url) {
    return appendIpfsGateway(replacedUrl);
  } else {
    return url;
  }
};
