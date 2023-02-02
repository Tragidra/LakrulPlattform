<template>
    <div class="not-found">
        <div class="container">
            <div>
                <h2><span>404</span> PAGE NOT FOUND</h2>
                <p>Sorry the page you requested could not be found :/</p>
            </div>
            <h3><a href="/#"><img
                    src="../assets/logo.png">take me back to ambalytics trends home</a></h3>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'NotFound',
        created() {
            document.title = "Page not found";
        }
    }
</script>

<style lang="scss">
    @import '../assets/_theme.scss'; // copied from '~primevue/resources/themes/nova/theme.css'

    .not-found {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;
        height: 80vh;
        padding-right: 330px;

        .container {
            background: rgba($color-main, 0.1);
            padding: 0 40px 10px 40px;
            border: 5px solid $color-main;
            border-radius: 5px;

            div {
                padding: 0 20px 80px 0;

                p {
                    padding: 20px 0 20px 10px;
                    font-size: 30px;
                }
            }
        }
    }

    h2 {
        span {
            font-size: 160px;
            font-weight: bold;
            margin-right: 30px;
        }
        color: $color-main;
        font-size:50px;
    }

    h3 {
        font-size: 30px;

        a {
            color: $color-main;
            letter-spacing: -2.5px;
            font-family: 'Lato', sans-serif;
            font-size: 35px;
            font-weight: bold;
            align-items: baseline;
            text-decoration: none;
        }

        img {
            margin-right: 10px;
            height: 35px;
            width: auto;
            margin-bottom: -5px;
        }
    }
</style>