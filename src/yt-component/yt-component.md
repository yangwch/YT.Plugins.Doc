Put here the general component usage instructions

    new Vue({
        template: `<yt-component v-model="val"></yt-component>`,
        data(){
            return { val: [123,456, '4'] }
        },
        watch: {
            val(value){
                console.log(value);
            }
        }
    })
