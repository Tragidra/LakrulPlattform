Publications.vue
<template>
    <div class="p-col-12 p-md-12 p-lg-12 p-xl-12">
        <Card class="table-card">
            <template #title>
                <time-tooltip/>
                Trending Fields of Study
            </template>
            <template #content>
                <div class="p-input-icon-left">
                    <i class="pi pi-search" @click="fetchData"/>
                    <InputText v-model="searchWord" placeholder="Name Search" @keydown="search"/>
                </div>
                <DataTable :value="data" dataKey="doi" :paginator="true" :rows="this.lazyParams.rows" :rowHover="true"
                           :lazy="true"
                           :loading="loading" :rowsPerPageOptions="[10, 20, 50]" :sort-order="-1"
                           :totalRecords="totalRecords" class="big-table"
                           @page="onPage($event)" @sort="onSort($event)" ref="dt" sort-field="score"
                           @row-click="rowClick($event)">
                    <template #empty>
                        No Fields of Study found.
                    </template>
                    <template #loading>
                        Loading Fields of Study data. Please wait.
                    </template>
                    <Column v-for="col of columns" :field="col.field" :header="col.header" :sortable="col.sortable"
                            :key="col.field" :class="col.class">
                        <template #header>
                            <div v-if="col.help" :class="col.classHelp">
                                <i v-tooltip="col.help" class="pi pi-fw pi-question-circle"></i>
                            </div>
                        </template>
                        <template v-if="col.numberTemplate" #body="slotProps">
                            <div class="wrapper">{{ col.noLocale ? slotProps.data[col.field] :
                                localeNumber(slotProps.data[col.field]) }}
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </template>
        </Card>
    </div>
</template>

<script>
    import FieldOfStudyService from "../services/FieldOfStudyService";
    import TimeTooltip from "../components/TimeTooltip";

    export default {
        name: 'FieldsOfStudy',
        components: {TimeTooltip},
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
                columns: [
                    {
                        field: 'trending_ranking',
                        header: 'Rank',
                        sortable: false,
                        numberTemplate: false,
                        class: "amba rank"
                    },
                    {field: 'name', header: 'Name', sortable: false, numberTemplate: false},
                    {
                        field: 'pub_count',
                        header: 'Publication Count',
                        sortable: true,
                        class: "text-align-right",
                        numberTemplate: true
                    },
                    {
                        field: 'score',
                        header: 'Score',
                        sortable: true,
                        class: "text-align-right amba prio1",
                        numberTemplate: true
                    },
                    {
                        field: 'trending',
                        header: 'Theil–Sen estimator',
                        sortable: true,
                        class: "text-align-right amba prio1",
                        numberTemplate: true,
                        help: 'Theil–Sen estimator, slope of the mann kendall yue wang modification trending calculation'
                    },
                    {
                        field: 'count',
                        header: 'Tweet Count',
                        sortable: true,
                        class: "text-align-right  amba prio1",
                        numberTemplate: true,
                        help: false
                    },
                    {
                        field: 'sum_followers',
                        header: 'Followers reached',
                        sortable: true,
                        class: "text-align-right wider amba prio2",
                        numberTemplate: true,
                        help: false
                    },
                    {
                        field: 'mean_sentiment',
                        header: 'Mean Sentiment',
                        sortable: true,
                        class: "text-align-right amba prio2",
                        numberTemplate: true,
                        help: false
                    },
                    {
                        field: 'abstract_difference',
                        header: 'Abstract Similarity',
                        sortable: true,
                        class: "text-align-right amba prio2",
                        numberTemplate: true,
                        help: false
                    },
                    {
                        field: 'mean_age',
                        header: 'Mean Age',
                        sortable: true,
                        class: "text-align-right amba prio2",
                        numberTemplate: true,
                        help: 'in hours'
                    },
                    {
                        field: 'projected_change',
                        header: 'Projected Change',
                        sortable: true,
                        class: "text-align-right amba prio2",
                        numberTemplate: true,
                        help: 'the expected score change to the next window using Holt-Winters forecasting',
                        classHelp: 'negative-margin-left'
                    },
                    {
                        field: 'mean_bot_rating',
                        header: 'Mean Bot Rating',
                        sortable: true,
                        class: "text-align-right amba prio2",
                        numberTemplate: true,
                        help: 'Higher values means less bots, a score of 10 means no detected bots.'
                    },

                    {
                        field: 'ema',
                        header: 'EMA',
                        sortable: true,
                        class: "text-align-right amba prio3",
                        numberTemplate: true,
                        help: 'Exponential Moving Average'
                    },
                    {
                        field: 'kama',
                        header: 'KAMA',
                        sortable: true,
                        class: "text-align-right amba prio3",
                        numberTemplate: true,
                        help: 'Kaufman’s Adaptive Moving Average'
                    },
                    {
                        field: 'ker',
                        header: 'KER',
                        sortable: true,
                        class: "text-align-right amba prio3",
                        numberTemplate: true,
                        help: 'Kaufman’s Efficiency Ratio'
                    },
                    {
                        field: 'mean_score',
                        header: 'Mean Score',
                        sortable: true,
                        class: "text-align-right amba prio3",
                        numberTemplate: true
                    },
                    {
                        field: 'stddev',
                        header: 'SD',
                        sortable: true,
                        class: "text-align-right amba prio3",
                        numberTemplate: true,
                        help: 'Standard Deviation of the scores'
                    },
                    {
                        field: 'mean_length',
                        header: 'Mean Length',
                        sortable: true,
                        class: "text-align-right amba prio4",
                        numberTemplate: true,
                        help: false
                    },
                    {
                        field: 'mean_questions',
                        header: 'Mean "?"',
                        sortable: true,
                        class: "text-align-right amba prio4",
                        numberTemplate: true,
                        help: false
                    },
                    {
                        field: 'mean_exclamations',
                        header: 'Mean "!"',
                        sortable: true,
                        class: "text-align-right amba prio4",
                        numberTemplate: true,
                        help: false
                    },
                ],
                lazyParams: {},
                data: [],
                loading: true,
                searchWord: '',
                totalRecords: 0,
            }
        },
        created() {
            document.title = "Trending fields of study";
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
        },
        methods: {
            search(e) {
                if (e.keyCode === 13) {
                    this.fetchData();
                }
            },
            onPage(event) {
                this.lazyParams = event;
                this.fetchData();
            },
            onSort(event) {
                this.lazyParams = event;
                this.fetchData();
            },
            rowClick(event) {
                this.$router.push('/fieldOfStudy/' + event.data.id)
            },
            localeNumber: function (x) {
                if (isNaN(x)) return '-';
                return x.toLocaleString();
            },
            fetchData() {
                this.error = this.post = null;
                this.loading = true;
                FieldOfStudyService.trending(this.duration, this.lazyParams.first, this.lazyParams.rows, this.lazyParams.sortField, this.lazyParams.sortOrder > 0 ? 'asc' : 'desc', this.searchWord)
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
                            this.totalRecords = element.total_count;
                        });
                        this.loading = false
                    })
                    .catch(e => {
                        this.data = [];
                        this.loading = false;
                        console.log(e);
                    });
            },
        }
    }
</script>