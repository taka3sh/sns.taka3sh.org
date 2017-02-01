const config = {
  apiKey: "AIzaSyCRvuGgcUMJZdptmwAGighs6gU741NLQhs",
  authDomain: "sns-taka3sh-org.firebaseapp.com",
  databaseURL: "https://sns-taka3sh-org.firebaseio.com",
}

function notify(message) {
  var notification = document.querySelector('.mdl-js-snackbar');
  notification.MaterialSnackbar.showSnackbar({
    message: message
  });
}

function toggleForm(form, disabled) {
  form.querySelectorAll('input').forEach(function(elem) {
    elem.disabled = disabled
  })
}

function resetForm(form) {
  form.querySelectorAll('.mdl-textfield').forEach(function(elem) {
    elem.MaterialTextfield.change()
  })
}

function onLogin(e) {
  var email = e.target.elements.email.value
  var password = e.target.elements.password.value

  toggleForm(e.target, true)

  firebase.auth().signInWithEmailAndPassword(email, password).then(function () {
    toggleForm(e.target, false)
    resetForm(e.target)
  }).catch(function (error) {
    toggleForm(e.target, false)
    notify(error.message)
  })

  return false
}

function onLogout(e) {
  firebase.auth().signOut()
}

function onSubmit(e) {
  var newPostKey = firebase.database().ref().child('posts').push().key
  var updates = {}
  updates['/posts/' + newPostKey] = {
    title: this.title,
    body: this.body,
    createdAt: moment(this.createdAt).toISOString(),
  }

  firebase.database().ref().update(updates).catch(function(error) {
    notification.MaterialSnackbar.showSnackbar({
      message: error.message
    });
  })
}

document.forms.login.onsubmit = onLogin

var app = new Vue({
  el: '#app',
  data: {
    title: "",
    body: "",
    createdAt: moment().startOf('minute').format(),
    user: null,
  },
  methods: {
    localizeDate: function(date) {
      return moment(date).format('LLLL')
    },
    onLogin: onLogin,
    onLogout: onLogout,
    onSubmit: onSubmit,
  },
})

firebase.initializeApp(config)

var dialog = document.querySelector('dialog')
dialogPolyfill.registerDialog(dialog)
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    app.user = user.email
    dialog.close()
  } else {
    app.user = null
    dialog.showModal()
  }
})
