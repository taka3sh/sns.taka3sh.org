<template>
  <div class="switch">
    <label>
      <input type="checkbox" :checked="enabled" @click="onClick">
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
      if (value) {
        this.switch.MaterialSwitch.disable()
        this.switch.classList.remove('is-focused')
      } else {
        this.switch.MaterialSwitch.enable()
      }
    },
    enabled: function (value) {
      if (value) {
        this.switch.MaterialSwitch.on()
      } else {
        this.switch.MaterialSwitch.off()        
      }
    }
  },
  methods: {
    onClick: function (e) {
      this.$emit('click', e)
    }
  },
  mounted: function () {
    this.switch = this.$el.querySelector('.mdl-js-switch')
    //componentHandler.upgradeElement(this.switch)
  }
}
</script>