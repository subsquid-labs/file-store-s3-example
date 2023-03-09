# A squid that saves USDC Transfers to CSV files on a S3-compatible service

This tiny blockchain indexer scrapes `Transfer` events emitted by the [USDC contract](https://etherscan.io/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48) and saves the data in a file-based dataset located at the [Filebase](https://filebase.com) S3-compatible data storage service. It is built with the [Subsquid framework](https://subsquid.io), hence the term "squid".

The squid uses [`@subsquid/file-store`](https://docs.subsquid.io/basics/store/file-store/), [`@subsquid/file-store-csv`](https://docs.subsquid.io/basics/store/file-store/csv-table/) and [`@subsquid/file-store-s3`](https://docs.subsquid.io/basics/store/file-store/s3-dest/) packages to store the dataset. S3 connection parameters are partially hardcoded to illustrate how they can be supplied programmatically.

The files are stored in a simple CSV format, but a more performant [Apache Parquet](https://parquet.apache.org) format is supported as well. See the [documentation page](https://docs.subsquid.io/basics/store/file-store/parquet-table/) and [this example](https://github.com/subsquid-labs/file-store-parquet-example) for more info.

Dependencies: NodeJS, [Squid CLI](https://docs.subsquid.io/squid-cli).

To see it in action, clone the repository and install dependencies:
```bash
$ git clone https://github.com/subsquid-labs/file-store-s3-example
$ cd file-store-s3-example/
$ npm i
```
Next, set your bucket name and authentication credentials in `.env`:
```bash
S3_BUCKET_NAME=subsquid-testing-bucket
S3_ACCESS_KEY_ID=myKeyId
S3_SECRET_ACCESS_KEY=mySecretAccessKey
```
Finally, spin up a *processor*, a process that ingests the data from the Ethereum Archive:
```bash
$ sqd process
```
You should see a `transfers-data` folder populated with indexer data appear in the bucket in a bit.
