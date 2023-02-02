<template>
    <div class="p-col-12 p-md-12 p-lg-12 p-xl-12">
        <Card class="table-card big-chart">
            <template #title>
                <time-tooltip/>
                Trending Publications by Ambalytics Trends
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
    <div class="p-col-12 p-md-12 p-lg-12 p-xl-12">
        <Card class="table-card">
            <template #title>
                <time-tooltip/>
                Trending Publications
            </template>
            <template #content>
                <TrendingPublicationsTable :value="data" :lazyParams="lazyParams" :loading="loading" :totalRecords="totalRecords"
                                           @page="onPage($event)" @sort="onPage($event)" @search="onSearch($event)">
                </TrendingPublicationsTable>
            </template>
        </Card>
    </div>
</template>

<script>
    // top publications
    import PublicationService from "../services/PublicationService.js";
    import TimeTooltip from "../components/TimeTooltip.vue";
    import PublicationChart from "../components/PublicationChart.vue";
    import StatService from "../services/StatService.js";
    import TrendingPublicationsTable from "../components/TrendingPublicationsTable.vue";

    export default {
        name: 'Publications',
        components: {PublicationChart, TimeTooltip, TrendingPublicationsTable},
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
                trendOverTimeData: [],
                lazyParams: {},
                totalRecords: 0,
                data: [],
                loading: true,
                searchWord: '',
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
                dois: []
            }
        },
        created() {
            document.title = "Trending publications";
            if (this.$route.query.time !== undefined) {
                this.duration = this.$route.query.time;
            }
            this.fetchData();
        },
        mounted() {
            this.lazyParams = {
                    first: 0,
                    rows: 10,
                    sortField: 'score',
                    sortOrder: -1,
                };
            this.timer = setInterval(this.fetchData, 180000);
        },
        methods: {
            onPage(event) {
                this.lazyParams = event;
                this.fetchData();
            },
            onSearch(word) {
                this.searchWord = word;
                this.fetchData();
            },
            loadTrendingProgress() {
                StatService.progressTrending(this.selectedTrendField, this.lazyParams.rows, this.duration, this.dois)
                    .then(response => {
                        this.trendOverTimeData = response.data.results;
                    })
                    .catch(e => {
                        this.trendOverTimeData = [];
                        console.log(e);
                    });
            },
            fetchData() {
                this.error = this.post = null;
                this.loading = true;
                PublicationService.trending(this.duration, this.lazyParams.first, this.lazyParams.rows, this.lazyParams.sortField, this.lazyParams.sortOrder > 0 ? 'asc' : 'desc', this.searchWord)
                    .then(response => {
                        this.data = response.data.results;
                        let dois = [];
                        this.data.forEach(element => {
                            dois.push(element.doi);
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
                        this.dois = dois;
                        this.loading = false;
                        this.loadTrendingProgress();
                    })
                    .catch(e => {
                        this.data = [];
                        this.loading = false;
                        console.log(e);
                    });
            },
        },
        beforeUnmount() {
            clearInterval(this.timer);
        }
    }
</script>