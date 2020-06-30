const getShowsByKey = (key) => {
  return fetch(`http://api.tvmaze.com/search/shows?q=${key}`).then(
    (resp) => resp.json
  );
};

const getShowsById = (key) => {
  return fetch(`http://api.tvmaze.com/search/shows?q=${key}`).then(
    (resp) => resp.json
  );
};
