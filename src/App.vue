<template>
  <div id="app">
    <app-login v-if="username === ''"></app-login>
    <app-messaging v-else></app-messaging>
  </div>
</template>

<script>
import Login from './components/Login'
import Messaging from './components/Messaging'

export default {
    name: 'app',
    components: {
        'app-login': Login,
        'app-messaging': Messaging
    },

    computed: {
        username() {
            return this.$store.state.username;
        }
    }

    }
</script>

<style lang="sass">
    @import "../node_modules/flexboxgrid/dist/flexboxgrid.min.css"
    @import "../node_modules/font-awesome/css/font-awesome.css"
    @import "../node_modules/katex/dist/katex.css"
    body 
        margin: 0
        background: lightblue
        font-size: 18px

</style>
