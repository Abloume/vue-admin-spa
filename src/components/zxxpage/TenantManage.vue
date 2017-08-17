<template>
    <transition name="move" mode="out-in">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </transition>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    methods: {

    },
    beforeMount() {

    }
}
</script>
