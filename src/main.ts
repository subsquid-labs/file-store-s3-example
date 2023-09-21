import * as erc20abi from './abi/erc20'
import {Database} from '@subsquid/file-store'
import {S3Dest} from '@subsquid/file-store-s3'
import {Column, Table, Types} from '@subsquid/file-store-csv'
import {assertNotNull} from '@subsquid/util-internal'

import {processor, USDC_CONTRACT} from './processor'

const dbOptions = {
	tables: {
		TransfersTable: new Table('transfers.csv', {
			from: Column(Types.String()),
			to: Column(Types.String()),
			value: Column(Types.Numeric())
		})
	},
	dest: new S3Dest(
		's3://subsquid-testing-bucket/transfers-data',
		{
			region: 'us-east-1',
			endpoint: 'https://s3.filebase.com',
			credentials: {
				accessKeyId: assertNotNull(process.env.S3_ACCESS_KEY_ID),
				secretAccessKey: assertNotNull(process.env.S3_SECRET_ACCESS_KEY)
			}
		}
	),
	chunkSizeMb: 10,
	// Explicitly keeping the default value of syncIntervalBlocks (infinity).
	// Make sure to use a finite value here if your output data rate is low!
	// More details here:
	// https://docs.subsquid.io/store/file-store/overview/#filesystem-syncs-and-dataset-partitioning
	syncIntervalBlocks: undefined
}

processor.run(new Database(dbOptions), async (ctx) => {
	for (let block of ctx.blocks) {
		for (let log of block.logs) {
			if (log.address===USDC_CONTRACT && log.topics[0]===erc20abi.events.Transfer.topic) {
				let { from, to, value } = erc20abi.events.Transfer.decode(log)
				ctx.store.TransfersTable.write({ from, to, value })
			}
		}
	}
})
