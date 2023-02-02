<template>

  <div class="layout-topbar p-d-flex p-shadow-3  p-jc-between  p-ai-center">
    <div class="logo-link">
      <router-link to="/" class="logo p-d-flex p-ai-center">
        <img alt="logo" src="./assets/lakrul.png">
      </router-link>
    </div>

    <div class="time-selection">
      <time-tooltip :text="'Here you can choose yout time selection.'"/>
      <Dropdown v-model="selectedTime" :options="dataTimeOptions" optionLabel="label" @change="changeDuration  ">
      </Dropdown>
    </div>

    <div class="header-text">Рабочее пространство с <span class="header-text-trends">LaKrul</span></div>
    <Menubar :model="items">
      <template #item="{item}">
        <router-link v-if="item.show" :to="item.to" class="p-d-flex p-ai-center p-menuitem-link">
          <span class="p-menuitem-text">{{item.label}}</span>
        </router-link>
      </template>
    </Menubar>
  </div>

  <div class="layout-content">
    <router-view/>
  </div>

  <div class="bottom-1 right-2 w-full flex justify-end" style="padding: 0 1rem 1rem 0;">
    <div class="text-xs font-light text-gray-800">
      <a href="https://ambalytics.com/privacy-policy" target="_blank">Privacy Policy</a> | <a
        href="https://ambalytics.com/imprint" target="_blank">Imprint</a>
    </div>
  </div>
</template>


<script>

import TimeTooltip from "./components/TimeTooltip.vue";

export default {
  components: {TimeTooltip},
  created() {
    document.title = "Рабочее пространство с LaKrul";

    this.$router.isReady().then(() => {
      if (this.$route.query.time !== undefined) {
        this.dataTimeOptions.forEach((e) => {
          if (e.duration + "" === this.$route.query.time) {
            this.selectedTime = e;
          }
        });
      } else {
        this.selectedTime = this.dataTimeOptions[0];
      }
    });

    this.$router.options.routes.forEach(route => {
      this.items.push({
        label: route.label,
        to: route.path,
        show: route.show
      });
    });
  },
  data: () => ({
    items: [],
    dataTimeOptions: [{
      label: 'Запуск (6h)',
      duration: 'currently'
    }, {
      label: 'Today (24h)',
      duration: 'today'
    }, {
      label: 'Week (7d)',
      duration: 'week',
    }, {
      label: 'Month (30d)',
      duration: 'month',
    }, {
      label: 'Year (365d)',
      duration: 'year',
    }],
    selectedTime: null,
  })
  ,
  methods: {
    changeDuration() {
      this.$router.push({path: this.$route.path, query: {time: this.selectedTime.duration}});
    }
  }
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet">
<style lang="scss">
@import './assets/_theme.scss'; // copied from '~primevue/resources/themes/nova/theme.css'

.p-datatable.p-datatable-hoverable-rows .p-datatable-tbody > tr:not(.p-highlight):hover {
  background: rgba($color-main, 0.2) !important;
  cursor: pointer;
}

.p-datatable.big-table {
  th:nth-child(1), td:nth-child(1) {
    width: 50px;
  }

  th:nth-child(2), td:nth-child(2) {
    width: 350px !important;
  }
}

table.p-datatable-table {
  .p-datatable-tbody > tr > td {
    padding: 0.6em;

    &.rank {
      width: 40px;
      text-align: center;
      font-size: 1.5em;
      font-weight: bold;
    }
  }

  td > .wrapper {
    font-size: 0.9em;
    text-align: right;
    display: inline-block;
    min-width: 100%;
    font-weight: 700;
    font-family: 'Courier New', monospace !important;
    padding: 0.5em 2em 0.5em 0.5em !important
  }

  th {
    font-size: 0.85em;
    padding: 0.9em !important;
  }

  th.text-align-right > .p-column-header-content > span.p-column-title {
    display: inline-block !important;
    width: 100% !important;
    text-align: center !important;
  }

  th.amba > .p-column-header-content > span.p-column-title {
    color: darken($color-main, 0.5) !important;
  }

  th.text-align-right {
    text-align: center;
  }

  .p-column-header-content > span.p-column-title {
    font-weight: 700;
  }

  .p-datatable-tbody > tr > td {
    text-align: left;
    border-bottom: none;
  }

  .p-datatable-tbody > tr:nth-child(odd) {
    background: rgba($color-main, 0.05)
  }

  .p-datatable-thead > tr > th {
    border-bottom: 1px solid #ccc;
  }
}

.p-input-icon-left, .p-input-icon-right {
  position: absolute !important;
  right: 0;
  top: -3em;

  input {
    width: 300px;
  }

  .pi-search {
    cursor: pointer;
  }
}

.table-card div.p-card-content {
  position: relative !important;
}

td.amba {
  color: $color-main;
  font-weight: bold;
  font-size: 1.05em;
}

.layout-topbar .p-menubar .p-menuitem .p-menuitem-link {
  background: white !important;
  box-shadow: inset 0 0 0 2px $color-main;
  margin-left: 5px;

  .p-menuitem-text {
    color: $color-main !important;
    font-weight: bold;
  }
}

.p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
  background: rgba($color-main, 0.8) !important;
  color: white !important;
}

