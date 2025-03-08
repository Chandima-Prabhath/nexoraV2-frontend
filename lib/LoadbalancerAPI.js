class LoadBalancerAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.cache = {
      filmStore: null,
      tvStore: null,
      allMovies: null,
      allSeries: null,
      movieMetadata: new Map(),
      seriesMetadata: new Map(),
    };
  }

  async getInstances() {
    return await this._get('/api/get/instances');
  }

  async getInstancesHealth() {
    return await this._get('/api/get/instances/health');
  }

  async getMovieByTitle(title) {
    return await this._get(`/api/get/movie/${encodeURIComponent(title)}`);
  }

  async getSeriesEpisode(title, season, episode) {
    return await this._get(`/api/get/series/${encodeURIComponent(title)}/${season}/${episode}`);
  }

  async getSeriesStore() {
    if (!this.cache.tvStore) {
      this.cache.tvStore = await this._get('/api/get/series/store');
    }
    return this.cache.tvStore || {};
  }

  async getMovieStore() {
    if (!this.cache.filmStore) {
      this.cache.filmStore = await this._get('/api/get/movie/store');
    }
    return this.cache.filmStore || {};
  }

  async getMovieMetadataByTitle(title) {
    if (!this.cache.movieMetadata.has(title)) {
      const metadata = await this._get(`/api/get/movie/metadata/${encodeURIComponent(title)}`);
      this.cache.movieMetadata.set(title, metadata);
    }
    return this.cache.movieMetadata.get(title);
  }

  async getMovieCard(title) {
    return await this._get(`/api/get/movie/card/${encodeURIComponent(title)}`);
  }

  async getSeriesMetadataByTitle(title) {
    if (!this.cache.seriesMetadata.has(title)) {
      const metadata = await this._get(`/api/get/series/metadata/${encodeURIComponent(title)}`);
      this.cache.seriesMetadata.set(title, metadata);
    }
    return this.cache.seriesMetadata.get(title);
  }

  async getSeriesCard(title) {
    return await this._get(`/api/get/series/card/${encodeURIComponent(title)}`);
  }

  async getSeasonMetadataByTitleAndSeason(title, season) {
    return await this._get(`/api/get/series/metadata/${encodeURIComponent(title)}/${encodeURIComponent(season)}`);
  }

  async getSeasonMetadataBySeriesId(series_id, season) {
    return await this._get(`/api/get/series/metadata/${series_id}/${season}`);
  }

  async getAllMovies() {
    if (!this.cache.allMovies) {
      this.cache.allMovies = await this._get('/api/get/movie/all');
    }
    return this.cache.allMovies;
  }

  async getAllSeriesShows() {
    if (!this.cache.allSeries) {
      this.cache.allSeries = await this._get('/api/get/series/all');
    }
    return this.cache.allSeries;
  }

  async getRecent(limit = 10) {
    return await this._get(`/api/get/recent?limit=${limit}`);
  }

  async getGenreCategories(mediaType) {
    const url = mediaType
      ? `/api/get/genre_categories?media_type=${encodeURIComponent(mediaType)}`
      : '/api/get/genre_categories';
    return await this._get(url);
  }
  

  async getGenreItems(genres, mediaType, limit = 5, page = 1) {
    if (!Array.isArray(genres)) {
      throw new Error("The 'genres' parameter must be an array.");
    }
    const params = new URLSearchParams();
    genres.forEach(genre => params.append('genre', genre));
    params.append('limit', limit);
    params.append('page', page);
    if (mediaType) {
      params.append('media_type', mediaType);
    }
    try {
      const response = await this._get(`/api/get/genre?${params.toString()}`);
      console.debug(response);
      return response;
    } catch (error) {
      console.debug("Error fetching genre items:", error);
      throw error;
    }
  }

  async getDownloadProgress(url) {
    return await this._getNoBase(url);
  }

  async _get(endpoint) {
    return await this._request(`${this.baseURL}${endpoint}`, { method: 'GET' });
  }

  async _getNoBase(url) {
    return await this._request(url, { method: 'GET' });
  }

  async _post(endpoint, body) {
    return await this._request(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  async _request(url, options) {
    try {
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      console.log(`API Request: ${url} with options: ${JSON.stringify(options)}`);
      return await this._handleResponse(response);
    } catch (error) {
      console.debug(`Request error for ${url}:`, error);
      throw error;
    }
  }

  async _handleResponse(response) {
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorDetails}`);
    }
    try {
      return await response.json();
    } catch (error) {
      console.debug('Error parsing JSON response:', error);
      throw error;
    }
  }

  clearCache() {
    this.cache = {
      filmStore: null,
      tvStore: null,
      allMovies: null,
      allSeries: null,
      movieMetadata: new Map(),
      seriesMetadata: new Map(),
    };
  }
}

export { LoadBalancerAPI };