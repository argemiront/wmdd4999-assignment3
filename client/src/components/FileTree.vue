<template>
  <div id="files">
    <ul>
      <li v-for="file in files" :key="file.id">
        {{ file.name }} - created: {{ file.created }}
        <span v-if="file.removed !== '-'"> - removed: {{ file.removed }} </span>
        <button @click="removeFile(file)" v-else>Remove</button>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  props: [
    'files'
  ],

  methods: {
    removeFile: function (file) {
      this.$emit('deleting', file)
    }
  }
}
</script>

<style scoped>

</style>
