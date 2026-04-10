import cron from "node-cron";
import { RentBill } from "../models/RentBill.model.js";

/**
 * Runs daily at midnight.
 * Marks all DUE bills whose dueDate has passed as OVERDUE.
 */
export const startOverdueJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await RentBill.updateMany(
        { status: "DUE", dueDate: { $lt: new Date() } },
        { $set: { status: "OVERDUE" } },
      );
      console.log(
        `[overdue-job] Marked ${result.modifiedCount} bills as OVERDUE`,
      );
    } catch (err) {
      console.error("[overdue-job] Failed:", err.message);
    }
  });

  console.log("[overdue-job] Scheduled — runs daily at midnight");
};