.layout-topbar .p-menubar .p-menuitem .router-link-active {
  background: $color-main !important;

  .p-menuitem-text {
    color: white !important;
    font-weight: bold;
  }

}

.text-gray-800 {
  --tw-text-opacity: 1;
  color: rgba(31, 41, 55, var(--tw-text-opacity));
}

.font-light {
  font-weight: 300;
}

.text-xs {
  font-size: .75rem;
  line-height: 1rem;
}

a {
  color: inherit;
  text-decoration: inherit;
}

.p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-link:hover {
  background: rgba($color-main, 0.7) !important;

  .p-menuitem-text {
    color: white !important;
  }

}

.p-card-title {
  color: $color-main;
}


body {
  margin: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--surface-b);
  font-family: 'Lato', sans-serif;
  font-weight: 400;
  color: var(--text-color);
}

.layout-topbar {
  box-shadow: 0 0 4px rgba(0, 0, 0, .25);
  border-bottom: 1px solid var(--surface-d);
  background-color: var(--surface-a);
  height: 70px;
  padding: 0 10px;

  .p-menubar {
    height: 60px;
    border: none;

    .p-menuitem {
      .router-link-active {
        background: var(--surface-b);
        border-radius: 4px;
      }
    }
  }

  .logo-link {
    padding: 5px;

    a {
      padding: 5px;
      color: var(--text-color);
      text-decoration: none;

      &:hover {
        background: rgba($color-main, 0.7) !important;
        border-radius: 4px;
      }
    }


    img {
      height: 55px;
      width: 55px;
    }
  }

  div.header-text {
    color: $color-main;
    letter-spacing: -1px;
    font-family: 'Lato', sans-serif;
    font-size: 2em;

    .header-text-trends {
      font-size: 1.1em;
      /*font-style: italic;*/
      font-weight: bold;
    }
  }

}

.layout-content {
  padding: 1em;

  .p-card {
    padding: 1em;
  }
}

.word-wrapper {
  .p-card-body {
    height: 100%;

    .p-card-content {
      height: 100%;
    }

  }

  .wordCloud {
    transform-origin: left;
    display: flex;
    align-items: center;
    height: 100%;

    svg {
      overflow: visible;
    }
  }

}

.vue-map-legend {
  width: 185px;
  background: var(--surface-c);
  overflow: auto;
  border: 1px solid;
  position: absolute;

  .vue-map-legend-header {
    padding: 10px 15px;
    background: var(--surface-a);
  }

  .vue-map-legend-content {
    padding: 10px 15px;
    background: rgba($color-main, 0.3);
    border-top: 1px solid #acacad;
  }
}

.stats {

  .p-card-content {;
    display: grid;
    padding: 0 1vw;
    grid-template-columns: 90%;
    justify-content: center;
    align-items: center;
    align-content: center;

    div.padding-left {
      width: 100%;
      /*<!--border: 1px solid $color-main;-->*/
      border-radius: 5px;
      margin: 0.2em;
    }

    h3 {
      margin: 0.6em 0 0.2em 0.7em;
      font-size: 1em;
      width: 100%;
    }

    p.padding-left {
      margin: -5px 0 0 0;
      font-weight: 700;
      font-size: 2em;
      font-family: 'Courier New', monospace !important;
      text-align: end;
      width: 100%;
      color: $color-main;
    }
  }
}

.p-card {
  height: 100%;
}

.time-selection {
  display: flex;
  align-items: center;

  .p-dropdown-label {
    color: white;
    padding: 10px;
  }

  span.p-dropdown-trigger-icon.pi.pi-chevron-down {
    color: white;
  }

  div.p-dropdown {
    background: $color-main;
    font-weight: bold;
    border: 2px solid $color-main;
  }

  .pi-clock {
    font-size: 1.4em;
    color: $color-main !important;
  }
}


div.vue-world-map {
  margin-bottom: 20px;
}

