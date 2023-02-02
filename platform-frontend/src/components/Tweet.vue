<template>
    <slot v-if="isLoading" name="loading"></slot>
    <slot v-else-if="hasError" name="error"></slot>
    <div ref="tweetContainer" v-bind="attrs"></div>
</template>

<script>
    // render a tweet using twitter js api therefore ensuring comlicance
    let __rest = (this && this.__rest) || function (s, e) {
        let t = {};
        for (let p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (let i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
    import {defineComponent, ref, onMounted, nextTick, watch} from "vue";

    export default defineComponent({
        props: {
            tweetId: {
                type: String,
                required: true
            },
            conversation: {
                type: String,
                default: "all"
            },
            cards: {
                type: String,
                default: "visible"
            },
            width: {
                type: [String, Number],
                default: "400"
            },
            align: {
                type: [String, undefined],
                default: undefined
            },
            theme: {
                type: String,
                default: "light"
            },
            lang: {
                type: String,
                default: "en"
            },
            dnt: {
                type: Boolean,
                default: false
            },
        },
        emits: ["tweet-load-success", "tweet-load-error"],
        setup(props, {attrs, emit}) {
            const isLoading = ref(true);
            const hasError = ref(false);
            const tweetContainer = ref();
            onMounted(() => {
                renderTweet();
            });
            watch(props, () => {
                renderTweet();
            });

            function renderTweet() {

                if (!(window["twttr"] && window["twttr"].ready)) {
                    addScript("https://platform.twitter.com/widgets.js", renderTweet);
                    return;
                }
                window["twttr"].ready().then(({widgets}) => {
                    isLoading.value = true;
                    hasError.value = false;
                    // Clear previously rendered tweet before rendering the updated tweet id
                    if (tweetContainer.value) {
                        tweetContainer.value.innerHTML = "";
                    }
                    const {tweetId} = props, options = __rest(props, ["tweetId"]);
                    console.log('render tweet -- ' + tweetId)
                    widgets
                        .createTweet(tweetId, tweetContainer.value, options)
                        .then(async (twitterWidgetElement) => {
                            // Since we're mutating the DOM directly with the embed we need to tell Vue wait until the DOM update
                            await nextTick();
                            if (twitterWidgetElement) {
                                emit("tweet-load-success", twitterWidgetElement);
                            } else {
                                hasError.value = true;
                                emit("tweet-load-error");
                            }
                            isLoading.value = false;
                        });
                });
            }

            function addScript(src, cb) {
                const s = document.createElement("script");
                s.setAttribute("src", src);
                s.addEventListener("load", () => cb(), false);
                document.body.appendChild(s);
            }

            return {tweetContainer, isLoading, hasError, attrs};
        }
    });
</script>