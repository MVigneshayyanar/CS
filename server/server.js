const app = require("./app");
const { env } = require("./config");
const { startCronJobs } = require("./cron");
const { startQueueWorkers } = require("./queue");
const { log } = require("./utils/logger");

const server = app.listen(env.port, () => {
	log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
	startCronJobs();
	startQueueWorkers();
});

const shutdown = (signal) => {
	log(`${signal} received, shutting down gracefully...`);
	server.close(() => {
		process.exit(0);
	});
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
