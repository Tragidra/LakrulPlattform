<template>
    <h2>About <span>ambalytics analysis streams</span><a href="https://github.com/ambalytics" target="_blank"><img
            src="../assets/logo.png"></a></h2>
    <div class="about-container">
        <div class="help">
            <img src="../assets/easy_explanation.png">
            <div>
                <h3>What we do</h3>
                <p>When someone publishes a tweet containing a URL linked to a publication, we collect this tweet and
                    link it to its publication.<br>
                    Furthermore, we then process the tweet to extract features like sentiment or user following. This
                    allows us to give a value to the tweet called score. A higher score means that this tweet is of
                    higher value than one with a lower score. Using these scores, we then aggregate the data over a
                    period of time.<br>
                    This allows us to rank publications over a period of time using our trending algorithm.<br>
                    The periods of time are:
                    <br>&nbsp; &nbsp;-&nbsp; present (last 6h)
                    <br>&nbsp; &nbsp;-&nbsp; today (last 24h)
                    <br>&nbsp; &nbsp;-&nbsp; week (last 7 days)
                    <br>&nbsp; &nbsp;-&nbsp; month (last 30 days)
                    <br>&nbsp; &nbsp;-&nbsp; year (last 365 days)
                </p>
            </div>
        </div>
        <div class="about">
            <div class="about-line">powered by <a href="https://ambalytics.com/" target="_blank"><img
                    style="margin-bottom: -10px" src="../assets/amba-logo.png"></a></div>
            <div class="about-line">
                <a href="https://ambalytics.com/privacy-policy" target="_blank">Privacy Policy</a> | <a
                    href="https://ambalytics.com/imprint" target="_blank">Imprint</a></div>
            <div class="about-line">Twitter Data from <a href="https://twitter.com/" target="_blank"><img
                    src="../assets/twitter-logo.svg"></a></div>
            <div class="about-line">Publication Data from <a href="https://crossref.org/" target="_blank"><img
                    src="../assets/crossref-logo.svg"></a><a href="https://develop.openaire.eu/overview.html"
                                                             target="_blank"><img
                    src="../assets/open-aire-logo.png"></a><a href="https://www.semanticscholar.org?utm_source=api"
                                                              target="_blank"><img
                    src="../assets/semantic_scholar-logo.svg"></a></div>
            <div class="about-line">Source Code<a href="https://github.com/ambalytics" target="_blank"><img
                    src="../assets/repo.png"></a></div>
            <div class="about-line"><a href="https://github.com/lukasjesche" target="_blank"><img class="logo"
                                                                                                  src="../assets/logo_lj.png">Lukas
                Jesche</a>License <a href="https://opensource.org/licenses/MIT" target="_blank">MIT</a></div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'About',
        created() {
            document.title = "About ambalytics trends";
        }
    }
</script>

<style lang="scss">
    @import '../assets/_theme.scss'; // copied from '~primevue/resources/themes/nova/theme.css'

    h2 {
        font-size: 30px;
        margin-left: 50px;

        span {
            margin-left: 20px;
            color: $color-main;
            letter-spacing: -2.5px;
            font-family: 'Lato', sans-serif;
            font-size: 35px;
            font-weight: bold;
            align-items: baseline;
        }

        img {
            margin-left: 10px;
            height: 35px;
            width: auto;
            margin-bottom: -5px;
        }
    }

    .help {
        display: flex;
        border: 3px solid $color-main;
        border-radius: 5px;
        margin: 30px 20px 0 0;
        height: max-content;
    }

    .help > img {
        height: 500px;
    }

    .help > div {
        min-width: 250px;
        max-width: 300px;
        padding: 10px;
    }

    .help > div > p {
        padding: 10px 5px;
        margin: 0;
        text-align: justify;
        text-justify: inter-word;
        line-height: 1.2em;
    }


    .help > div > h3 {
        margin: 0;
        color: $color-main;
    }


    .about-container {
        display: flex;
        justify-content: center;
        padding: 0 5em;

        .about {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;

            .about-line {
                border-radius: 5px;
                border: 3px solid $color-main;
                margin: 1em 1em;
                min-width: 600px;
                font-weight: bold;
                font-size: 35px;
                line-height: 50px;
                padding: 20px 50px;
                height: 90px;
                display: flex;
                justify-content: space-between;
                color: $color-main;
                font-variant: small-caps;
                letter-spacing: -2.5px;
                font-family: 'Lato', sans-serif;
                align-items: center;

                &:last-of-type {
                    border-top: 2px solid $color-main;
                    margin-top: 2em;
                    font-size: 30px;
                }

                a {
                    color: $color-main;
                    text-decoration: none;
                }

                img {
                    margin-left: 20px;
                    height: 50px;
                    width: auto;
                }

                .logo {
                    margin-bottom: -13px;
                    margin-right: 15px;
                    margin-left: 0;
                }
            }
        }
    }

    @media only screen and (max-width: 1700px) {
        .about-container .about .about-line {
            height: fit-content;
            flex-wrap: wrap;
        }
    }

    @media only screen and (max-width: 1200px) {
        .about-container {
            padding-right: 0;
            flex-wrap: wrap;
        }
        .help {
            margin: 0;
        }
        .about-container {
            padding: 0;
        }
        .about-container .about .about-line {
            padding: 20px 20px;
        }
    }
</style>