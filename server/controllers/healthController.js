const getHealth = (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "server",
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getHealth,
};
