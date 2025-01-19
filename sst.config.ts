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
    const GITHUB_TOKEN = new sst.Secret("GITHUB_TOKEN");

    new sst.aws.Cron("MyCronJob", {
      function: {
        handler: "src/index.handler",
        link: [GITHUB_TOKEN],
        url: true,
      },
      schedule: "rate(1 day)",
    });
  },
});
