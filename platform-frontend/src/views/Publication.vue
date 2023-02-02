<template>
    <div class="p-grid">

        <div class="p-col-12 p-md-12 p-lg-12 p-xl-6 publication_info_main scroller">
            <Card>
                <template #title>
                    {{ publication.title }}
                    <a class="source" target="_blank" :href="realUrl">
                        <i class="pi pi-external-link" style="    font-size: 1.5rem;"></i>
                    </a>
                </template>
                <template #content>
                    <div class="content">
                        <div class="authors">
                            <span v-for="author in publication.authors" v-bind:key="author">
                                <router-link :to="{ name: 'author', params: { id: author.id }}" class="source-link">
                                            {{ author.name }},
                                </router-link>
                            </span>
                        </div>


                        <div v-if="publication.license && publication.abstract" class="abstract special-scrollbar">
                            {{ publication.abstract }}
                        </div>

                        <div class="license" style="margin-bottom: 5px;">
                            <a v-if="publication.license && publication.abstract"
                               style="font-size: 1rem; float: left;"
                               target="_blank" :href="publication.license"><i
                                    style="font-size: 0.8em; margin-right: 0.3em"
                                    class="pi pi-external-link"></i>License</a>
                        </div>

                        <div>
                            <a class="source" target="_blank" :href="realUrl">
                                <i class="pi pi-external-link" style="font-size: 0.8em; margin-right: 0.3em"></i>
                                go to source
                            </a>
                        </div>
                    </div>

                    <div class="metatdata">
                        <table class="info">
                            <tr>
                                <td><h4>DOI:</h4></td>
                                <td class="doi">{{ publication.doi }}</td>
                            </tr>
                            <tr>
                                <td><h4>Date:</h4></td>
                                <td>{{ !!publication.pub_date ? dateFormat(publication.pub_date) : publication.year }}
                                </td>
                            </tr>
                            <tr>
                                <td><h4>Type:</h4></td>
                                <td>{{ typeString(publication.type) }}</td>
                            </tr>
                            <tr>
                                <td><h4>Publisher:</h4></td>
                                <td>{{ publication.publisher }}</td>
                            </tr>
                            <tr>
                                <td><h4>Citation Count:</h4></td>
                                <td>{{ publication.citation_count }}</td>
                            </tr>
                        </table>

                        <h4 v-if="publication.fields_of_study && publication.fields_of_study.length > 0">Fields of
                            Study:</h4>
                        <ul class="subjects">
                            <li v-for="subject in publication.fields_of_study" v-bind:key="subject.name">
                                <router-link :to="{ name: 'fieldOfStudy', params: { id: subject.id }}"
                                             class="source-link">
                                    {{ subject.name }}
                                </router-link>
                            </li>
                        </ul>


                        <h4>Meta Data Sources:</h4>
                        <ul class="sources">
                            <li v-for="subject in publication.sources" v-bind:key="subject.title"
                                v-bind:class="{ hidden: subject.title === 'DB' }">
                                <a class="source-link" target="_blank" :href="subject.title === 'Meta' ?
                                    realUrl : subject.url"><i
                                        style="font-size: 0.8em; margin-right: 0.3em"
                                        class="pi pi-external-link"></i>{{ subject.title === 'Amba' ?
                                    'Ambalytics' : subject.title }}</a>
                            </li>
                        </ul>
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


        <div class="p-col-12 p-md-6 p-lg-6 p-xl-3">
            <Card class="stats">
                <template #title>
                    Stats
                </template>
                <template #content>
                    <div class="padding-left">
                        <h3>
                            <time-tooltip/>
                            Trending Rank
                        </h3>
                        <p class="padding-left">{{ localeNumber(trendingRank)}}</p>
                    </div>
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


        <div class="p-col-12 p-md-12 p-lg-6 p-xl-6 word-wrapper">
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

        <div class="p-col-12 p-md-12 p-lg-6 p-xl-6">
            <Card>
                <template #title>
                    Newest Tweet
                </template>
                <template #content>
                    <AmbaTweet :doi_in="$route.params.p">
                    </AmbaTweet>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-12 p-lg-6 p-xl-6">
            <Card class="big-chart">
                <template #title>
                    Publication by Twitter Activity over Time
                </template>
                <template #content>
                    <Dropdown v-model="selectedPubField" :options="pubFields" optionLabel="label"
                              optionValue="value" placeholder="Select a Field" @change="loadPubProgress"/>
                    <br>
                    <publication-chart v-if="renderPublicationChart" :height="600" title=" " :dateFormat="true"
                                       :rawData="pubOverTimeData"
                                       type="line"></publication-chart>
                    <div v-else class="no-data">
                        - no data available -
                    </div>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-6 p-lg-3 p-xl-3">
            <Card>
                <template #title>
                    Top Twitter Entities
                </template>
                <template #content>
                    <publication-chart :rawData="topValues['entity']"></publication-chart>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-6 p-lg-3 p-xl-3">
            <Card>
                <template #title>
                    Tweet Types
                </template>
                <template #content>
                    <publication-chart :rawData="topValues['tweet_type']"></publication-chart>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-6 p-lg-3 p-xl-3">
            <Card>
                <template #title>
                    Top Hashtags
                </template>
                <template #content>
                    <publication-chart :rawData="topValues['hashtag']"></publication-chart>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-md-6 p-lg-3 p-xl-3">
            <Card>
                <template #title>
                    Top Languages
                </template>
                <template #content>
                    <publication-chart :rawData="topValues['lang']"></publication-chart>
                </template>
            </Card>
        </div>

    </div>

</template>

