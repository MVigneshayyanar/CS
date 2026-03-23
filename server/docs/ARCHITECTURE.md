# Backend Architecture

This backend follows a layered structure:

- config: environment and runtime configuration
- controllers: request handlers
- middleware: reusable Express middleware
- models: database models
- routes: API route declarations
- services: business logic
- utils: utility helpers (logger, validators, etc.)
- queue: queue workers/producers
- cron: scheduled jobs
- scripts: one-off scripts and maintenance jobs
- template: message/email templates
- tests: automated tests
- tmp: temporary runtime files
