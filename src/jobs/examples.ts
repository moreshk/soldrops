import { client } from "@/trigger";
import { intervalTrigger } from "@trigger.dev/sdk";

client.defineJob({
  id: "scheduled-job-1",
  name: "Scheduled Job 1",
  version: "0.1.1",
  trigger: intervalTrigger({
    seconds: 60,
  }),
  run: async (payload, io, ctx) => {
    await io.logger.info("Received the scheduled event", {
      payload,
    });

    return { foo: "bar" };
  },
});
