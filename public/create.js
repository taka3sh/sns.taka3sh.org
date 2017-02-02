/* eslint-env browser */
/* global Vue, dialogPolyfill, firebase, moment */

var config = {
  apiKey: 'AIzaSyB3rU05SgP6XFnQqPgrvCBLSPulxsfpwxI',
  authDomain: 'sns-taka3sh-org-157419.firebaseapp.com',
  databaseURL: 'https://sns-taka3sh-org-157419.firebaseio.com'
}
firebase.initializeApp(config)
var auth = firebase.auth()
var database = firebase.database()

function updateMDL () {
  Vue.nextTick(function () {
    document.querySelectorAll('.mdl-js-textfield').forEach(function (elem) {
      if (elem.MaterialTextfield) {
        elem.MaterialTextfield.checkDirty()
      }
    })
  })
}

function setFormLocked (form, locked) {
  form.querySelectorAll('input, textarea').forEach(function (elem) {
    elem.readonly = locked
    if (elem.type === 'submit' || elem.type === 'reset') {
      elem.disabled = locked
    }
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
  .then(function (idToken) {
    form.elements.idToken.value = idToken
    return fetch('https://sns-taka3sh-org-157419.appspot.com/publish', {
      method: 'POST',
      body: new FormData(document.forms[0])
    })
  })
}

function showToast (message) {
  document.querySelector('.mdl-js-snackbar').MaterialSnackbar.showSnackbar({
    message: message
  })
}

function onSubmit (e) {
  setFormLocked(e.target, true)

  createPost(e.target)
  .then(function () {
    return publishNotification(e.target)
  })
  .then(function () {
    e.target.reset()
    setFormLocked(e.target, false)
    showToast('A new post was successfully created.')
  })
  .catch(function (error) {
    setFormLocked(e.target, false)
    showToast(error.message)
    console.log(error)
  })
}

function onReset () {
  this.title = this.body = ''
  this.createdAt = moment().startOf('minute').format()
  updateMDL()
}

function onLogout (e) {
  auth.signOut()
}

var app = new Vue({
  el: '#app',
  data: {
    title: '',
    body: '',
    createdAt: '',
    user: null
  },
  methods: {
    localizeDate: function (date) {
      return moment(date).format('LLLL')
    },
    onLogout: onLogout,
    onSubmit: onSubmit,
    onReset: onReset
  },
  mounted: function () {
    document.forms.post.reset()
  }
})

// Login form

document.forms.login.addEventListener('submit', function (e) {
  e.preventDefault()
  setFormLocked(e.target, true)
  var email = e.target.elements.email.value
  var password = e.target.elements.password.value
  auth.signInWithEmailAndPassword(email, password).then(function () {
    setFormLocked(e.target, false)
    e.target.reset()
    updateMDL()
  }).catch(function (error) {
    setFormLocked(e.target, false)
    showToast(error.message)
  })
})

document.getElementById('cancel').addEventListener('click', function (e) {
  e.preventDefault()
  history.back()
})

var dialog = document.querySelector('dialog')
dialogPolyfill.registerDialog(dialog)

dialog.addEventListener('cancel', function (e) {
  e.preventDefault()
})

auth.onAuthStateChanged(function (user) {
  if (user) {
    app.user = user.email
    dialog.close()
  } else {
    app.user = null
    dialog.showModal()
  }
})
