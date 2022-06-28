import { Link, Td } from '@chakra-ui/react';
import { useEnsName } from 'wagmi';
import { getEtherscanAddressUrl, getTruncated } from '../helpers';

export const TdWithEns = ({ address }: { address: string }) => {
  const { data: ens } = useEnsName({ address });

  return (
    <Td>
      <Link
        href={getEtherscanAddressUrl(address)}
        isExternal
        textDecoration='underline'
      >
        {ens || getTruncated(address)}
      </Link>
    </Td>
  );
};