.big-chart {
  height: 730px !important;

  .p-card-content, .p-card-body {
    height: 100%;
    color: #fff;
    position: relative;
  }

  .p-dropdown {
    position: absolute;
    right: 0;
    width: 150px;
    top: -40px;
  }
}

.no-data {
  height: 100%;
  width: 100%;
  color: darkgrey;
}

.special-scrollbar {

  &::-webkit-scrollbar {
    width: 8px !important;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #fff !important;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: $color-main !important;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: rgba($color-main, 0.7) !important;
  }
}

@-moz-document url-prefix('') {
  body {
    scrollbar-color: $color-main white !important;
    scrollbar-width: thin !important;
  }
}

.source-link {
  color: $color-main;
  text-decoration: none;

  &:hover {
    cursor: pointer;
    filter: brightness(1.4);
  }
}

.pi.pi-question-circle:hover {
  cursor: pointer;
  color: $color-main;
}

@media only screen and (max-width: 1300px) {
  .header-text {
    display: none;
  }
}

// phone
@media only screen and (max-width: 960px) {
  .publication_info_main .p-card-content .content {
    width: 100% !important;
  }
  .publication_info_main .p-card-content .metatdata {
    width: 100% !important;
    margin-top: 2em !important;
  }
  .publication_info_main .p-card-content {
    flex-direction: column !important;
  }

  .layout-topbar .p-menubar .p-menuitem .p-menuitem-link {
    box-shadow: none;
    margin-left: 0;
  }

  .big-chart .p-dropdown {
    position: relative;
    left: 0;
    width: 150px;
    top: -10px;
  }


  .p-menubar.p-menubar-mobile-active .p-menubar-root-list[role=menubar] {
    top: 90%;
    left: -50px;
    min-width: max-content;
  }

  .amba-tweet {
    .processed-data {
      width: 100%;

      .values {
        grid-template-columns: 1fr 1fr !important;
      }
    }

    .rendered-tweet {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 100% !important;
    }
  }

  .p-column-title {
    font-size: 0.95em !important;
  }
  td {
    text-align: end !important;
  }

  tr > td > span.p-column-title {
    display: block;
    font-weight: bold !important;
    align-self: start;
    margin: -15px 5px 0 0;
  }

  .amba.rank {
    margin-top: 10px;
  }

  .p-input-icon-left {
    position: relative !important;
    right: initial !important;
    top: initial !important;
    margin-bottom: 10px;
  }
  .p-input-icon-right {
    position: relative !important;
    right: initial !important;
    top: initial !important;
  }

  table.p-datatable-table td > .wrapper {
    min-width: 10%;
    padding: 10px !important;
  }

  .publication_info_main .p-card-content {
    height: fit-content;
  }

  .about-container .about .about-line {
    height: fit-content !important;
    min-width: 100px !important;
    margin: 0.3em !important;
    flex-direction: column !important;
    width: 80vw !important;
  }

  .p-chart {
    min-height: 500px;
  }

  .wordCloud {
    height: 45vw !important;
  }


  .big-chart {
    height: max-content !important;
  }

  .trending-items h4 {
    font-size: 1.3em;
  }

  .trending-items .p-datatable .p-datatable-tbody > tr td {
    font-size: 1.2em;
  }

  .help-text {
    height: fit-content !important;
    margin-top: 10px !important;
  }

}

.license {
  a {
    font-size: 0.9em;
    text-decoration: none;
    color: $color-main;

    &:hover {
      color: black;
    }
  }
}

.hidden {
  display: none;
}

.wider {
  width: 160px;
}

.negative-margin-left {
  margin-left: -20px;
}

.justify-end {
  justify-content: flex-end;
}

.w-full {
  width: 100%;
}

.flex {
  display: flex;
}

.bottom-1 {
  bottom: .25rem;
}

.right-2 {
  right: .5rem;
}

.fixed {
  position: fixed;
}

@media only screen and (max-width: 2500px) {
  .prio4 {
    display: none !important;
  }

  td > .wrapper {
    font-size: 1em !important;
    text-align: end;
    display: inline-block;
    min-width: 100%;
    font-weight: 700;
    font-family: 'Courier New', monospace !important;
    padding: 0.6em 2.4em 0.6em 0.6em !important
  }

  th {
    font-size: 1em;
    padding: 1em !important;
  }
}

@media only screen and (max-width: 2300px) {
  .prio3 {
    display: none !important;
  }
}

@media only screen and (max-width: 1700px) {
  .prio2 {
    display: none !important;
  }
}

.help-text {
  text-align: center;
  font-size: 0.9em;
  margin: -30px 0 10px 0;
  height: 20px;
  color: $color-main;
}
</style>
