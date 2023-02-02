<template>
    <div class="amba-tweet">
        <div class="reload-button">
            <span>автоматическое обновление данных с диска</span>
            <InputSwitch v-model="autoUpdate" @change="updateAutoUpdate"/>
        </div>
        <div v-if="tweetsAllowed" class="rendered-tweet special-scrollbar">
            <Tweet
                    v-if="tweetId !== ''"
                    :tweet-id="tweetId"
                    cards="visible"
                    conversation="all"
                    lang="en"
                    theme="light"
                    align="left"
                    :dnt="false"
            >
                <template v-slot:loading>
                    <div style="position: relative; width: 100%; height: 100%; padding: 175px;">
                        <i class="pi pi-spin pi-spinner" style="font-size: 30px;"></i>
                    </div>
                </template>

                <template v-slot:error>
                    <span>Sorry, that tweet can't be loaded.</span>
                </template>
            </Tweet>
        </div>
        <div v-else class="external-content-warning">
            <h3>Информация о вашей работе</h3>
            <div>
                Рабочее пространство LaKrul нуждается в <a href="https://twitter.com">ваших данных</a>.
                Чтобы оптимизировать вашу работу, ему необходимо собрать всю полезную информацию<br><br>
                Это приложение использует новейшие протоколы безопасности, так что не бойтесь предоставлять ему доступ к вашему устройству. Мы гарантируем <a
                    href="https://help.twitter.com/en/rules-and-policies/twitter-cookies">конфеденциальность ваших данных</a> и предоставляем вам на обзор<a
                    href="https://twitter.com/de/privacy">соглашение о приватности наших данных</a>.

            </div>
            <Button label="Загрузить данные" icon="pi pi-check" @click="allowExternalContent"/>
        </div>

        <div class="processed-data">
            <router-link v-if="!doi_in" :to="pubUrl" class="link">
                <h3 class="title">{{ title }}</h3>
                <i class="pi pi-link">{{ doi }}</i>
            </router-link>
            <div v-if="!doi_in">
                <div class="authors">
                    <span v-for="author in authors" v-bind:key="author">
                        <router-link :to="{ name: 'author', params: { id: author.id }}" class="source-link">
                                    {{ author.name }},
                        </router-link>
                    </span>
                </div>

                <div v-if="license && abstract" class="abstract special-scrollbar">
                    {{ abstract }}
                </div>

                <div class="license">
                    <a v-if="license && abstract" target="_blank" :href="license"><i
                            style="font-size: 0.8em; margin-right: 0.5em" class="pi pi-external-link"></i>License</a>
                    <span v-else></span>
                    <a target="_blank" :href="'http://doi.org/' + doi"><i style="font-size: 0.8em; margin-right: 0.5em"
                                                                          class="pi pi-external-link"></i>перейти к загруженным данным</a>
                </div>
            </div>
            <div v-else>
                <h3>Processed Data</h3>
            </div>
            <div class="values">
                <div>
                    <h3>Количество файлов</h3>
                    <p>{{ localeNumber(score) }}</p>
                </div>
                <div>
                    <h3>Возможные улучшения</h3>
                    <p>{{ formatBot(bot_rating) }}</p>
                </div>
                <div>
                    <h3>Рейтинг задач <i style="font-size: 0.9em;" class="pi pi-question-circle"
                                     v-tooltip="'Sentiment can vary from negative (-1) to positive (+1)'"></i></h3>
                    <p>{{ localeNumber(sentiment_raw) }}</p>
                </div>
                <div>
                    <h3>Оценка LaKrul<i style="font-size: 0.9em;" class="pi pi-question-circle"
                                             v-tooltip="'Between 50 and 85% is good, much more and it\'s just the abstract, less and it will have little to do with the publication.'"></i>
                    </h3>
                    <p>{{ localeNumber(contains_abstract_raw * 100) }}%</p>
                </div>
                <div>
                    <h3>Статистика от LaKrul</h3>
                    <p>{{ localeNumber(followers) }}</p>
                </div>
                <div>
                    <h3>Отчёт от Lakrul</h3>
                    <p>{{ lang }}</p>
                </div>
                <div>
                    <h3>Интереc от LaKrul</h3>
                    <p>{{ location }}</p>
                </div>
                <div>
                    <h3>Задачи от LaKrul</h3>
                    <p>{{ source }}</p>
                </div>
                <div>
                    <h3>Рейтинг от LaKrul</h3>
                    <p>{{ subj_type }}</p>
                </div>
                <div v-if="entities && entities.length > 0">
                    <h3>Entities</h3>
                    <p v-for="entity in entities" v-bind:key="entity">{{ entity }}</p>
                </div>
                <div>
                    <h3>Задачи в процессе обработки</h3>
                    <p>{{ localeTime(created_at) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Tweet from "./Tweet.vue";
    import StatService from "../services/StatService";
    import LanguageDecode from "../helper/LanguageDecode";
    import LocationDecode from "../helper/LocationDecode";
    import LicenseCheck from "../helper/LicenseCheck";

    export default {
        name: "AmbaTweet",
        components: {Tweet},
        watch: {
            countryData() {
                this.loadNewestTweet();
            }
        },
        props: {
            doi_in: {
                type: String,
                required: false
            },
            mode: {
                type: String,
                required: false,
                default: 'publication'
            },
            id_in: {
                type: String,
                required: false
            },
        },
        computed: {
            pubUrl: function () {
                return '/publication/' + this.doi
            }
        },
        data() {
            return {
                title: '',
                abstract: '',
                doi: '',
                tweetId: '',
                created_at: '',
                score: '',
                bot_rating: '',
                followers: '',
                sentiment_raw: '',
                contains_abstract_raw: '',
                lang: "",
                location: "",
                source: "",
                subj_type: "",
                question_mark_count: "",
                exclamation_mark_count: "",
                length: "",
                authors: "",
                entities: [],
                license: null,
                tweetsAllowed: false,
                autoUpdate: false,
            }
        },
        created() {
            this.loadNewestTweet();
        },
        methods: {
            updateAutoUpdate() {
                if (this.autoUpdate === true) {
                    this.startAutoUpdate();
                } else {
                    this.cancelAutoUpdate();
                }
            },
            startAutoUpdate() {
                this.loadNewestTweet();
                this.timer = setInterval(this.loadNewestTweet, 10000);
            },
            cancelAutoUpdate() {
                clearInterval(this.timer);
            },
            allowExternalContent: function () {
                this.$cookie.setCookie('external-content-allowed', true, { expire: "1y" });
                this.tweetsAllowed = true;
            },
            localeNumber: function (x) {
                if (isNaN(x)) return '-';
                return x.toLocaleString();
            },
            localeTime: function (x) {
                let d = new Date(x + 'Z');
                return d.toLocaleString();
            },
            formatBot: function (x) {
                if (x === 10) return 'no Bot';
                return 'Никаких'
            },
            loadNewestTweet() {
                StatService.newestTweet(this.mode, this.doi_in, this.id_in)
                    .then(r => {
                        let response = r.data.results[0].data;
                        this.title = response['title'];
                        this.doi = response['doi'];
                        if (LicenseCheck.showLicense(response['license'])) {
                            this.abstract = response['abstract'];
                            this.license = response['license'];
                        } else {
                            this.abstract = false;
                            this.license = false;
                        }
                        this.tweetId = response['sub_id'];
                        this.created_at = response['created_at'];
                        this.score = response['score'];
                        this.bot_rating = response['bot_rating'];
                        this.followers = response['followers'];
                        this.sentiment_raw = response['sentiment_raw'];
                        this.contains_abstract_raw = response['contains_abstract_raw'];
                        if (response['lang'] === 'und') {
                            this.lang = 'Unknown'
                        } else {
                            this.lang = LanguageDecode.decode(response['lang']);
                        }
                        this.location = LocationDecode.decode(response['location']);
                        this.source = response['source'];
                        this.subj_type = response['subj_type'];
                        this.question_mark_count = response['question_mark_count'];
                        this.exclamation_mark_count = response['exclamation_mark_count'];
                        this.length = response['length'];
                        this.authors = r.data.results[0]['authors'];
                        this.entities = response['entities'];
                        if (this.entities === '[]') {
                            this.entities = []
                        } else {
                            this.entities = JSON.parse(this.entities)
                        }
                        if (this.$cookie.getCookie('external-content-allowed') && this.$cookie.getCookie('external-content-allowed') === 'true') {
                            this.tweetsAllowed = true;
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
            }
        },
        beforeUnmount() {
            this.cancelAutoUpdate();
        }
    }
</script>

<style lang="scss">
    @import '../assets/_theme.scss'; // copied from '~primevue/resources/themes/nova/theme.css'

    .amba-tweet {
        display: flex;
        color: $color-main;
        position: relative;
        flex-wrap: wrap;
        row-gap: 50px;

        .p-inputswitch.p-inputswitch-checked .p-inputswitch-slider {
            background: rgba($color-main, 0.5);
        }

        .p-inputswitch.p-inputswitch-checked:not(.p-disabled):hover .p-inputswitch-slider {
            background: rgba($color-main, 0.3) !important;
        }

        .reload-button {
            display: flex;
            cursor: pointer;
            position: absolute;
            right: -1em;
            top: -4.5em;
            padding: 5px;

            span {
                font-size: 0.8em;
                margin-right: 0.7em;
            }
        }

        .rendered-tweet {
            flex-grow: 0;
            width: 400px;
            max-width: 400px;
            min-width: 400px;
            padding: 10px;

            max-height: 650px;
            overflow-y: auto;
        }

        .processed-data {
            margin-top: -20px;
            flex-grow: 1;
            padding: 10px;
            margin-left: 10px;
            width: 300px;
            min-width: 300px;

            .link {
                color: $color-main;
                text-decoration: none;
                margin-bottom: 40px;

                h3:hover, i:hover {
                    filter: brightness(1.3);
                }

                .title {
                    color: $color-main;
                    font-family: 'Lato', sans-serif;
                    font-size: 1.8em;
                    font-weight: bold;
                    margin: 0;
                    padding-bottom: 5px;
                }

                .pi-link::before {
                    font-family: 'primeicons' !important;
                    margin: 5px 5px -5px 0;
                    font-size: 0.8em;
                }

                .pi-link {
                    font-size: 0.9em;
                    font-family: 'Courier New', monospace !important;
                    margin: 0 0 5px 5px;
                }

                i.pi {
                    float: right;
                    font-size: 1.2em;
                    word-break: break-all;
                }
            }

            .authors {
                font-size: 1em;
                margin: 2.5em 0.5em 0.5em 0;
                font-style: italic;
            }

            .license {
                margin: 1em 0 2.5em 0;
                display: flex;
                justify-content: space-between;

                a {
                    font-size: 1em;
                    text-decoration: none;
                    color: $color-main;

                    &:hover {
                        color: black;
                    }
                }
            }

            .abstract {
                font-size: 1.1em;
                max-height: 200px;
                overflow-y: auto;
                padding-right: 0.5em;

                text-align: justify;
                text-justify: inter-word;
            }

            .values {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-content: center;
                column-gap: 10px;
                row-gap: 10px;
                margin-top: 10px;

                div {
                    border-radius: 5px;
                    border: 1px solid $color-main;
                    padding: 5px 10px;
                    min-width: 100px;
                    width: 30%;
                    flex-grow: 1;

                    h3 {
                        color: black;
                        font-size: 0.9em;
                        margin: 0;
                        padding-bottom: 5px;
                    }

                    p {
                        font-size: 1.2em;
                        font-weight: bold;
                        text-align: end;
                        margin: 0;
                    }
                }
            }
        }
    }

    .external-content-warning {
        padding: 1em;
        border: 1px solid $color-main;
        color: black;
        width: 300px;
        border-radius: 5px;
        height: fit-content;

        h3 {
            margin: 0;
            font-size: 1.2em;
        }

        div {
            font-size: 0.9em;
            margin: 1em 0.5em;
            text-align: justify;
            text-justify: inter-word;
        }

        a {
            color: dodgerblue;
            cursor: pointer;
        }

        button:hover {
            background: rgba($color-main, 0.7) !important;
        }
    }

</style>
