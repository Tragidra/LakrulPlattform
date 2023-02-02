<template>
    <div class="wordCloud" ref="wordCloud" :style="style"></div>
</template>

<script>
import * as d3 from "d3";
import * as cloud from 'd3-cloud';

export default {
    data() {
        return {
            layout: {},
            chart: {},
            fill: null,
            style: ''
        }
    },
    props: {
        data: {
            type: Array,
            required: true,
            ro: null,
        },
        onWordClick: {
            type: Function,
            default: (word) => {
                // open either a search or a persons page
                let annotation = word.target.textContent;
                if (annotation.startsWith('@')) {
                    window.open("https://twitter.com/" + annotation, '_blank');
                } else {
                    window.open("https://twitter.com/search?q=" + annotation, '_blank');
                }
            },
        },
        rotate: {
            type: [Function, String, Number],
            default: 0,
        },
        font: {
            type: [String, Function],
            default: 'Candara'
        },
        width: {
            type: [Number, String],
            default: 960,
        },
        height: {
            type: [Number, String],
            default: 500,
        },
        padding: {
            type: [Number, String],
            default: 5,
        },
        spiral: {
            type: String,
            default: "archimedean",
        },
        coloring: {
            type: String,
            default: "random",
        },
        colors: {
            type: Array,
            default() {
                return ['#0F6364', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666']
            }
        }
    },
    mounted() {
        this.createCanvas();
        this.ro = new ResizeObserver(this.onResize).observe(this.$refs.wordCloud);
    },
    beforeUnmount () {
        if (this.ro)
          this.ro.unobserve(this.$refs.wordCloud);
    },
    watch: {
        data() {
            this.createCanvas();
        },
        rotate() {
            this.createCanvas();
        },
        font() {
            this.createCanvas();
        },
        padding() {
            this.createCanvas();
        },
        spiral() {
            this.createCanvas();
        },
        colors() {
            this.createCanvas();
        },
        coloring() {
            this.createCanvas();
        }
    },
    methods: {
        fontSizeMapper: function (word) {
            // map a given word based to its count (value) to a size within max and min
            let max = 0;
            let min = 10000;
            this.data.forEach((e) => {
                if (e.value > max) {
                    max = e.value;
                } else if (e.value < min) {
                    min = e.value;
                }
            });
            let maxOut = 150;   // max font size
            let minOut = 20;    // min font size
            return (word.value - min) * (maxOut - minOut) / (max - min) + minOut;
        },
        onResize () {
            // resize word cloud using transform to keep everything working
            if (this.$refs && this.$refs.wordCloud) {
                let wrapperHeight = this.$refs.wordCloud.offsetHeight;
                let wrapperWidth = this.$refs.wordCloud.offsetWidth;
                let dh = wrapperHeight / this.height;
                let dw = wrapperWidth / this.width;
                let r = 1;
                if (dh > dw) {
                    r = dw;
                } else {
                    r = dh;
                }
                this.style = 'transform: scale(' + r + ');';
            }
        },
        createCanvas: function() {
            // create the word cloud using provided data
            const wordCounts = this.data.map(
                text => ({ ...text })
            );
            wordCounts.forEach(w => {
               w.text = w.text.startsWith('@') ? w.text : w.text.toUpperCase()
            });
            d3.select(this.$el).selectAll('*').remove();
            const layout = cloud()
            .size([this.width, this.height])
            .words(wordCounts)
            .padding(this.padding)
            .spiral(this.spiral)
            .rotate(this.rotate)
            .font(this.font)
            .fontSize(this.fontSizeMapper)
            .on('end', this.end);

            if (this.colors)
                this.fill = d3.scaleOrdinal().range(this.colors);
            else
                this.fill = d3.scaleOrdinal(d3.schemeCategory10);
            layout.start();
        },
        end: function(words) {
            let _fill;
            switch (this.coloring){
                case "random":
                    _fill = (d, i) => this.fill(i);
                    break;
                case "size":
                    _fill = (d) => this.fill(d.size);
                    break;
                default:
                    _fill = (d, i) => this.fill(i);
            }
            d3.select(this.$el)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('viewbox', "0 0 " + this.height + " " + this.width)
            .append('g')
            .attr('transform', `translate(${this.width / 2},${this.height / 2})`)
            .selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .style('font-family', d => d.font)
            .style('font-size', d => {
                return `${d.size}px`
            })
            .style('fill', _fill)
            .attr('text-anchor', 'middle')
            .attr('transform',d => {
                return `translate(${[d.x, d.y]})rotate(${d.rotate})`
            })
            .text(d => d.text)
            .on('click', d => this.onWordClick(d));
        },
    }
 }
</script>

<style lang="scss">
    @import '../assets/_theme.scss'; // copied from '~primevue/resources/themes/nova/theme.css'

    .wordCloud {
        text {
            cursor: pointer;

            &:hover {
                font-weight: bold;
            }
        }
    }

</style>
