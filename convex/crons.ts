import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Crons disabled as per request to rely on runtime date logic
// crons.interval(
//     "close expired jobs",
//     { minutes: 1 },
//     internal.jobs.closeExpiredJobs,
// );

export default crons;
