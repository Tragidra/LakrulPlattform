import http from "../../http-common";

// https://www.bezkoder.com/vue-3-crud/
class PublicationService {

    get(id, duration) {
        return http.get('/publication/get', { params: { doi: id, duration: duration } });
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
        return http.get('/publication/trending', {params: params});
    }

    trendingCovid(duration, offset, limit, sort, order, search) {
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
        return http.get('/publication/trending/covid', {params: params});
    }

    trendingFos(duration, id, offset, limit, sort, order, search) {
        let params = new URLSearchParams();

        params.append("duration", duration);
        params.append("id", id);

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
        return http.get('/publication/trending/fieldOfScience', {params: params});
    }

    trendingAuthor(duration, id, offset, limit, sort, order, search) {
        let params = new URLSearchParams();

        params.append("duration", duration);
        params.append("id", id);

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
        return http.get('/publication/trending/author', {params: params});
    }

    twitter(doi) {
        return http.get(`/publication/twitter/${doi}`);
    }

}

export default new PublicationService();