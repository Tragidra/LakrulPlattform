<template>
    <div>
        <div class="p-input-icon-left">
            <i class="pi pi-search" @click="search"/>
            <InputText v-model="searchWord" placeholder="Title Search" @keydown="search"/>
        </div>
        <DataTable :value="value" dataKey="doi" :paginator="true" :rows="lazyParams.rows" :rowHover="true"
                   :lazy="true"
                   :loading="loading" :rowsPerPageOptions="[5, 10, 20]" :sort-order="-1"
                   :totalRecords="totalRecords" class="big-table"
                   @page="onPage($event)" @sort="onSort($event)" ref="dt" sort-field="score"
                   @row-click="rowClick($event)">
            <template #empty>
                No Publications found.
            </template>
            <template #loading>
                Loading Publications data. Please wait.
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
    </div>
</template>

<script>
    export default {
        name: "TrendingPublicationTable",
        props: {
            value: {
                type: Array,
                required: true
            },
            lazyParams: {
                type: Object,
                required: true
            },
            loading: {
                type: Boolean,
                required: true
            },
            totalRecords: {
                type: Number,
                required: true
            },
        },
        methods: {
            onPage(event) {
                this.$emit('page', event);
            },
            onSort(event) {
                this.$emit('sort', event);
            },
            search(e) {
                // search on enter key
                if (e.keyCode === 13) {
                    this.$emit('search', this.searchWord);
                }
            },
            rowClick(event) {
                // open publication page
                this.$router.push('/publication/' + event.data.doi)
            },
            localeNumber: function (x) {
                // round and transform to localized number or '-'
                if (isNaN(x)) return '-';
                x = Math.round(x * 100) / 100;
                return x.toLocaleString();
            },
        },
        data() {
            return {
                searchWord: '',
                columns: [
                    {
                        field: 'trending_ranking',
                        header: 'Rank',
                        sortable: false,
                        numberTemplate: false,
                        class: "amba rank prio1",
                        help: false
                    },
                    {field: 'title', header: 'Title', sortable: false, numberTemplate: false, class: "prio1"},
                    {
                        field: 'pub_date',
                        header: 'Date',
                        sortable: true,
                        numberTemplate: true,
                        noLocale: true,
                        class: "prio1"
                    },
                    {
                        field: 'citation_count',
                        header: 'Citation Count',
                        sortable: true,
                        class: "text-align-right prio1",
                        numberTemplate: true,
                        help: false
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
            }
        },
    }
</script>


<style lang="scss">
    @import '../assets/_theme.scss'; // copied from '~primevue/resources/themes/nova/theme.css'
</style>