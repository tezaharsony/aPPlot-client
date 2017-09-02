var login = new Vue({
  el: '#login',
  data: {
    loginUsername : null,
    loginPass : null,
    loginError : false,
    loginMessage : null,

    signupEmail : null,
    signupFullname : null,
    signupUsername : null,
    signupPass : null,

    panel: false
  },
  methods: {
    togglePanel() {
      this.panel = !this.panel
    },

    login() {
      axios.post('http://35.185.155.111/signin', {
        username: this.loginUsername,
        password: this.loginPass
      })
      .then(({data}) => {
        console.log(data)
        if (data == 'wrong password' || data == 'username doesn\'t exist') {
          this.loginError = true
          this.loginMessage = data
        } else {
          $('.container').addClass("active")
          localStorage.setItem('accesstoken', data)
          this.loginError = false
          this.loginMessage = null

          this.loginUsername = null
          this.loginPass = null

          setTimeout(() => {
            window.location = `${window.location.protocol}//${window.location.hostname}/home`
          }, 1000)
        }
      })
      .catch(err => console.log(err))
    },

    signup() {
      axios.post('http://35.185.155.111/signup', {
        username: this.signupUsername,
        password: this.signupPass,
        fullname: this.signupFullname,
        email: this.signupEmail
      })
      .then(() => {
        $('.container').addClass("active")
        setTimeout(() => {
          $('.container').removeClass("active")

          this.signupUsername = null
          this.signupPass = null
          this.signupFullname = null
          this.signupEmail = null

          this.panel = !this.panel
        }, 1000)
      })
      .catch(err => console.log(err))
    }
  }
})
