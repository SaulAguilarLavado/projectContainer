const sanitizeError = error => ({
  name: error?.name || 'Error',
  message: error?.message || String(error),
  status: error?.status
});

const logger = {
  info(event, context = {}) {
    console.info(`[TextilControl] ${event}`, context);
  },
  warn(event, context = {}) {
    console.info(`[TextilControl] WARN ${event}`, context);
  },
  handled(event, error, context = {}) {
    console.info(`[TextilControl] HANDLED ${event}`, { ...context, error: sanitizeError(error) });
  },
  error(event, error, context = {}) {
    console.error(`[TextilControl] ${event}`, { ...context, error: sanitizeError(error) });
  }
};

export default logger;
