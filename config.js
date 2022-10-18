const {
  makeRawLogExtractors,
} = require('spock-etl/lib/core/processors/extractors/instances/rawEventDataExtractor')
require('dotenv-flow').config()

const mkrTransformer = require('./transformers/MkrTransformer')
const mkrBalanceTransformer = require('./transformers/MkrBalanceTransformer')
const chiefBalanceTransformer = require('./transformers/ChiefBalanceTransformer')
const pollingTransformerImport = require('./transformers/PollingTransformer')
const pollingTransformer = pollingTransformerImport.default
const dsChiefTransformer = require('./transformers/DsChiefTransformer')
const voteProxyFactoryTransformer = require('./transformers/VoteProxyFactoryTransformer')
const esmV2Transformer = require('./transformers/EsmV2Transformer')
const voteDelegateFactoryTransformer = require('./transformers/VoteDelegateFactoryTransformer')

//mainnet
// Update pollingTransformerImport.VOTING_CONTRACT_ADDRESS 
const MKR_ADDRESS = '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'
const VOTING_CONTRACT_ADDRESS = pollingTransformerImport.VOTING_CONTRACT_ADDRESS
const SECOND_VOTING_CONTRACT_ADDRESS =
  '0xD3A9FE267852281a1e6307a1C37CDfD76d39b133'
const ESM_V2_ADDRESS = '0x09e05fF6142F2f9de8B6B65855A1d56B6cfE4c58'
const DSCHIEF_12_ADDRESS = '0x0a3f6849f78076aefaDf113F5BED87720274dDC0'
const VOTE_PROXY_FACTORY_12_ADDRESS =
  '0x6FCD258af181B3221073A96dD90D1f7AE7eEc408'
const VOTE_DELEGATE_FACTORY_ADDRESS =
  '0xD897F108670903D1d6070fcf818f9db3615AF272'



//goerli
// note: there is no v1 of DSCHIEF or VOTE_PROXY_FACTORY deployed to goerli, only the newer versions
// Update pollingTransformerImport.VOTING_CONTRACT_GOERLI_ADDRESS 
const MKR_GOERLI_ADDRESS = '0xc4Ea8cE98436B58cc51F7D2d501e27dbbA0066f2'
const BATCH_VOTING_CONTRACT_GOERLI_ADDRESS =
  '0x9C2BF9875E41523139cfEC07e35Ef5Be2c3942c3'
const ESM_V2_ADDRESS_GOERLI = '0xaeecfF82e82765b0e24B9CE189FfdD073843b8f1'
const DSCHIEF_12_GOERLI_ADDRESS = '0xB119ee188aF24b78f30f2A42280f94f73d2Bdcb5'
const VOTE_PROXY_FACTORY_12_GOERLI_ADDRESS =
  '0x2c6a8bC9F03DeE6200E29c99a8678585370a2c92'
const VOTE_DELEGATE_FACTORY_GOERLI_ADDRESS =
  '0xa0651aCaA384ec105B91FEc3e2aa21021bac8120'

const goerli = {
  startingBlock: parseInt(process.env.GENESIS),
  extractors: [
    ...makeRawLogExtractors([
      BATCH_VOTING_CONTRACT_GOERLI_ADDRESS,
      MKR_GOERLI_ADDRESS,
      ESM_V2_ADDRESS_GOERLI,
      DSCHIEF_12_GOERLI_ADDRESS,
      VOTE_PROXY_FACTORY_12_GOERLI_ADDRESS,
      VOTE_DELEGATE_FACTORY_GOERLI_ADDRESS,
    ]),
  ],
  transformers: [
    pollingTransformer(BATCH_VOTING_CONTRACT_GOERLI_ADDRESS),
    mkrTransformer(MKR_GOERLI_ADDRESS),
    mkrBalanceTransformer(MKR_GOERLI_ADDRESS),
    esmV2Transformer(ESM_V2_ADDRESS_GOERLI),
    dsChiefTransformer(DSCHIEF_12_GOERLI_ADDRESS, '_v1.2'),
    chiefBalanceTransformer(DSCHIEF_12_GOERLI_ADDRESS, '_v1.2'),
    voteProxyFactoryTransformer(VOTE_PROXY_FACTORY_12_GOERLI_ADDRESS, '_v1.2'),
    voteDelegateFactoryTransformer(VOTE_DELEGATE_FACTORY_GOERLI_ADDRESS),
  ],
  migrations: {
    mkr: './migrations',
  },
  api: {
    whitelisting: {
      enabled: true,
      whitelistedQueriesDir: "./queries",
    },
    responseCaching: {
      enabled: false,
      duration: '15 seconds',
    }
  },
}

const mainnet = {
  startingBlock: parseInt(process.env.GENESIS),
  extractors: [
    ...makeRawLogExtractors([
      VOTING_CONTRACT_ADDRESS,
      SECOND_VOTING_CONTRACT_ADDRESS,
      MKR_ADDRESS,
      DSCHIEF_12_ADDRESS,
      VOTE_PROXY_FACTORY_12_ADDRESS,
      ESM_V2_ADDRESS,
      VOTE_DELEGATE_FACTORY_ADDRESS,
    ]),
  ],
  transformers: [
    pollingTransformer(VOTING_CONTRACT_ADDRESS),
    pollingTransformer(SECOND_VOTING_CONTRACT_ADDRESS),
    mkrTransformer(MKR_ADDRESS),
    mkrBalanceTransformer(MKR_ADDRESS),
    dsChiefTransformer(DSCHIEF_12_ADDRESS, '_v1.2'),
    chiefBalanceTransformer(DSCHIEF_12_ADDRESS, '_v1.2'),
    voteProxyFactoryTransformer(VOTE_PROXY_FACTORY_12_ADDRESS, '_v1.2'),
    esmV2Transformer(ESM_V2_ADDRESS),
    voteDelegateFactoryTransformer(VOTE_DELEGATE_FACTORY_ADDRESS),
  ],
  migrations: {
    mkr: './migrations',
  },
  api: {
    whitelisting: {
      enabled: false,
    },
    responseCaching: {
      enabled: false,
      duration: '15 seconds',
    },
  },
}

let config
if (process.env.VL_CHAIN_NAME === 'mainnet') {
  console.log('Using mainnet config')
  config = mainnet
} else {
  console.log(`Using goerli config with GENESIS : ${process.env.GENESIS}`)
  config = goerli
}

module.exports.default = config
