import { LoadBalancerAPI } from "./LoadbalancerAPI";

const lb = new LoadBalancerAPI("https://hans-den-load-balancer.hf.space");

export async function getRecentItems(limit = 5) {
  const recentData = await lb.getRecent(limit);
  console.debug("Raw recent data:", recentData);
  
  const slides = [];

  // Process movies and format them as slide objects
  if (recentData.movies && Array.isArray(recentData.movies)) {
    recentData.movies.forEach(movie => {
      const [title, year, description, image, genres] = movie;
      slides.push({
        type: 'movie',
        title,
        genre: genres.map(g => g.name), // returns an array of genre names
        image,
        description,
      });
    });
  }

  // Process series and format them as slide objects with type "tvshow"
  if (recentData.series && Array.isArray(recentData.series)) {
    recentData.series.forEach(series => {
      const [title, year, description, image, genres] = series;
      slides.push({
        type: 'tvshow',
        title,
        genre: genres.map(g => g.name), // returns an array of genre names
        image,
        description,
      });
    });
  }
  console.debug(slides);
  return slides;
}


export async function getNewContents(limit = 5) {
  const recentData = await lb.getRecent(limit);
  console.debug("Raw recent data:", recentData);
  
  const movies = [];
  const tvshows = [];

  // Process movies
  if (Array.isArray(recentData.movies)) {
    recentData.movies.forEach(([title, year, description, image, genres]) => {
      movies.push({
        title,
        genre: genres.map(g => g.name),
        image,
        description,
      });
    });
  }

  // Process TV shows
  if (Array.isArray(recentData.series)) {
    recentData.series.forEach(([title, year, description, image, genres]) => {
      tvshows.push({
        title,
        genre: genres.map(g => g.name),
        image,
        description,
      });
    });
  }
  
  console.debug({ movies, tvshows });
  return { movies, tvshows };
}


export async function getAllMovies(){
  const movies = await lb.getAllMovies();
  console.debug(movies);
  
  const formattedMovies = movies.map(title => ({
    title: title.replace('films/', '')
  }));
  return formattedMovies
}

export async function getAllTvShows() {
  const tvshows = await lb.getAllSeriesShows();

  // Transform the response to return TV show names with episode count
  const formattedTvShows = Object.entries(tvshows).map(([title, episodes]) => ({
    title,
    episodeCount: episodes.length
  }));

  return formattedTvShows;
}

export async function getMovieLinkByTitle(title){
  const response = await lb.getMovieByTitle(title);
  console.debug(response);
  return response
}

export async function getEpisodeLinkByTitle(title, season, episode){
  const response = await lb.getSeriesEpisode(title, season, episode);
  console.debug(response);
  return response
}

export async function getMovieCard(title){
    const movie = await lb.getMovieCard(title);
    console.debug(movie);
    return movie
}

export async function getTvShowCard(title){
  const tvshow = await lb.getSeriesCard(title);
  console.debug(tvshow);
  return tvshow
}

export async function getMovieMetadata(title){
  const movie = await lb.getMovieMetadataByTitle(title);
  console.debug(movie);
  return movie
}

export async function getTvShowMetadata(title){
  const tvshow = await lb.getSeriesMetadataByTitle(title);
  console.debug(tvshow);
  return tvshow
}

export async function getSeasonMetadata(title,season){
  const data = await lb.getSeasonMetadataByTitleAndSeason(title, season);
  console.debug(data);
  return data
}

export async function getGenreCategories(mediaType){
  const gc = await lb.getGenreCategories(mediaType);
  console.debug(gc);
  if (gc.genres)
    return gc.genres
  else
  return []
}

export async function getGenresItems(genres, mediaType, limit = 10, page = 1){
  const genresRes = await lb.getGenreItems(genres, mediaType, limit, page);
  console.debug(genresRes);
  return genresRes
}