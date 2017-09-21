<template lang="html">
  <strong>{{ text }}</strong>
</template>

<script>
/**
 * Component documentation
 */
export default {
  name: 'yt-component',
  props: {
    /**
     * The component text
     */
    text: {
      type: String,
      default: 'Hello yt-component',
      required: true
    },
  },
}
</script>
