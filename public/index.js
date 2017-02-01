const config = {
  apiKey: "AIzaSyCRvuGgcUMJZdptmwAGighs6gU741NLQhs",
  databaseURL: "https://sns-taka3sh-org.firebaseio.com",
}

var app = new Vue({
  el: '#app',
  data: {
    posts: [],
  },
  methods: {
    localizeDate: function(date) {
      return moment(date).format('LLLL')
    }
  }
})

firebase.initializeApp(config)
firebase.database().ref('posts').on('child_added', function(data) {
  app.posts.unshift(data.val())
})
