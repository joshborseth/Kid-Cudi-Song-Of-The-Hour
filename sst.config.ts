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
      function: "src/index.handler",
      schedule: "rate(1 minute)",
    });
  },
});
