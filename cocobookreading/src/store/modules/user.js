const user = {
  state: {
    userName: '',
    date: null
  },
  mutations: {
    'SET_USERNAME': (state, userName) => {
      return state.userName = userName
    },
    'SET_DATE': (state, date) => {
      return state.date = date
    }
  },
  actions: {
    setUserName: ({commit, state}, userName) => {
      return commit('SET_USERNAME', userName)
    },
    setDate:({commit,state},date)=>{
      return commit('SET_DATE',date)
    }
  }
}

export default user
