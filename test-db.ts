import { db } from "./lib/db.ts";

async function test() {
  try {
    const users = await db.user.findMany();
    console.log("SUCCESS! Connected to DB. Users:", users.length);
  } catch (err) {
    console.error("DB ERROR:", err);
  }
}

test();
