<template>
  <div id="app">
    <h1>Mini Dropbox tool</h1>
    <upload-comp v-on:uploading="updateData"/>
    <h2>Files on the bucket</h2>
    <file-tree v-on:deleting="deleteFile" v-bind:files="files"/>
  </div>
</template>

<script>
import Upload from './components/UploadForm'
import FileTree from './components/FileTree'
import axios from 'axios'

export default {
  name: 'App',

  data () {
    return {
      files: []
    }
  },

  components: {
    'upload-comp': Upload,
    'file-tree': FileTree
  },

  methods: {
    deleteFile: function (file) {
      axios
        .post(
          'https://53pd57y3nl.execute-api.us-west-2.amazonaws.com/dev/remove',
          file
        )
        .then(response => {
          this.updateData()
        })
        .catch(error => {
          console.log(error)
        })
    },

    updateData: function () {
      setTimeout(this.fetchFiles, 700)
    },

    fetchFiles: function () {
      axios
        .get(
          'https://53pd57y3nl.execute-api.us-west-2.amazonaws.com/dev/list-files'
        )
        .then(response => {
          this.files = response.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  },

  created: function () {
    this.fetchFiles()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h2 {
  margin-top: 3em;
}

ul {
  list-style-type: none;
  padding-left: 0;
  margin-left: 0;
}
</style>
