<template>
  <form action="#" method="POST" class="card" @submit.prevent="$emit('submit', $event)" @reset="$emit('reset', $event)">
    <div class="card-title white-text pink lighten-1">{{ heading }}</div>
    <div class="card-content">
      <div class="input-field">
        <input id="title" type="text" required v-model="value.title">
        <label for="title">Title</label>
      </div>
      <div class="input-field">
        <textarea id="body" class="materialize-textarea" required v-model="value.body"></textarea>
        <label for="body">Body</label>
      </div>
      <div class="input-field">
        <datetime-local id="createdAt" required class="validate" v-model="value.createdAt"></datetime-local>
        <label for="createdAt" class="active">Created at</label>
      </div>
    </div>
    <div class="card-action">
      <slot></slot>
    </div>
  </form>
</template>

<script>
import DatetimeLocal from './DatetimeLocal.vue'

export default {
  props: {
    heading: String,
    value: Object
  },
  components: {
    'datetime-local': DatetimeLocal
  }
}
</script>
