<template>
  <div class="modal" id="logindialog">
    <form action="#" method="POST" @submit.prevent="$emit('submit', $event.target.elements.email.value, $event.target.elements.password.value)">
      <div class="modal-content">
        <h4>Login</h4>
        <div class="row">
          <div class="input-field col s12">
            <input id="email" type="email">
            <label for="email">Email</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input id="password" type="password">
            <label for="password">Password</label>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-flat" type="submit">Login</button>      
        <button class="btn-flat" @click="history.back()">Cancel</button>
      </div>
    </form>
  </div>
</template>

<script>
function mounted() {
  $(this.$el).modal({
    dismissible: false,
    inDuration: 0,
  })

  this.$watch('show', function (value) {
    $(this.$el).modal(value ? 'open' : 'close')
  }, {
    immediate: true
  })
}

export default {
  props: {
    show: Boolean
  },
  mounted: mounted
}
</script>