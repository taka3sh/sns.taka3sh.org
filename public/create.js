const config = {
  apiKey: "AIzaSyCRvuGgcUMJZdptmwAGighs6gU741NLQhs",
  authDomain: "sns-taka3sh-org.firebaseapp.com",
  databaseURL: "https://sns-taka3sh-org.firebaseio.com",
}

function notify(message) {
  document.querySelector('.mdl-js-snackbar').MaterialSnackbar.showSnackbar({
    message: message
  });
}

function disableForm(form, disabled) {
  form.querySelectorAll('input').forEach(function(elem) {
    elem.disabled = disabled
  })
}

function updateMDL() {
  Vue.nextTick(function() {
    document.querySelectorAll('.mdl-textfield').forEach(function(elem) {
      if (elem.MaterialTextfield) {
        elem.MaterialTextfield.checkDirty()
      }
    })
  })
}

function onSubmit(e) {
  disableForm(e.target, true)

  var newPostKey = firebase.database().ref().child('posts').push().key
  var updates = {}
  updates['/posts/' + newPostKey] = {
    title: this.title,
    body: this.body,
    createdAt: moment(this.createdAt).toISOString(),
  }

  firebase.database().ref().update(updates).then(() => {
    disableForm(e.target, false)
    e.target.reset()
    notify("A new post was successfully created")
  }).catch((error) => {
    disableForm(e.target, false)
    notify(error.message)
  })
}

function onReset() {
  this.title = this.body = ''
  this.createdAt = moment().startOf('minute').format()
  updateMDL()
}

function onLogout(e) {
  firebase.auth().signOut()
}

var app = new Vue({
  el: '#app',
  data: {
    title: "",
    body: "",
    createdAt: "",
    user: null,
  },
  methods: {
    localizeDate: function(date) {
      return moment(date).format('LLLL')
    },
    onLogout: onLogout,
    onSubmit: onSubmit,
    onReset: onReset,
  },
  mounted: function() {
    document.forms.post.reset()
  }
})

firebase.initializeApp(config)

/// Login form

document.forms.login.addEventListener('submit', function(e) {
  disableForm(e.target, true)
  var email = e.target.elements.email.value
  var password = e.target.elements.password.value
  firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
    disableForm(e.target, false)
    e.target.reset()
    updateMDL()
  }).catch(function (error) {
    disableForm(e.target, false)
    notify(error.message)
  })
  return false
})

firebase.auth().onAuthStateChanged(function(user) {
  var dialog = document.querySelector('dialog')
  dialogPolyfill.registerDialog(dialog)
  if (user) {
    app.user = user.email
    dialog.close()
  } else {
    app.user = null
    dialog.showModal()
  }
})
