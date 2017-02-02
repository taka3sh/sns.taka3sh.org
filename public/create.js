var config = {
  apiKey: "AIzaSyB3rU05SgP6XFnQqPgrvCBLSPulxsfpwxI",
  authDomain: "sns-taka3sh-org-157419.firebaseapp.com",
  databaseURL: "https://sns-taka3sh-org-157419.firebaseio.com",
  messagingSenderId: "895779023522"
}
firebase.initializeApp(config)
var auth = firebase.auth()
var database = firebase.database()
var messaging = firebase.messaging()

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
    document.querySelectorAll('.mdl-js-textfield').forEach(function(elem) {
      if (elem.MaterialTextfield) {
        elem.MaterialTextfield.checkDirty()
      }
    })
  })
}

function onSubmit(e) {
  disableForm(e.target, true)

  var newPostKey = database.ref().child('posts').push().key
  var updates = {}
  updates['/posts/' + newPostKey] = {
    title: this.title,
    body: this.body,
    createdAt: moment(this.createdAt).toISOString(),
  }

  database.ref().update(updates).then(() => {
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
  auth.signOut()
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

/// Login form

document.forms.login.addEventListener('submit', function(e) {
  e.preventDefault()
  disableForm(e.target, true)
  var email = e.target.elements.email.value
  var password = e.target.elements.password.value
  auth.signInWithEmailAndPassword(email, password).then(function() {
    disableForm(e.target, false)
    e.target.reset()
    updateMDL()
  }).catch(function (error) {
    disableForm(e.target, false)
    notify(error.message)
  })
})

document.getElementById('cancel').addEventListener('click', function(e) {
  e.preventDefault()
  history.back()
})

var dialog = document.querySelector('dialog')
dialogPolyfill.registerDialog(dialog)

dialog.addEventListener('cancel', function(e) {
  e.preventDefault()
})

auth.onAuthStateChanged(function(user) {
  if (user) {
    app.user = user.email
    dialog.close()
  } else {
    app.user = null
    dialog.showModal()
  }
})
