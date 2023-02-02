<template>
    <div class="help-text" v-if="openPublication">
        <router-link :to="currentPublication">{{ openPublicationText }}</router-link>
    </div>
    <Chart v-if="loaded" :type="type" :data="chartData" :options="options" :height="height"/>
    <div v-else class="no-data">
        - no data available -
    </div>
</template>

<script>
    import chroma from 'chroma-js';

    export default {
        name: 'PublicationChart',
        props: {
            type: {
                type: String,
                default: "doughnut"
            },
            id: {
                type: String,
                default: null
            },
            rawData: {
                type: Array,
                default: null
            },
            dateFormat: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: 'unknown'
            },
            growingData: {
                type: Boolean,
                default: false
            },
            height: {
                type: Number,
                default: 150
            },
            showOthers: {
                type: Boolean,
                default: true
            },
        },
        data: () => ({
            loaded: false,
            chartData: null,
            openPublication: false,
            openPublicationText: 'click to open publication',
            currentPublication: '/publications'
        }),
        mounted() {
            this.options = {
                responsive: true,
                aspectRatio: 0.6,
                normalized: true,
                animation: false,
            };

            if (this.type === "line") {
                this.options = {
                    responsive: true,
                    maintainAspectRatio: false,
                    normalized: true,
                    animation: false,
                    spanGaps: true,
                    hover: {
                        mode: 'dataset'
                    },
                    scales: {
                        x: {
                            ticks: {
                                callback: function (value) {
                                    let options = {
                                        year: '2-digit',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    };
                                    return new Date(this.getLabelForValue(value)).toLocaleTimeString('de-DE', options);
                                }
                            }
                        }
                    },
                    plugins: {
                        events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                        legend: {
                            onClick: (evt, item, legend) => {
                                const chart = legend.chart;
                                if (chart.getDatasetMeta(item.datasetIndex).data[0].options.radius === 2) {
                                    this.$router.push('/publication/' + item.text);
                                }

                                chart.setActiveElements([{
                                    datasetIndex: item.datasetIndex,
                                    index: 0
                                }]);

                                this.openPublication = true;
                                let title = chart.getDatasetMeta(item.datasetIndex)._dataset.title;
                                if (title.length > 80) {
                                    title = title.replace(/^(.{70}[^\s]*).*/, "$1") + '...';
                                }
                                this.openPublicationText = 'click to open publication: ' + title;
                                this.currentPublication = '/publication/' + item.text;
                                chart.render();
                            },
                        },
                        tooltip: {
                            callbacks: {
                                title: function (o) {
                                    let options = {
                                        year: '2-digit',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    };
                                    return new Date(parseInt(o[0].label)).toLocaleTimeString('de-DE', options);
                                },
                                beforeLabel: function (context) {
                                    return context.dataset.title;
                                }
                            }
                        },
                    }
                }
            }

            if (this.type === "radar") {
                this.options = {
                    responsive: true,
                    animation: false,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#495057'
                            }
                        }
                    },
                    scales: {
                        r: {
                            pointLabels: {
                                color: '#495057',
                            },
                            grid: {
                                color: '#ebedef',
                            },
                            angleLines: {
                                color: ['#0F6364', '#67002E', '#67002E', '#E6B24B', '#E6B24B', '#E6B24B', '#E6B24B', '#E6B24B'],
                                lineWidth: 2
                            }
                        }
                    },
                    normalized: true,
                }
            }
        }
        ,
        methods: {
            mapProfileRange: function (number, minIn, maxIn, minOut, maxOut) {
                if (number > maxIn) {
                    maxIn = number;
                }
                let r = (number - minIn) * (maxOut - minOut) / (maxIn - minIn) + minOut;
                return r;
            }
        }
        ,
        watch: {
            rawData: function (val) {
                let data = [];
                let label = [];
                let rest = 0;
                let total = 0;

                this.loaded = false;

                if ((val && (val.length > 0) || this.type === "radar")) {
                    if (this.type === "radar") {
                        val = val[0];
                        if (val['publication']['mean_score'] != null) {
                            let data_this = [
                                this.mapProfileRange(val['publication']['mean_score'], val['min']['mean_score'], val['max']['mean_score'], 0, 100),
                                this.mapProfileRange(val['publication']['mean_bot_rating'], val['min']['mean_bot_rating'], val['max']['mean_bot_rating'], 0, 100),
                                this.mapProfileRange(val['publication']['sum_followers'], val['min']['sum_followers'], val['max']['sum_followers'], 0, 100),
                                this.mapProfileRange(val['publication']['mean_sentiment'], val['min']['mean_sentiment'], val['max']['mean_sentiment'], 0, 100),
                                this.mapProfileRange(val['publication']['abstract_difference'], val['min']['abstract_difference'], val['max']['abstract_difference'], 0, 100),
                                this.mapProfileRange(val['publication']['mean_questions'], val['min']['mean_questions'], val['max']['mean_questions'], 0, 100),
                                this.mapProfileRange(val['publication']['mean_exclamations'], val['min']['mean_exclamations'], val['max']['mean_exclamations'], 0, 100),
                                this.mapProfileRange(val['publication']['mean_length'], val['min']['mean_length'], val['max']['mean_length'], 0, 100),
                            ];
                            let data_avg = [
                                this.mapProfileRange(val['avg']['mean_score'], val['min']['mean_score'], val['max']['mean_score'], 0, 100),
                                this.mapProfileRange(val['avg']['mean_bot_rating'], val['min']['mean_bot_rating'], val['max']['mean_bot_rating'], 0, 100),
                                this.mapProfileRange(val['avg']['sum_followers'], val['min']['sum_followers'], val['max']['sum_followers'], 0, 100),
                                this.mapProfileRange(val['avg']['mean_sentiment'], val['min']['mean_sentiment'], val['max']['mean_sentiment'], 0, 100),
                                this.mapProfileRange(val['avg']['abstract_difference'], val['min']['abstract_difference'], val['max']['abstract_difference'], 0, 100),
                                this.mapProfileRange(val['avg']['mean_questions'], val['min']['mean_questions'], val['max']['mean_questions'], 0, 100),
                                this.mapProfileRange(val['avg']['mean_exclamations'], val['min']['mean_exclamations'], val['max']['mean_exclamations'], 0, 100),
                                this.mapProfileRange(val['avg']['mean_length'], val['min']['mean_length'], val['max']['mean_length'], 0, 100),
                            ];


                            this.loaded = true;
                            this.chartData = {
                                labels: ['Mean Score', 'Mean Bot Rating', 'Sum Follower', 'Mean Sentiment', 'Mean Abstract Similarity', 'Mean Questions', 'Mean Exclamations', 'Mean Length'],
                                datasets: [
                                    {
                                        label: 'average Publication',
                                        backgroundColor: 'rgba(179,181,198,0.2)',
                                        borderColor: 'rgba(179,181,198,1)',
                                        pointBackgroundColor: 'rgba(179,181,198,1)',
                                        pointBorderColor: '#fff',
                                        pointHoverBackgroundColor: '#fff',
                                        pointHoverBorderColor: 'rgba(179,181,198,1)',
                                        data: data_avg
                                    },
                                    {
                                        label: (typeof val['publication']['doi'] === 'string' || val['publication']['doi'] instanceof String) ? val['publication']['doi'] : val['publication']['doi']['name'],
                                        backgroundColor: 'rgba(15,99,100,0.2)',
                                        borderColor: 'rgba(15,99,100,1)',
                                        pointBackgroundColor: 'rgba(15,99,100,1)',
                                        pointBorderColor: '#fff',
                                        pointHoverBackgroundColor: '#fff',
                                        pointHoverBorderColor: 'rgba(15,99,100,1)',
                                        data: data_this
                                    }
                                ]
                            };

                        }
                    } else if (this.type === "doughnut") {
                        val.forEach(e => {
                            if (e.value !== "total") {

                                if (e.count) {
                                    total += e.count;
                                } else if (e.total) {
                                    total += e.total
                                }

                                if (e.count) {
                                    data.push(e.count);
                                } else if (e.total) {
                                    data.push(e.total);
                                }

                                label.push(e.value);
                            } else {
                                if (e.count) {
                                    rest = e.count;
                                } else if (e.total) {
                                    rest = e.total;
                                }
                            }

                        });

                        if (rest > 0 && rest - total > 0 && this.showOthers) {
                            data.push(rest - total);
                            label.push('Others');
                        }

                        let colors = [];
                        let c = chroma.scale(['#0F6364', '#67002E', '#E6B24B']);
                        for (let i = 0; i < data.length; i++) {
                            colors.push(c(i / (data.length - 1)).hex())
                        }

                        let dt = [{
                            label: this.title,
                            backgroundColor: colors,
                            borderColor: '#555',
                            borderWidth: 3,
                            hoverOffset: -15,
                            data: data,
                        }];

                        this.loaded = true;
                        this.chartData = {
                            labels: label,
                            datasets: dt
                        };
                    } else {
                        // line chart
                        let label = [];
                        let dt = [];

                        let colors = [];
                        let colorPallet = ['#E6B24B', '#67002E', '#0F6364'];
                        if (val.length === 1) {
                            colors.push(colorPallet[2]);
                          // eslint-disable-next-line no-dupe-else-if
                        } else if (val.length === 1) {
                            colors.push(colorPallet[2]);
                        } else {
                            let c = chroma.scale(colorPallet);
                            for (let i = 0; i < val.length; i++) {
                                colors.push(c(i / (val.length - 1)).hex())
                            }
                        }

                        val.forEach((e, i) => {
                            // publication level
                            let data = [];

                            e.data.forEach(t => {
                                let date = new Date(t.time);
                                let dataLabel = date.getTime();

                                label.push(dataLabel);
                                data.push({
                                    x: dataLabel,
                                    y: t.value
                                });
                            });

                            dt.push({
                                label: e.doi,
                                title: e.title,
                                backgroundColor: colors[i] + "30",
                                hoverBackgroundColor: colors[i] + "AA",
                                borderColor: colors[i],
                                fill: true,
                                borderWidth: 3,
                                hoverBorderWidth: 5,
                                data: data,
                                pointRadius: 0.7,
                                pointHoverRadius: 2,
                                pointHoverBorderWidth: 3,
                                order: colors.length - 1 - i,
                                tension: 0.2,
                            });
                        });

                        // remove duplicates and sort
                        let set = new Set(label);
                        label = Array.from(set);
                        label.sort();

                        this.loaded = true;
                        this.chartData = {
                            labels: label,
                            datasets: dt
                        };
                    }
                } else {
                    this.loaded = false;
                }
            }
        }
    }
</script>
