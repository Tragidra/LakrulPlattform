<template>
    <Card class="trending-items-card">
        <template #title>
            <time-tooltip/>
            Задачи в процессе оптимизации
        </template>
        <template #content>
            <div v-for="item in trendingItems" :key="item.label" class="trending-items">
                <router-link v-if="item.path" :to="item.path"><h4><i style="margin-right: 5px;" :class="item.icon"></i>{{ item.label }}</h4></router-link>
                <DataTable :value="item.data" :autoLayout="true" @row-click="rowClick($event, item.label)">
                    <Column class="amba rank" field="trending_ranking" header="Rank"></Column>
                    <Column v-if="item.label === 'Publications'" field="title" header="Title"></Column>
                    <Column v-if="item.label !== 'Publications'" field="name" header="Name"></Column>
                </DataTable>
            </div>
        </template>
    </Card>
</template>

<script>
    import TimeTooltip from "./TimeTooltip.vue";

    export default {
        name: "TrendingOverview",
        components: {TimeTooltip},
        props: {
            trendingItems: {
                type: Array,
                required: true,
                default() {
                    return [
                        {label: 'Publications', data: [], icon: 'pi pi-fw pi-book', path: '/publications'},
                        {label: 'Authors', data: [], icon: 'pi pi-fw pi-user', path: '/authors'},
                        {label: 'Fields of Study', data: [], icon: 'pi pi-fw pi-sitemap', path: '/fieldsOfStudy'},
                    ]
                }
            },
        },
        methods: {
            rowClick(event, extra) {
                if (event.data.doi) {
                    this.$router.push('/publication/' + event.data.doi)
                } else if (event.data.id) {
                    if (extra === "Authors") {
                        this.$router.push('/author/' + event.data.id)
                    } else {
                        this.$router.push('/fieldOfStudy/' + event.data.id)
                    }
                }
            },
        }
    }
</script>


<style lang="scss">
    @import '../assets/_theme.scss'; // copied from '~primevue/resources/themes/nova/theme.css'

    .trending-items {
        margin-top: -2em;
        position: relative;

        &:last-of-type {
            margin-bottom: -4em;
        }
        h4 {
            color: $color-main;
            right: 0;
            top: 0;
            position: absolute;
            z-index: 2;
        }

        .p-datatable {
            padding: 1.3em 0 2em;
            width: 100%;
            font-size: 0.9em;
        }

        .p-datatable .p-datatable-tbody > tr {
            cursor: pointer;

            &:hover {
                background: rgba($color-main, 0.2);
            }

            td {
                line-height: 1.1em;
                padding: 0.5em !important;
            }
        }

        .p-datatable .p-datatable-thead > tr > th {
            padding: 0.5em;

            &.rank > div {
                display: flex;
                justify-content: center;
            }
        }
    }


    @media screen and (max-width: 960px) {
        td.amba.rank {
            font-size: 1rem !important;

            span {
                font-size: 1rem;
            }
        }

        .trending-items {
            margin-top: -1.5em;

            h4 {
                color: $color-main;
                margin: 0 0.3em 0 0;
                float: right;
                padding-bottom: 0.2em;
                z-index: 2;
                position: relative;
            }

            .p-datatable {
                margin: 0 0 3em 0;
                float: none;
                width: 100%;
                font-size: 0.9em;
            }
        }
    }
</style>
