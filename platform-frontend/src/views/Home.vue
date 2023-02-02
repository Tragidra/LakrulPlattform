<template>
    <div class="p-grid">

        <div class="p-col-12 p-md-12 p-lg-6 p-xl-3">
            <TrendingOverview :trendingItems="trendingItems"></TrendingOverview>
        </div>

        <div class="p-col-12 p-md-12 p-lg-6 p-xl-6">
            <Card>
                <template #title>
                    Рабочее пространство
                </template>
                <template #content>
                    <AmbaTweet>
                    </AmbaTweet>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-12 p-lg-12 p-xl-3">
            <Card class="stats">
                <template #title>
                    Моя статистика
                </template>
                <template #content>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Число файлов
                        </h3>
                        <p class="padding-left">{{ localeNumber(tweetCount) }}</p>
                    </div>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Потрачено часов
                        </h3>
                        <p class="padding-left">{{ localeNumber(pubCount)}}</p>
                    </div>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Число улучшений ИИ
                        </h3>
                        <p class="padding-left">{{ localeNumber(totalFollowers) }}</p>
                    </div>
                    <!-- total score, average score -->
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Средняя оценка ИИ
                        </h3>
                        <p class="padding-left">{{ localeNumber(Math.round(scoreSum / tweetCount * 100) / 100) }}</p>
                    </div>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Эффективность работы
                        </h3>
                        <p class="padding-left">{{ localeNumber(Math.round(sentiment * 100) / 100) }}</p>
                    </div>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Средний процент использования ИИ
                        </h3>
                        <p class="padding-left">{{ localeNumber(Math.round(containsAbstract * 10000) / 100) }}%</p>
                    </div>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Средний процент документирования работы
                        </h3>
                        <p class="padding-left">{{ localeNumber(Math.round(exclamations * 10000) / 100) }}%</p>
                    </div>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Средний процент решённых проблем
                        </h3>
                        <p class="padding-left">{{ localeNumber(Math.round(questions * 10000) / 100) }}%</p>
                    </div>
                    <div class="padding-left">
                        <h3>Общее количество рекомендаций от ИИ</h3>
                        <p class="padding-left">{{ localeNumber(totalTweetCount) }}</p>
                    </div>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-12 p-lg-6 p-xl-6 word-wrapper">
            <Card>
                <template #title>
                    <span v-on:dblclick="easterEgg">{{ this.wordCloudTitle }}</span>
                </template>
                <template #content>
                    <word-cloud v-if="renderCloud" ref="worldCloud" :data="words"></word-cloud>
                    <div v-else class="no-data">
                        - нет данных -
                    </div>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-12 p-lg-6 p-xl-6">
            <Card>
                <template #title>
                    Tweet Author Locations
                </template>
                <template #content>
                    <MapChart v-if="renderMap" :countryData="countries"/>
                    <div v-else class="no-data">
                        - no data available -
                    </div>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-12 p-lg-6 p-xl-6">
            <Card class="big-chart">
                <template #title>
                    <time-tooltip/>
                    Top 5 Publications by Twitter Activity over Time
                </template>
                <template #content>
                    <Dropdown v-model="selectedPubField" :options="pubFields" optionLabel="label"
                              optionValue="value" placeholder="Select a Field" @change="loadPubsProgress"/>
                    <br>
                    <publication-chart :height="600" title=" " :dateFormat="true" :rawData="pubsOverTimeData"
                                       type="line"></publication-chart>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-12 p-lg-6 p-xl-6">
            <Card class="big-chart">
                <template #title>
                    <time-tooltip/>
                    Top 5 Trending Publications by Ambalytics Trends
                </template>
                <template #content>
                    <Dropdown v-model="selectedTrendField" :options="trendFields" optionLabel="label"
                              optionValue="value" placeholder="Select a Field" @change="loadTrendingProgress"/>
                    <br>
                    <publication-chart :height="600" title=" " :dateFormat="true" :rawData="trendOverTimeData"
                                       type="line"></publication-chart>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-6 p-lg-4 p-xl-3">
            <Card>
                <template #title>
                    Tweet Types
                </template>
                <template #content>
                    <publication-chart :rawData="topValues['tweet_type']"></publication-chart>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-6 p-lg-4 p-xl-3">
            <Card>
                <template #title>
                    Top Twitter Languages
                </template>
                <template #content>
                    <publication-chart :rawData="topValues['lang']"></publication-chart>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-6 p-lg-4 p-xl-3">
            <Card>
                <template #title>
                    Top Hashtags
                </template>
                <template #content>
                    <publication-chart :show-others="false" :rawData="topValues['hashtag']"></publication-chart>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-6 p-lg-4 p-xl-3">
            <Card>
                <template #title>
                    Top Twitter Entities
                </template>
                <template #content>
                    <publication-chart :show-others="false" :rawData="topValues['entity']"></publication-chart>
                </template>
            </Card>
        </div>
    </div>
