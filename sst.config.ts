/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "kid-cudi-song-of-the-day",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const GITHUB_TOKEN = new sst.Secret("GITHUB_TOKEN");

    new sst.aws.Cron("mmmmmm", {
      function: {
        handler: "src/index.handler",
        link: [GITHUB_TOKEN],
        url: true,
      },
      schedule: "rate(1 day)",
    });
  },
});
