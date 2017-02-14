<template>
  <dialog class="mdl-dialog" id="logindialog">
    <form action="#" method="POST" v-on:submit.prevent="onLogin">
      <h4 class="mdl-dialog__title">Login</h4>
      <div class="mdl-dialog__content">
        <div>
          <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="email" name="email" required v-bind:readonly="busy">
            <label class="mdl-textfield__label" for="email">Email</label>
          </div>
        </div>
        <div>
          <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="password" name="password" required v-bind:readonly="busy">
            <label class="mdl-textfield__label" for="password">Password</label>
          </div>
        </div>
      </div>
      <div class="mdl-dialog__actions">
        <input type="submit" class="mdl-button" value="Login" v-bind:disabled="busy">
        <button class="mdl-button" id="cancel" v-on:click.prevent="history.back()">Cancel</button>
      </div>

      <div class="mdl-js-snackbar mdl-snackbar">
        <div class="mdl-snackbar__text"></div>
        <button class="mdl-snackbar__action" type="button"></button>
      </div>
    </form>
  </dialog>
</template>

<script>
function userChanged (value) {
  if (this.$el.open && value) {
    this.$el.close()
  } else if (!this.$el.open && !value) {
    this.$el.showModal()
  }
}

function componentMounted() {
  var self = this

  addEventListener('load', function () {
    dialogPolyfill.registerDialog(self.$el)
    self.$el.addEventListener('cancel', function (e) {
      e.preventDefault()
    })

    self.$watch('user', userChanged, { immediate: true })
  })
}

function onLogin (e) {
  this.$emit('login', e.target.elements.email.value, e.target.elements.password.value)
}

export default {
  data: function () {
    return {
      busy: false
    }
  },
  props: {
    user: String
  },
  methods: {
    onLogin: onLogin
  },
  mounted: componentMounted
}
</script>