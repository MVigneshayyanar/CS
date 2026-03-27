const log = (...args) => {
  // Central logger wrapper for future structured logging.
  // eslint-disable-next-line no-console
  console.log(...args);
};

module.exports = {
  log,
};
