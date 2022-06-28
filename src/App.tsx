import {
  Box,
  Divider,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Link,
  Skeleton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useMintData, useNftData, useSales } from './hooks';
import {
  getEtherscanAddressUrl,
  getEtherscanTxUrl,
  getTruncated,
  processImgURI,
} from './helpers';
import { TdWithEns } from './components/TdWithEns';
import { useEnsName } from 'wagmi';
import { motion } from 'framer-motion';

function App() {
  const [collectionAddress, setCollectionAddress] = useState(
    '0x25ed58c027921e14d86380ea2646e3a1b5c55a8b'
  );
  const [tokenId, setTokenId] = useState('300');

  const { sales: salesData, loading: salesLoading } = useSales(
    collectionAddress,
    tokenId
  );
  const hasAnySales =
    salesData?.sales?.nodes?.length && salesData?.sales?.nodes?.length > 0;
  const { mintData, loading: mintDataLoading } = useMintData(
    collectionAddress,
    tokenId
  );
  const { nftData } = useNftData(collectionAddress, tokenId);

  const imageURI = useMemo(
    () => processImgURI(nftData?.token?.token.image?.url as string) as string,
    [nftData]
  );

  const { data: minterEns } = useEnsName({
    address: mintData?.mints.nodes[0]?.mint?.originatorAddress,
  });
  const { data: ownerEns } = useEnsName({
    address: nftData?.token?.token?.owner as string,
  });

  useEffect(() => {
    console.log({ nftData, imageURI });
  }, [nftData]);

  return (
    <VStack paddingY='10'>
      <Heading>NFT historical data explorer 🗺</Heading>
      <Text>
        Built using the{' '}
        <Link
          isExternal
          href='https://docs.zora.co/docs/zora-api/zdk'
          textDecoration='underline'
        >
          Zora Dev Kit
        </Link>{' '}
        ✨ by{' '}
        <Link
          isExternal
          href='https://twitter.com/dhaiwat10'
          textDecoration='underline'
        >
          Dhaiwat
        </Link>
      </Text>
      <Link
        isExternal
        href='https://github.com/dhaiwat10/zora-nft-historical-explorer'
        textDecoration='underline'
      >
        Source code
      </Link>

      <Divider />

      <HStack padding='4' spacing='8'>
        <VStack spacing='0'>
          <FormLabel htmlFor='collectionAddress'>
            Collection/contract Address
          </FormLabel>
          <Input
            id='collectionAddress'
            value={collectionAddress}
            onChange={(e) => setCollectionAddress(e.target.value)}
          />
        </VStack>

        <VStack spacing='0'>
          <FormLabel htmlFor='tokenId'>Token ID</FormLabel>
          <Input
            id='tokenId'
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
        </VStack>
      </HStack>

      <Divider />

      {imageURI ? (
        <Box
          as={motion.div}
          borderColor='gray.200'
          borderWidth='1px'
          width='fit-content'
          marginTop='4'
          padding='6'
          shadow='md'
          rounded='lg'
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image src={imageURI} height='300' />
        </Box>
      ) : (
        <Skeleton height='300px' width='300px' rounded='lg' />
      )}

      <Divider />

      {hasAnySales ? (
        <TableContainer>
          <Table variant='striped'>
            <TableCaption>Historical sales data</TableCaption>
            <Thead>
              <Tr>
                <Th>Buyer</Th>
                <Th>Price (USD)</Th>
                <Th>Price (ETH)</Th>
                <Th>Date</Th>
                <Th>Tx Hash</Th>
              </Tr>
            </Thead>

            <Tbody>
              {salesData?.sales.nodes.map(({ sale }) => {
                return (
                  <Tr key={sale.transactionInfo.transactionHash}>
                    {/* <pre>{JSON.stringify(sale, null, 2)}</pre> */}
                    <TdWithEns address={sale.buyerAddress} />
                    <Td>
                      ${Math.round(+(sale.price.usdcPrice?.decimal as number))}
                    </Td>
                    <Td>{sale.price.nativePrice.decimal}</Td>
                    <Td>
                      {new Date(
                        sale.transactionInfo.blockTimestamp
                      ).toDateString()}
                    </Td>
                    <Td>
                      <Link
                        isExternal
                        href={getEtherscanTxUrl(
                          sale.transactionInfo.transactionHash as string
                        )}
                        textDecoration='underline'
                      >
                        {getTruncated(
                          sale.transactionInfo.transactionHash as string
                        )}
                      </Link>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      ) : (
        <Text>No sales data found</Text>
      )}

      <Divider />

      {mintDataLoading ? (
        <Text>Loading mint data...</Text>
      ) : (
        mintData?.mints.nodes.map(({ mint }) => {
          return (
            <VStack key={mint.transactionInfo.transactionHash}>
              {/* <pre>{JSON.stringify(mint, null, 2)}</pre> */}
              <Text>
                Minted by{' '}
                <Link
                  href={getEtherscanAddressUrl(
                    mint.originatorAddress as string
                  )}
                  isExternal
                  textDecoration='underline'
                >
                  {minterEns || getTruncated(mint.originatorAddress as string)}
                </Link>{' '}
                on{' '}
                {new Date(mint.transactionInfo.blockTimestamp).toDateString()}.{' '}
                Tx hash:{' '}
                <Link
                  href={getEtherscanTxUrl(
                    mint.transactionInfo.transactionHash as string
                  )}
                  isExternal
                  textDecoration='underline'
                >
                  {getTruncated(mint.transactionInfo.transactionHash as string)}
                </Link>
              </Text>
            </VStack>
          );
        })
      )}

      <Text>
        Current owner -{' '}
        <Link
          href={getEtherscanAddressUrl(nftData?.token?.token?.owner as string)}
          isExternal
          textDecoration='underline'
        >
          {ownerEns || getTruncated(nftData?.token?.token.owner as string)}
        </Link>
      </Text>
    </VStack>
  );
}

export default App;
