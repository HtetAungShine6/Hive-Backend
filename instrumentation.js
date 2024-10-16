import dbConnect from "@/libs/db";

export async function register() {
  console.log("Connecting to database...");
  await dbConnect();
}