<template>
  <transition-group name="card" tag="section" class="mdl-grid" v-show="ready">
    <div v-for="post in posts" class="mdl-card mdl-cell mdl-cell--12-col mdl-shadow--2dp" :id="post.key" :key="post.key">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">{{ post.title }}</h2>
      </div>
      <div class="mdl-card__supporting-text">
        <p v-for="line in post.body.split('\n')" v-text="line"></p>
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