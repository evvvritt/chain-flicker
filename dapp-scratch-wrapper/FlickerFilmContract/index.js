
import FlickerFilmContractArtifacts from '../../build/contracts/FlickerFilmContract.json'

import Web3 from 'web3'
const BN = Web3.utils.BN
import ZeroClientProvider from 'web3-provider-engine/zero.js'
import IdManagerProvider from '@aeternity/id-manager-provider'
import Vue from 'vue'
global.eventBus = new Vue()

class FlickerFilmContract {
  constructor (options) {

    this.FlickerFilmContract = null

    this.pollingInterval = null
    this.account = null
    this.unlocked = false
    this.balanceWei = 0
    this.balance = 0
    this.address = '0xdd6c5d9c917303f465ca2745bd818156aa7a54d3', // 0x82EdCB95F8b3C2906101AdbbdB4c61934F47fdF0'
    this.genesisBlock = 0
    this.loading = false
    this.options = {
      autoInit: true,
      getPastEvents: false,
      watchFutureEvents: false,
      connectionRetries: 3
    }
    Object.assign(this.options, options)
    if (this.options.autoInit) this.initWeb3()
  }

  // hello world : )
  helloWorld () {
    console.log('hello world!')
  }

  /*
   * Connect
   */

  initWeb3 () {
    return new Promise((resolve, reject) => {

      let web3Provider = false
      let idManager = new IdManagerProvider({
        skipSecurity: true
      })

      idManager.checkIdManager().then((idManagerPresent)=>{
				// check for aedentity app
        if (idManagerPresent) {
          web3Provider = idManager.web3.currentProvider

          // check for metamask
        } else if (global.web3) {
          web3Provider = web3.currentProvider

          // attempt to try again if no aedentity app or metamask
        } else if (this.options.connectionRetries > 0){
          this.options.connectionRetries -= 1
          setTimeout(() => {
            this.initWeb3().then(resolve).catch((error) => {
              reject(new Error(error))
            })
          }, 1000)
          // revert to a read only version using infura endpoint
        } else {
          this.readOnly = true
          global.eventBus.$emit('readOnly')
          web3Provider = ZeroClientProvider({
            getAccounts: function(){},
            // rpcUrl: 'https://mainnet.infura.io',
            // rpcUrl: 'https://testnet.infura.io',
            rpcUrl: 'https://rinkeby.infura.io',
            // rpcUrl: 'https://kovan.infura.io',
          })
        }

        if (web3Provider) {
          global.web3 = new Web3(web3Provider)
          this.startChecking()

          if (this.options.getPastEvents) this.getPastEvents()
          if (this.options.watchFutureEvents) this.watchFutureEvents()
        }
      })
    })
  }

  /*
   * Check every second for switching network or wallet
   */

  startChecking () {
    if (this.pollingInterval) clearInterval(this.pollingInterval)
    this.getGenesisBlock()
    .then(() => {
      this.pollingInterval = setInterval(this.check.bind(this), 1000)
    })
    .catch((err) => {
      throw new Error(err)
    })
  }

  check () {
    this.checkNetwork()
    .then(this.checkAccount.bind(this))
    .catch((error) => {
      console.error(error)
      throw new Error(error)
    })
  }

  checkNetwork () {
    return global.web3.eth.net.getId((err, netId) => {
      if (err) console.error(err)
      if (!err && this.network !== netId) {
        this.network = netId
        return this.deployContract()
      }
    })
  }

  deployContract () {
    if (!this.address || this.address === 'REPLACE_WITH_CONTRACT_ADDRESS') return new Error('Please provide a contract address')
    this.FlickerFilmContract = new global.web3.eth.Contract(FlickerFilmContractArtifacts.abi, this.address)
  }

  checkAccount () {
    return global.web3.eth.getAccounts((error, accounts) => {
      if (error) throw new Error(error)
      if (accounts.length && this.account !== accounts[0]) {
        this.unlocked = true
        this.account = accounts[0]
      } else if (!accounts.length) {
        this.unlocked = false
        this.account = null
      }
    })
  }


  /*
   * Not Yet Implemented vvvv
   */

  getGenesisBlock () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  getPastEvents () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  watchFutureEvents () {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }




  /*
   *
   * Constant Functions
   *
   */

  getColor (index) {
    return this.FlickerFilmContract.methods.getColor(new BN(index, 10)).call()
      .then((resp) => {
      // console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }
  getCount () {
    return this.FlickerFilmContract.methods.getCount().call()
      .then((resp) => {
      // console.log(resp)
      return resp
    }).catch((err) => {
      console.error(err)
    })
  }

  /*
   *
   * Transaction Functions
   *
   */

  addColor (colorAndLength) {
    if (!this.account) return new Error('Unlock Wallet')
    return this.FlickerFilmContract.methods.addColor(colorAndLength).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
      .then((resp) => {
      this.loading = false
      console.log(resp)
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }
  changeColor (colorAndLength, index) {
    if (!this.account) return new Error('Unlock Wallet')
    return this.FlickerFilmContract.methods.changeColor(colorAndLength, new BN(index, 10)).send({from: this.account})
    .on('transactionHash', (hash) => {
      console.log(hash)
      this.loading = true
    })
      .then((resp) => {
      this.loading = false
      console.log(resp)
      return resp
    }).catch((err) => {
      this.loading = false
      console.error(err)
    })
  }

  /*
   *
   * Events
   *
   */

}

export default FlickerFilmContract
