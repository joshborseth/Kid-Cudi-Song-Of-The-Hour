/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "linkedin-senior-engineer",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Cron("MyCronJob", {
      function: {
        handler: "src/index.handler",
        environment: {
          GITHUB_TOKEN: process.env.GITHUB_TOKEN!,
        },
      },
      schedule: "rate(1 day)",
    });
  },
});
