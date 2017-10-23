<template lang="html">
    <div>
        <input type="text" :value="item" v-for="(item,index) in currentValue" @click="inputHandler(index)" style="display: block"/>
    </div>

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
            default: 'Hello yt-component'
        },
        value: {
            type: [String, Array],
            default: ''
        }
    },
    data(){
        return {
            currentValue: this.value
        }
    },
    watch: {
        currentValue(value){
            this.$emit('input', value);
        }
    },
    methods: {
        inputHandler(index){
            this.currentValue.splice(index, 1);
        }
    }
}
</script>