</template>

<script>

    import PublicationChart from "../components/PublicationChart.vue";
    import PublicationService from "../services/PublicationService.js";
    import AuthorService from "../services/AuthorService.js";
    import LanguageDecode from "../helper/LanguageDecode.js";
    import FieldOfStudy from "../services/FieldOfStudyService.js";
    import AmbaTweet from "../components/AmbaTweet.vue"
    import StatService from "../services/StatService.js";
    import MapChart from "../components/MapChart.vue";
    import WordCloud from "../components/WordCloud.vue";
    import TimeTooltip from "../components/TimeTooltip.vue";
    import TrendingOverview from "../components/TrendingOverview.vue";

    export default {
        name: 'Home',
        components: {PublicationChart, MapChart, AmbaTweet, WordCloud, TimeTooltip, TrendingOverview},
        beforeRouteUpdate(to, from) {
            if (to.query.time !== from.query.time) {
                if (to.query.time !== undefined) {
                    this.duration = to.query.time;
                    this.fetchData();
                } else {
                    this.duration = 'currently';
                    this.fetchData();
                }
            }
        },
        data: () => ({
            duration: "currently",
            wordCloudTitle: 'Tweet Content Word Cloud',
            countries: [],
            words: [],
            render: false,
            renderMap: false,
            renderCloud: false,
            pubCount: '-',
            tweetCount: '-',
            scoreSum: '-',
            totalFollowers: '-',
            sentiment: '-',
            containsAbstract: '-',
            questions: '-',
            exclamations: '-',
            totalTweetCount: '-',
            a: 0,
            topValues: [],
            trendOverTimeData: [],
            selectedTrendField: 'score',
            trendFields: [
                {label: 'Score', value: 'score'},
                {label: 'Count', value: 'count'},
                {label: 'Sentiment', value: 'mean_sentiment'},
                {label: 'Followers', value: 'sum_followers'},
                {label: 'Abstract Similarity', value: 'abstract_difference'},
                {label: 'Mean Age', value: 'mean_age'},
                {label: 'Length', value: 'mean_length'},
                {label: 'Questions', value: 'mean_questions'},
                {label: 'Exclamations', value: 'mean_exclamations'},
                {label: 'Bot Rating', value: 'mean_bot_rating'},
                {label: 'Projected Change', value: 'projected_change'},
                {label: 'Theil–Sen estimator', value: 'trending'},
                {label: 'EMA', value: 'ema'},
                {label: 'KAMA', value: 'kama'},
                {label: 'KER', value: 'ker'},
                {label: 'Mean Score', value: 'mean_score'},
                {label: 'SD', value: 'stddev'},
            ],
            pubsOverTimeData: [],
            fosWords: [],
            selectedPubField: 'score',
            pubFields: [
                {label: 'Bot Rating', value: 'bot_rating'},
                {label: 'Abstract Similarity', value: 'contains_abstract_raw'},
                {label: 'Exclamations', value: 'exclamations'},
                {label: 'Followers', value: 'followers'},
                {label: 'Length', value: 'length'},
                {label: 'Questions', value: 'questions'},
                {label: 'Score', value: 'score'},
                {label: 'Sentiment', value: 'sentiment_raw'},
                {label: 'Count', value: 'count'},
            ],
            trendingItems: [
                {label: 'Publications', data: [], icon: 'pi pi-fw pi-book', path: '/publications'},
                {label: 'Authors', data: [], icon: 'pi pi-fw pi-user', path: '/authors'},
                {label: 'Fields of Study', data: [], icon: 'pi pi-fw pi-sitemap', path: '/fieldsOfStudy'},
            ]
        }), created() {
            document.title = "Рабочее пространство с LaKrul";
            if (this.$route.query.time !== undefined) {
                this.duration = this.$route.query.time;
            }
            this.fetchData();
        },
        mounted() {
            this.timerStats = setInterval(this.loadStats, 60000);
            this.timerTweets = setInterval(this.loadTweetCount, 5000);
            this.timerTrending = setInterval(this.trendingUpdates, 180000);
        },
        methods: {
            trendingUpdates() {
                this.loadTrendingItems();
                this.loadTrendingProgress();
                this.loadPubsProgress();
            },
            localeNumber: function (x) {
                if (isNaN(x)) return '-';
                return x.toLocaleString('de-De');
            },
            loadPubsProgress() {
                StatService.progressValue(this.selectedPubField, 5, this.duration)
                    .then(response => {
                        this.pubsOverTimeData = response.data.results;
                    })
                    .catch(e => {
                        this.pubsOverTimeData = [];
                        console.log(e);
                    });
            },
            easterEgg() {
                // show fields of study instead of tweet word content
                this.wordCloudTitle = 'Fields of Study Word Cloud';
                this.loadFosWordData();
            },
            loadFosWordData() {
                FieldOfStudy.trending(this.duration, 0, 80)
                    .then(response => {
                        let words = [];
                        response.data.results.forEach((e) => {
                            let obj = {};
                            obj.text = e.name;
                            obj.value = e.score;
                            words.push(obj)
                        });
                        this.words = words;
                        this.renderCloud = true;
                    })
                    .catch(e => {
                        console.log(e);
                        this.fosWords = []
                    });
            },
            loadTrendingProgress() {
                StatService.progressTrending(this.selectedTrendField, 5, this.duration)
                    .then(response => {
                        this.trendOverTimeData = response.data.results;
                    })
                    .catch(e => {
                        this.trendOverTimeData = [];
                        console.log(e);
                    });
            },
            loadTrendingItems() {
                PublicationService.trending(this.duration, 0, 5)
                    .then(response => {
                        this.trendingItems[0].data = response.data.results;
                    })
                    .catch(e => {
                        console.log(e);
                        this.trendingItems[0].data = []
                    });

                AuthorService.trending(this.duration, 0, 3)
                    .then(response => {
                        this.trendingItems[1].data = response.data.results;
                    })
                    .catch(e => {
                        console.log(e);
                        this.trendingItems[1].data = []
                    });

                FieldOfStudy.trending(this.duration, 0, 3)
                    .then(response => {
                        this.trendingItems[2].data = response.data.results;
                    })
                    .catch(e => {
                        console.log(e);
                        this.trendingItems[2].data = []
                    });
            },
            loadStats() {
                StatService.numbers(this.duration, null, this.$route.params.p)
                    .then(response => {
                        this.tweetCount = response.data.results['count'];
                        this.totalFollowers = response.data.results['followers'];
                        this.scoreSum = response.data.results['score'];
                        this.containsAbstract = response.data.results['contains_abstract_raw'];
                        this.sentiment = response.data.results['sentiment_raw'];
                        this.pubCount = response.data.results['pub_count'];
                        this.questions = response.data.results['questions'];
                        this.exclamations = response.data.results['exclamations'];
                    })
                    .catch(e => {
                        console.log(e);
                        this.tweetCount = '-';
                        this.totalFollowers = '-';
                        this.scoreSum = '-';
                        this.containsAbstract = '-';
                        this.sentiment = '-';
                        this.pubCount = '-';
                        this.questions = '-';
                        this.exclamations = '-';
                    });
            },
            loadTweetCount() {
                StatService.tweetCount('publication', this.$route.params.p)
                    .then(response => {
                        this.totalTweetCount = response.data.results[0].sum;
                    })
                    .catch(e => {
                        this.totalTweetCount = '-';
                        console.log(e);
                    });
            },
            fetchData() {
                this.loadTrendingItems();
                this.loadStats();
                this.loadTweetCount();
                this.loadPubsProgress();
                this.loadTrendingProgress();

                if (!this.renderCloud) {
                    StatService.top()
                        .then(response => {
                            let words = [];
                            response.data.results.word.forEach((e) => {
                                let obj = {};
                                obj.text = e.value;
                                obj.value = e.count;
                                words.push(obj)
                            });
                            this.words = words;
                            this.renderCloud = true;
                        })
                        .catch(e => {
                            this.renderCloud = false;
                            console.log(e);
                        });
                }

                if (!this.renderMap) {
                    StatService.top(['location'], null, 1000)
                        .then(response => {
                            let c = {};
                            response.data.results.location.forEach((e) => {
                                c[e.value.toUpperCase()] = e.count
                            });
                            this.countries = c;
                            this.renderMap = true;
                        })
                        .catch(e => {
                            this.renderMap = false;
                            console.log(e);
                        });
                }

                if (!this.render) {
                    StatService.percentages()
                        .then(response => {
                            this.loading = false;

                            let lang = response.data.results.lang.map(e => {
                                return {
                                    count: e.count,
                                    p: e.p,
                                    value: LanguageDecode.decode(e.value)
                                }
                            });

                            this.topValues = response.data.results;
                            this.topValues.lang = lang;

                            this.render = true;
                        })
                        .catch(e => {
                            console.log(e);
                        });
                }
            },
            hover(e) {
                if (!e) {
                    console.log(e)
                }
            },
        },
        beforeUnmount() {
            clearInterval(this.timerTweets);
            clearInterval(this.timerStats);
            clearInterval(this.timerTrending);
        }
    }
</script>
