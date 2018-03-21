<template>
  <div>
    <form @submit.prevent="handleSubmit">

      <div>
        <input @change="handleFileChange" type="file" name="files[]" id="file" data-multiple-caption="{count} files selected" multiple />
        <!-- <label for="file">Choose files</label> -->
      </div>

      <h3>Files To Upload</h3>
      <ul>
        <li v-for="file in files" :key="file.name">
          {{file.name}}
        </li>
      </ul>

      <input v-if="files.length > 0" type="submit" value="Upload"/>
      <!-- <button type="button" @click="sendUpload">
          Start Upload
      </button> -->

      {{message}}
    </form>

  </div>
</template>

<script>
import {uploadFiles} from '@/aws-config.js'

export default {
  name: 'upload-form',
  data () {
    return {
      files: [],
      message: null
    }
  },
  methods: {
    handleFileChange (e) {
      this.files = [...e.target.files]
      this.message = null
    },
    handleSubmit (e) {
      uploadFiles(this.files).then(r => {
        this.files = []
        this.message = 'Uploaded!'
        this.$emit('uploading')
      })
    }
  }
}
</script>
