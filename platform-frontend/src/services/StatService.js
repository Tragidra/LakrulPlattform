import http from "../../http-common";

class StatService {

    numbers(duration = "currently", fields = null, doi = null) {
        // Example: /stats/numbers?fields=tweetCount&fields=followersReached&fields=authorCount&fields=totalScore
        if (fields === null) {
            fields = ['bot_rating', 'contains_abstract_raw', 'exclamations', 'followers', 'length', 'questions', 'score', 'sentiment_raw', 'count', 'pub_count'];
        }

        let params = new URLSearchParams();
        fields.forEach((e) => {
            params.append("fields", e);
        });
        params.append("duration", duration);

        if (doi) {
            params.append("dois", doi);
        }
        return http.get('/stats/numbers', {params: params});
    }

    progressValue(field = null, n = 5, duration = "currently", doi) {
        if (field === null) {
            field = 'score'
        }
        let params = {n: n, field: field, duration: duration};
        if (doi) {
            params['dois'] = doi
        }
        return http.get('/stats/progress/value', {params: params});
    }

    progressTrending(field = null, n = 5, duration = "currently", dois) {
        if (field === null) {
            field = 'score'
        }

        let params = new URLSearchParams();
        params.append("n", n);
        params.append("duration", duration);
        params.append("field", field);

        if (dois) {
            dois.forEach(d => {
               params.append("dois", d);
            });
        }

        return http.get('/stats/progress/trending', {params: params});
    }

    newestTweet(mode, doi, id) {
        let params = new URLSearchParams();

        params.append("limit", 1);
        params.append("mode", mode);

        if (mode === 'publication' && doi) {
            params.append("doi", doi);
        } else if (id) {
            params.append("id", id);
        }

        return http.get("/stats/tweets", {params: params});
    }

    tweetAuthorCount(mode, doi, id) {
        let params = new URLSearchParams();

        params.append("mode", mode);

        if (mode === 'publication' && doi) {
            params.append("doi", doi);
        } else if (id) {
            params.append("id", id);
        }

        return http.get("/stats/countTweetAuthors", {params: params});
    }

    tweetCount(mode, doi, id) {
        let params = new URLSearchParams();

        params.append("mode", mode);

        if (mode === 'publication' && doi) {
            params.append("doi", doi);
        } else if (id) {
            params.append("id", id);
        }

        return http.get("/stats/countTweets", {params: params});
    }

    profileData(doi, duration) {
        return http.get('/stats/profile', {params: {doi: doi, duration: duration}});
    }

    top(fields = null, doi = null, limit = 80) {
        if (fields === null) {
            fields = ['word'];
        }

        let params = new URLSearchParams();
        params.append("limit", limit);
        fields.forEach((e) => {
            params.append("fields", e);
        });
        if (doi) {
            params.append("doi", doi);
        }

        return http.get("/stats/top", {params: params});
    }

    percentages(fields = null, doi = null, limit = 12, minPercentage = 0.6) {
        if (fields === null) {
            fields = ['lang', 'tweet_type', 'entity', 'hashtag'];
        }

        let params = new URLSearchParams();
        params.append("limit", limit);
        params.append("min_percentage", minPercentage);
        fields.forEach((e) => {
            params.append("fields", e);
        });
        if (doi) {
            params.append("doi", doi);
        }

        return http.get("/stats/top/percentages", {params: params});
    }
}

export default new StatService();
