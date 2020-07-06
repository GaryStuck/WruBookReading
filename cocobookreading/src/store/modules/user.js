const user = {
  state: {
    userName: '',
    date: null,
    token:''
  },
  mutations: {
    'SET_USERNAME': (state, userName) => {
      return state.userName = userName
    },
    'SET_DATE': (state, date) => {
      return state.date = date
    },
    'SET_TOKEN': (state, token) => {
      return state.token = token
    }
  },
  actions: {
    setUserName: ({commit, state}, userName) => {
      return commit('SET_USERNAME', userName)
    },
    setDate:({commit,state},date)=>{
      return commit('SET_DATE',date)
    },
    setToken:({commit,state},token)=>{
      return commit('SET_TOKEN',token)
    }
  }
}

export default user
