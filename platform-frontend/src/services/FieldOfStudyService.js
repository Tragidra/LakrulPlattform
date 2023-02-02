import http from "../../http-common";

class FieldOfStudyService {

    get(id) {
        return http.get('/fieldOfStudy/get', {params: {id: id}});
    }

    trending(duration, offset, limit, sort, order, search) {
        let params = new URLSearchParams();

        params.append("duration", duration);

        if (offset) {
            params.append("offset", offset);
        }
        if (limit) {
            params.append("limit", limit);
        }
        if (sort) {
            params.append("sort", sort);
        }
        if (order) {
            params.append("order", order);
        }
        if (search) {
            params.append("search", search);
        }
        return http.get('/fieldOfStudy/trending', {params: params});
    }

    profileData(id, duration) {
        return http.get('/stats/profile', {params: {id: id, duration: duration, mode: 'fieldOfStudy'}});
    }

    numbers(duration = "currently", fields = null, id = null) {
        // Example: /stats/numbers?fields=tweetCount&fields=followersReached&fields=authorCount&fields=totalScore
        if (fields === null) {
            fields = ['bot_rating', 'contains_abstract_raw', 'exclamations', 'followers', 'length', 'questions', 'score', 'sentiment_raw', 'count', 'pub_count'];
        }

        let params = new URLSearchParams();
        fields.forEach((e) => {
            params.append("fields", e);
        });
        params.append("duration", duration);
        params.append("mode", 'fieldOfStudy');
        params.append("id", id);
        return http.get('/stats/numbers', {params: params});
    }

    top(fields = null, id = null, limit = 80) {
        if (fields === null) {
            fields = ['word'];
        }

        let params = new URLSearchParams();
        params.append("mode", 'fieldOfStudy');
        params.append("id", id);
        params.append("limit", limit);
        fields.forEach((e) => {
            params.append("fields", e);
        });


        return http.get("/stats/top", {params: params});
    }

    progressValue(field = null, n = 5, duration = "currently", id) {
        if (field === null) {
            field = 'score'
        }
        let params = {n: n, field: field, duration: duration, mode: 'fieldOfStudy', id: id};
        return http.get('/stats/progress/value', {params: params});
    }

    progressTrending(field = null, n = 5, duration = "currently", id) {
        if (field === null) {
            field = 'score'
        }
        return http.get('/stats/progress/trending', {
            params: {
                n: n,
                duration: duration,
                field: field,
                mode: 'fieldOfStudy',
                id: id
            }
        });
    }
}

export default new FieldOfStudyService();
