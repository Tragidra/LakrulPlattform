<template>
    <div class="p-grid">

        <div class="p-col-12 p-md-12 p-lg-12 p-xl-12">
            <Card class="table-card">
                <template #title>
                    Trending {{ authorName }}
                </template>
                <template #content>
                    <TrendingPublicationsTable :value="data" :lazyParams="lazyParams" :loading="loading"
                                               :totalRecords="totalRecords"
                                               @page="onPage($event)" @sort="onPage($event)" @search="onSearch($event)">
                    </TrendingPublicationsTable>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-12 p-lg-6 p-xl-6">
            <Card class="big-chart">
                <template #title>
                    <time-tooltip/>
                    Trending Publications by Ambalytics Trends
                </template>
                <template #content>
                    <Dropdown v-model="selectedTrendField" :options="trendFields" optionLabel="label"
                              optionValue="value" placeholder="Select a Field" @change="loadTrendingProgress"/>
                    <br>
                    <publication-chart v-if="renderTrendingChart" :height="500" title=" " :dateFormat="true"
                                       :rawData="trendOverTimeData"
                                       type="line"></publication-chart>
                    <div v-else class="no-data">
                        - no data available -
                    </div>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-6 p-lg-6 p-xl-3">
            <Card class="stats">
                <template #title>
                    Stats
                </template>
                <template #content>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Tweet Count
                        </h3>
                        <p class="padding-left">{{ localeNumber(tweetCount) }}</p>
                    </div>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Publication Count
                        </h3>
                        <p class="padding-left">{{ localeNumber(pubCount)}}</p>
                    </div>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Total Followers Reached
                        </h3>
                        <p class="padding-left">{{ localeNumber(totalFollowers) }}</p>
                    </div>
                    <!-- total score, average score -->
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Average Score per Tweet
                        </h3>
                        <p class="padding-left">{{ localeNumber(Math.round(score * 100) / 100) }}</p>
                    </div>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Average Sentiment
                        </h3>
                        <p class="padding-left">{{ localeNumber(Math.round(sentiment * 100) / 100) }}</p>
                    </div>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Average Abstract Similarity
                        </h3>
                        <p class="padding-left">{{ localeNumber(Math.round(containsAbstract * 10000) / 100) }}%</p>
                    </div>
                    <div class="padding-left">
                        <h3>Total Tweets Processed</h3>
                        <p class="padding-left">{{ localeNumber(totalTweetCount) }}</p>
                    </div>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-6 p-lg-6 p-xl-3">
            <Card>
                <template #title>
                    Profile
                </template>
                <template #content>
                    <publication-chart title=" " :rawData="profileData" :height="500"
                                       type="radar"></publication-chart>
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


        <div class="p-col-12 p-md-12 p-lg-12 p-xl-6 word-wrapper">
            <Card>
                <template #title>
                    Tweet Content Word Cloud
                </template>
                <template #content>
                    <word-cloud ref="worldCloud" v-if="renderCloud" :data="words"></word-cloud>
                    <div v-else class="no-data">
                        - no data available -
                    </div>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-12 p-lg-12 p-xl-6">
            <Card>
                <template #title>
                    Newest Tweet
                </template>
                <template #content>
                    <AmbaTweet :id_in="$route.params.id" mode="author">
                    </AmbaTweet>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-12 p-lg-12 p-xl-6">
            <Card class="big-chart">
                <template #title>
                    Publications by Twitter Activity over Time
                </template>
                <template #content>
                    <Dropdown v-model="selectedPubField" :options="pubFields" optionLabel="label"
                              optionValue="value" placeholder="Select a Field" @change="loadPubsProgress"/>
                    <br>
                    <publication-chart v-if="renderPublicationChart" :height="600" title=" " :dateFormat="true"
                                       :rawData="pubsOverTimeData"
                                       type="line"></publication-chart>
                    <div v-else class="no-data">
                        - no data available -
                    </div>
                </template>
            </Card>
        </div>

    </div>
</template>

