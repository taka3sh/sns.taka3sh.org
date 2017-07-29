<template>
  <input type="text" :value="value" @input="input">
</template>

<script>
export default {
  props: {
    value: String
  },
  methods: {
    input: function (e) {
      var value = e.target.value

      if (moment && !moment(value, moment.ISO_8601).isValid()) {
        this.$el.setCustomValidity('Invalid date')
      }

      this.$emit('input', value)
    }
  }
}
</script>
