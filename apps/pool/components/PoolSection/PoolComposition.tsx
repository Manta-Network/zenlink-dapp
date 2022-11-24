import { formatUSD } from '@zenlink-interface/format'
import type { Pool } from '@zenlink-interface/graph-client'
import { AppearOnMount, Currency, Table, Typography } from '@zenlink-interface/ui'
import { usePrices } from '@zenlink-interface/wagmi'
import type { FC } from 'react'

import { useTokensFromPool } from '../../lib/hooks'

interface PoolCompositionProps {
  pool: Pool
}

export const PoolComposition: FC<PoolCompositionProps> = ({ pool }) => {
  const { data: prices } = usePrices({ chainId: pool.chainId })
  const { tokens, reserves } = useTokensFromPool(pool)

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center justify-between px-2">
        <Typography weight={600} className="text-slate-50">
          Pool Composition
        </Typography>
        <AppearOnMount>
          <Typography variant="sm" weight={400} className="text-slate-400">
            Total Assets:{' '}
            <span className="font-semibold text-slate-50">
              {' '}
              {formatUSD(pool.reserveUSD)}
            </span>
          </Typography>
        </AppearOnMount>
      </div>
      <Table.container className="w-full">
        <Table.table>
          <Table.thead>
            <Table.thr>
              <Table.th>
                <div className="text-left">Token</div>
              </Table.th>
              <Table.th>
                <div className="text-left">Amount</div>
              </Table.th>
              <Table.th>
                <div className="text-left">Value</div>
              </Table.th>
            </Table.thr>
          </Table.thead>
          <Table.tbody>
            {tokens.map((token, i) => (
              <Table.tr key={token.wrapped.address}>
                <Table.td>
                  <div className="flex items-center gap-3">
                    <Currency.Icon currency={token} width={24} height={24} />
                    <Typography weight={600} variant="sm" className="text-slate-50">
                      {token.symbol}
                    </Typography>
                  </div>
                </Table.td>
                <Table.td>
                  <Typography weight={500} variant="sm" className="text-slate-400">
                    {reserves[i]?.toSignificant(6)}
                  </Typography>
                </Table.td>
                <Table.td>
                  <AppearOnMount>
                    <Typography weight={600} variant="sm" className="text-slate-50">
                      {formatUSD(
                        prices?.[token.wrapped.address]
                          ? reserves[i].multiply(prices?.[token.wrapped.address].asFraction).toSignificant(6)
                          : '',
                      )}
                    </Typography>
                  </AppearOnMount>
                </Table.td>
              </Table.tr>
            ))}
          </Table.tbody>
        </Table.table>
      </Table.container>
    </div>
  )
}
