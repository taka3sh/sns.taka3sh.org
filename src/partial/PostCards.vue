<template>
  <transition-group name="card" tag="section" class="mdl-grid" v-show="ready">
    <div class="card" v-for="post in posts" :id="post.key" :key="post">
      <div class="card-title amber darken-1">{{ post.title }}</div>
      <div class="card-content">
        <p v-for="line in post.body.split('\n')">{{ line }}</p>
        <p>{{ post.createdAt | date-localize }}</p>
      </div>
    </div>
  </transition-group>
</template>

<script>
export default {
  props: {
    posts: Array,
    ready: Boolean
  }
}
</script>