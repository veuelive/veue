function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context("../components", true, /[_\/]component\.(scss|ts)$/));
