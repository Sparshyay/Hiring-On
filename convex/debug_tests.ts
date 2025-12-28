import { query } from "./_generated/server";

export const check = query({
    handler: async (ctx) => {
        const tests = await ctx.db.query("tests").collect();
        return {
            count: tests.length,
            tests: tests.map(t => ({ title: t.title, status: t.status }))
        };
    },
});
