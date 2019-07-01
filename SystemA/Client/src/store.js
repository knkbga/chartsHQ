import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default new Vuex.Store({
  state: {
    status: '',
    input: '',
    stats: {},
    prompt: ''
  },
  mutations: {
    ongoingRequest(state) {
      state.status = 'wait'
      state.prompt = ''
      state.stats = {}
    },
    genStatsSuccess(state, result) {
      state.stats = result.data 
      state.status = ''
      state.prompt = ''
    },
    genRandomSuccess(state, input) {
      state.status = '';
      state.input = JSON.stringify(input.data).replace('[','').replace(']','')
      state.prompt = ''
      state.stats = {}
    },
    changeInput(state, input) {
      state.input = input;
      state.prompt = ''
      state.stats = {}
    },
    requestError(state, errMessage) {
      state.status = 'error'
      state.prompt = errMessage
      setTimeout(2000, function() {
        state.prompt = ''
      })
      state.stats = {}
    }
  },
  actions: {
    updateInput({commit}, input){
      commit('changeInput', input)
    },
    genStats({commit}, input){
      return new Promise((resolve, reject) => {
        // console.log('Validity called');
        commit('ongoingRequest')
        axios({
          url: 'http://localhost:8080/actions?method=IS-VALID-ENTRY&payload={entry: ' + input + '}&ts=' + Date.now(),
          method: 'GET'
        })
        .then(resp => {
          if(resp.data.success == false) {
            commit('requestError', resp.data.errMessage)
            resolve(resp)
            return;
          } else {
            axios({
              url: 'http://localhost:8080/actions?method=CALCULATE-STATS&payload={entry:' + input + '}&ts=' + Date.now(),
              method: 'GET'
            })
            .then(data => {
              if(resp.data.success == false) {
                commit('requestError', resp.data.errMessage)
                resolve(resp)
                return;
              }
              // console.log("calculate stats successful");
              commit('genStatsSuccess', data.data)
              resolve(data)
            })
          }
        })
        .catch(err => {
          // console.log('error encountered', err);
          commit('requestError', err)
          reject(err)
        })
      })
    },
    genRandom({commit}){
      return new Promise((resolve, reject) => {
        // console.log('genRandom called');
        commit('ongoingRequest')
        axios({
          url: 'http://localhost:8080/actions?method=GEN-RAND&ts=' + Date.now(),
          method: 'GET'
        })
        .then(resp => {
          if(resp.data.success == false) {
            commit('requestError', resp.data.errMessage)
            resolve(resp)
            return;
          }
          // console.log('genRandom successful');
          commit('genRandomSuccess', resp.data)
          resolve(resp)
        })
        .catch(err => {
          commit('requestError', err)
          reject(err)
        })
      })
    }
  },
  getters: {
    getStatus: state => state.status,
    getInputString: state => state.input,
    getPrompt: state => state.prompt,
    getStats: state => state.stats
  }
})