<script>

    import PublicationChart from "../components/PublicationChart";
    import PublicationService from "../services/PublicationService";
    import WordCloud from "../components/WordCloud";
    import MapChart from "../components/MapChart";
    import StatService from "../services/StatService";
    import AmbaTweet from "../components/AmbaTweet";
    import TimeTooltip from "../components/TimeTooltip";
    import LicenseCheck from "../helper/LicenseCheck";

    export default {
        name: 'Publication',
        components: {PublicationChart, WordCloud, MapChart, AmbaTweet, TimeTooltip},
        beforeRouteUpdate(to, from) {
            if (to.query.time !== from.query.time) {
                if (to.query.time !== undefined) {
                    this.duration = to.query.time;
                } else {
                    this.duration = 'currently';
                }
            }
            this.fetchData()
        },
        data: () => ({
            duration: 'currently',
            publication: {},
            countries: [],
            data: [],
            words: [],
            renderCloud: false,
            renderMap: false,
            tweetCount: '-',
            score: '-',
            totalFollowers: '-',
            sentiment: '-',
            containsAbstract: '-',
            questions: '-',
            exclamations: '-',
            totalTweetCount: '-',
            topValues: [],
            profileData: [],
            pubOverTimeData: [],
            renderPublicationChart: true,
            selectedPubField: 'score',
            trendingRank: '-',
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
        }), created() {
            if (this.$route.query.time !== undefined) {
                this.duration = this.$route.query.time;
            }
            this.fetchData()
        },
        computed: {
            realUrl: function () {
                return 'http://' + this.publication.url
            }
        },
        methods: {
            localeNumber: function (x) {
                if (isNaN(x)) return '-';
                return x.toLocaleString();
            },
            hover(e) {
                if (!e) {
                    console.log(e)
                }
            },
            loadPubProgress() {
                StatService.progressValue(this.selectedPubField, 5, this.duration, this.$route.params.p)
                    .then(response => {
                        this.pubOverTimeData = response.data.results;
                        this.renderPublicationChart = true;
                    })
                    .catch(e => {
                        this.renderPublicationChart = false;
                        this.pubOverTimeData = [];
                        console.log(e);
                    });
            },
            loadStats() {
                StatService.numbers(this.duration, null, this.$route.params.p)
                    .then(response => {
                        this.tweetCount = response.data.results['count'];
                        this.totalFollowers = response.data.results['followers'];
                        this.score = response.data.results['score'];
                        this.containsAbstract = response.data.results['contains_abstract_raw'];
                        this.sentiment = response.data.results['sentiment_raw'];
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
                PublicationService.get(this.$route.params.p, this.duration)
                    .then(response => {
                        this.publication = response.data.results['publication'][0];
                        document.title = this.publication.title;
                        this.publication['authors'] = response.data.results['authors'];
                        this.publication['fields_of_study'] = response.data.results['fields_of_study'];
                        this.publication['sources'] = response.data.results['sources'];
                        this.publication.url = 'doi.org/' + this.publication['doi'];
                        this.trendingRank = response.data.results['trending_ranking'];

                        if (!LicenseCheck.showLicense(this.publication.license)) {
                            this.publication.abstract = false;
                            this.publication.license = false;
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    });
                this.loadPubProgress();
                this.loadStats();
                this.loadTweetCount();

                StatService.top(null, this.$route.params.p)
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

                StatService.top(['location'], this.$route.params.p, 1000)
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


                StatService.percentages(null, this.$route.params.p)
                    .then(response => {
                        this.topValues = response.data.results;
                        this.render = true;
                    })
                    .catch(e => {
                        console.log(e);
                    });

                StatService.profileData(this.$route.params.p, this.duration)
                    .then(response => {
                        this.profileData = [response.data.results];
                    })
                    .catch(e => {
                        console.log(e);
                        this.profileData = ['ds']
                    });
            },
            typeString: function (type) {
                if (type) {
                    let s = type.replace('_', ' ').toLowerCase().split(' ');
                    for (let i = 0; i < s.length; i++) {
                        s[i] = s[i].charAt(0).toUpperCase() + s[i].substring(1);
                    }
                    return s.join(' ');
                }
            },
            dateFormat: function (date) {
                if (date) {
                    date = new Date(date);
                    return date.toLocaleDateString();
                }
            },
        }
    }
</script>

<style lang="scss">
    @import '../assets/_theme.scss'; // copied from '~primevue/resources/themes/nova/theme.css'

    a.doi, a.source {
        float: right;
        color: $color-main;
        text-decoration: none;

        &:hover {
            color: black;
        }
    }

    .publication_info_main {
        .p-card {
            border: 2px solid $color-main;
        }

        .p-card-content {
            display: flex;
            justify-content: space-between;


            .content {
                width: 50%;
            }

            .metatdata {
                width: calc(50% - 3em);

                table h4 {
                    margin: 0.4em 0 0.3em 2px !important;
                }

                tr > td {
                    text-align: left !important;
                }

                h4 {
                    margin: 0.4em 0 0.3em 2px;

                    &:last-of-type {
                        margin-top: 1em;
                    }
                }

                ul {
                    margin: 0;
                    list-style-type: none;
                }

                li {
                    padding: 0.2em 0;
                }
            }

            .abstract {
                max-height: 400px;
                overflow-y: auto;
                text-align: justify;
                padding-right: 10px;
                margin: 1em 0;
            }

            .info {
                padding: 0;
                margin: 0;
                width: 100%;

                td {
                    padding: 0;
                    word-break: break-word;
                }

                h4 {
                    margin: 0.4em 0 0.3em 0;
                }
            }

            .authors {
                font-style: italic;
            }

            .doi {
                font-family: "Courier New", monospace !important;
            }
        }
    }

</style>
