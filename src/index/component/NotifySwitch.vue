<template>
  <div class="switch">
    <label>
      <input type="checkbox" :checked="enabled" @click="$emit('click', e)">
      <span class="lever"></span>
      {{ enabled ? '通知オン' : '通知オフ' }}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    busy: Boolean,
    enabled: Boolean
  },
  watch: {
    busy: function (value) {
      this.$el.querySelector('input').disabled = value
    }
  }
}
</script>