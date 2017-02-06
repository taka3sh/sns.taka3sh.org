/* eslint-env browser */
/* global Vue, dialogPolyfill, firebase, moment */

var config = {
  apiKey: 'AIzaSyB3rU05SgP6XFnQqPgrvCBLSPulxsfpwxI',
  authDomain: 'sns-taka3sh-org-157419.firebaseapp.com',
  databaseURL: 'https://sns-taka3sh-org-157419.firebaseio.com'
}
var auth, database

Vue.filter('data-localize', value => moment(value).format('LLLL'))

function updateMDL () {
  Vue.nextTick(function () {
    document.querySelectorAll('.mdl-js-textfield').forEach(function (elem) {
      if (elem.MaterialTextfield) {
        elem.MaterialTextfield.checkDirty()
      }
    })
  })
}

function createPost (form) {
  var newPostKey = database.ref().child('posts').push().key
  var updates = {}
  updates['/posts/' + newPostKey] = {
    title: form.elements.title.value,
    body: form.elements.body.value,
    createdAt: moment(form.elements.createdAt.value).toISOString()
  }
  return database.ref().update(updates)
}

function publishNotification (form) {
  return auth.currentUser.getToken(true)
  .then(idToken => new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.onload = resolve
    xhr.onerror = reject
    xhr.open('POST', 'https://sns-taka3sh-org-157419.appspot.com/publish')
    form.elements.idToken.value = idToken
    xhr.send(new FormData(form))
  }))
}

function showToast (parent, message) {
  parent.querySelector('.mdl-js-snackbar').MaterialSnackbar.showSnackbar({
    message: message
  })
}

moment.locale(navigator.language)

var app = new Vue({
  el: '#app',
  data: {
    title: '',
    body: '',
    createdAt: '',
    user: null,
    busy: false
  },
  watch: {
    title: updateMDL,
    body: updateMDL,
    createdAt: updateMDL
  },
  methods: {
    onSubmit: function (e) {
      this.busy = true
      createPost(e.target)
      .then(() => publishNotification(e.target))
      .then(() => {
        this.busy = false
        e.target.reset()
        showToast(this.$el, 'A new post was successfully created.')
      })
      .catch(error => {
        showToast(this.$el, error.message)
        console.log(error)
      })
      .then(() => { this.busy = false })
    },
    onLogout: function () {
      auth.signOut()
    },
    onReset: function (e) {
      this.title = this.body = ''
      this.createdAt = moment().startOf('minute').toISOString()
    }
  },
  mounted: function () {
    document.forms.post.reset()
  }
})

var loginform = new Vue({
  el: '#loginform',
  data: {
    busy: false
  },
  methods: {
    onSubmit: function (e) {
      this.busy = true
      var email = e.target.elements.email.value
      var password = e.target.elements.password.value
      auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        e.target.reset()
        updateMDL()
      })
      .catch(error => {
        showToast(loginform.$el, error.message)
        console.log(error)
      })
      .then(() => {
        this.busy = false
      })
    }
  }
})

addEventListener('load', function () {
  firebase.initializeApp(config)
  auth = firebase.auth()
  database = firebase.database()

  auth.onAuthStateChanged(function (user) {
    if (user) {
      app.user = user.email
      if (dialog.open) {
        dialog.close()
      }
    } else {
      app.user = null
      if (!dialog.open) {
        dialog.showModal()
      }
    }
  })

  var dialog = document.querySelector('dialog')
  dialogPolyfill.registerDialog(dialog)
  dialog.addEventListener('cancel', function (e) {
    e.preventDefault()
  })
})