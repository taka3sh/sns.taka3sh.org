<template>
  <div class="mdl-cell mdl-cell--12-col">
    <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect">
      <input type="checkbox" class="mdl-switch__input" @click="onClick">
      <span class="mdl-switch__label">{{ enabled ? '通知オン' : '通知オフ' }}</span>
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
    console.log(this.switch)
    componentHandler.upgradeElement(this.switch)
  }
}
</script>