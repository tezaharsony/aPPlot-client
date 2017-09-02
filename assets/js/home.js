var home = new Vue({
  el: '#home',
  data: {
    list: []
  },
  computed: {
    computedList() {
      return this.list.map(item => {
        item.size = this.formatBytes(item.size)
        item.uploaded_date = this.formatDate(item.uploaded_date)
        item.icon = `../assets/icons/${item.mimetype.split('/')[1]}.svg`
        return item
      })
    }
  },
  methods: {
    listFiles() {
      axios.get('http://35.185.155.111/storage/', {
        headers: {
          accesstoken: localStorage.getItem('accesstoken')
        }
      })
      .then(({data}) => {
        this.list = data
      })
      .catch(err => console.log(err))
    },

    upload() {
      $('#upload-form').hide(100)
      $('#loader').show(100)

      var formData = new FormData()
      var files = $('#file-upload')[0].files

      for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i])
      }

      axios.post('http://35.185.155.111/storage/', formData, {
      // axios.post('http://localhost:3000/storage/', formData, {
        headers: {
          accesstoken: localStorage.getItem('accesstoken')
        }
      })
      .then(({data}) => {
        $('#myModal').modal('hide')
        this.listFiles()
        $('#file-upload').val('')
        $('#upload-form').show(100)
        $('#loader').hide(100)
      })
      .catch(err => console.log(err))
    },

    deleteFile(key) {
      $('.darken, .darken .loader').show(100)
      axios.post('http://35.185.155.111/storage/delete', {
        fileKey: key
      }, {
        headers: {
          accesstoken: localStorage.getItem('accesstoken')
        }
      })
      .then(({data}) => {
        console.log(data);
        this.listFiles()
        $('.darken, .darken .loader').hide(100)
      })
      .catch(err => console.log(err))
    },

    logout() {
      localStorage.removeItem('accesstoken')
      window.location = `${window.location.protocol}//${window.location.hostname}`
    },

    //helpers
    formatBytes(bytes) {
      if(bytes < 1024) return bytes + " Bytes";
      else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KB";
      else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MB";
      else return(bytes / 1073741824).toFixed(3) + " GB";
    },

    formatDate(date) {
      // console.log(date);
      date = new Date(date)
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${date.getDate()}-${months[date.getMonth()]}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }
  },
  created() {
    this.listFiles()
  }
})