<script>
    import PublicationService from "../services/PublicationService";
    import AuthorService from "../services/AuthorService";
    import PublicationChart from "../components/PublicationChart";
    import MapChart from "../components/MapChart";
    import AmbaTweet from "../components/AmbaTweet";
    import WordCloud from "../components/WordCloud";
    import StatService from "../services/StatService";
    import TimeTooltip from "../components/TimeTooltip";
    import TrendingPublicationsTable from "../components/TrendingPublicationsTable";

    export default {
        name: 'Author',
        components: {PublicationChart, MapChart, AmbaTweet, WordCloud, TimeTooltip, TrendingPublicationsTable},
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
        data() {
            return {
                duration: "currently",
                authorName: '',
                lazyParams: {},
                data: [],
                loading: true,
                searchWord: '',
                totalRecords: 0,
                countries: [],
                words: [],
                renderMap: false,
                renderCloud: false,
                renderTrendingChart: true,
                renderPublicationChart: true,
                pubCount: '-',
                tweetCount: '-',
                score: '-',
                totalFollowers: '-',
                sentiment: '-',
                containsAbstract: '-',
                questions: '-',
                exclamations: '-',
                totalTweetCount: '-',
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
                profileData: []
            }
        },
        created() {
            if (this.$route.query.time !== undefined) {
                this.duration = this.$route.query.time;
            }
            this.fetchData();
        },
        mounted() {
            this.lazyParams = {
                first: 0,
                rows: 5,
                sortField: 'score',
                sortOrder: -1,
            };
        },
        methods: {
            loadPubsProgress() {
                AuthorService.progressValue(this.selectedPubField, 5, this.duration, this.$route.params.id)
                    .then(response => {
                        this.pubsOverTimeData = response.data.results;
                        this.renderPublicationChart = true;
                    })
                    .catch(e => {
                        this.renderPublicationChart = false;
                        this.pubsOverTimeData = [];
                        console.log(e);
                    });
            },
            loadTrendingProgress() {
                AuthorService.progressTrending(this.selectedTrendField, 5, this.duration, this.$route.params.id)
                    .then(response => {
                        this.trendOverTimeData = response.data.results;
                        this.renderTrendingChart = true;
                    })
                    .catch(e => {
                        this.renderTrendingChart = false;
                        this.trendOverTimeData = [];
                        console.log(e);
                    });
            },
            onPage(event) {
                this.lazyParams = event;
                this.fetchData();
            },
            onSearch(word) {
                this.searchWord = word;
                this.fetchData();
            },
            localeNumber: function (x) {
                if (isNaN(x)) return '-';
                return x.toLocaleString(); // 'de-De'
            },
            fetchData() {
                this.loading = true;

                AuthorService.get(this.$route.params.id)
                    .then(response => {
                        this.authorName = response.data.results.author.name;
                        document.title = this.authorName;
                    })
                    .catch(e => {
                        this.authorName = '';
                        console.log(e);
                    });

                PublicationService.trendingAuthor(this.duration, this.$route.params.id, this.lazyParams.first, this.lazyParams.rows, this.lazyParams.sortField, this.lazyParams.sortOrder > 0 ? 'asc' : 'desc', this.searchWord)
                    .then(response => {
                        this.data = response.data.results;
                        this.data.forEach(element => {
                            element.score = Math.round(element.score);
                            element.length_avg = Math.round(element.length_avg);
                            element.projected_change = Math.round(element.projected_change);
                            element.mean_age = Math.round(element.mean_age / 3600 * 10) / 10;
                            element.mean_length = Math.round(element.mean_length);
                            element.ema = Math.round(element.ema);
                            element.kama = Math.round(element.kama);
                            element.mean_score = Math.round(element.mean_score);
                            element.stddev = Math.round(element.stddev);
                            element.contains_abstract_avg = Math.round(element.contains_abstract_avg * 100) / 100;
                            this.totalRecords = element.total_count ? element.total_count : 0;
                            if (!element.pub_date) {
                                element.pub_date = element.year;
                            } else {
                                let d = new Date(element.pub_date);
                                element.pub_date = d.toLocaleDateString();
                            }
                        });
                        this.loading = false
                    })
                    .catch(e => {
                        this.data = [];
                        this.loading = false;
                        console.log(e);
                    });

                this.loadPubsProgress();
                this.loadTrendingProgress();

                AuthorService.numbers(this.duration, null, this.$route.params.id)
                    .then(response => {
                        this.tweetCount = response.data.results['count'];
                        this.totalFollowers = response.data.results['followers'];
                        this.score = response.data.results['score'];
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
                        this.score = '-';
                        this.containsAbstract = '-';
                        this.sentiment = '-';
                        this.pubCount = '-';
                        this.questions = '-';
                        this.exclamations = '-';
                    });

                AuthorService.profileData(this.$route.params.id, this.duration)
                    .then(response => {
                        this.profileData = [response.data.results];
                    })
                    .catch(e => {
                        console.log(e);
                    });

                AuthorService.top(null, this.$route.params.id)
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

                AuthorService.top(['location'], this.$route.params.id, 1000)
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

                StatService.tweetCount('author', null, this.$route.params.id)
                    .then(response => {
                        this.totalTweetCount = response.data.results[0].count;
                    })
                    .catch(e => {
                        this.totalTweetCount = '-';
                        console.log(e);
                    });
            },
        }
    }
</script>