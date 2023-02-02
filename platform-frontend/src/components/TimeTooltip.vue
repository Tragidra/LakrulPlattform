<template>
    <i v-tooltip="text" class="pi pi-fw pi-clock time-visualizer"></i>
</template>

<script>
    export default {
        name: "TimeTooltip",
        props: {
            text: {
                type: String,
                required: false,
                default: 'This value depends on your current time selection.'
            },
        }
    }
</script>


<style lang="scss">
    @import '../assets/_theme.scss'; // copied from '~primevue/resources/themes/nova/theme.css'

    i.pi.pi-fw.pi-clock.time-visualizer {
        font-size: 0.8rem;
        margin-right: 3px;
        color: $color-main;
        vertical-align: middle;
        margin-top: -3px;
    }

    .time-selection > i.pi.pi-fw.pi-clock.time-visualizer {
        font-size: 1.2rem;
        margin-right: 10px;
        margin-top: 0;
    }
</style>
