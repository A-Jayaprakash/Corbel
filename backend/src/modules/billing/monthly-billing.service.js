import { Unit } from "../../models/Unit.model.js";
import { createRentBillForUnitMonth } from "../rent-bill/rent-bill.service.js";

/**
 * Generate monthly rent bills for all units (idempotent)
 */
export const generateMonthlyRentBills = async ({ ownerId }) => {
  const now = new Date();

  const billingMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;

  const dueDate = new Date(now.getFullYear(), now.getMonth(), 5); // 5th of month

  const units = await Unit.find({ ownerId });

  let processedUnits = 0;
  let billsCreated = 0;
  let skippedUnits = 0;
  let failedUnits = 0;

  for (const unit of units) {
    processedUnits++;

    try {
      const bill = await createRentBillForUnitMonth({
        ownerId,
        unitId: unit._id,
        billingMonth,
        dueDate,
      });

      if (bill.createdAt.getTime() === bill.updatedAt.getTime()) {
        billsCreated++;
      } else {
        skippedUnits++;
      }
    } catch (error) {
      /*
        Important:
        - Duplicate key errors are safe to ignore
        - Other errors should be counted but not stop execution
      */
      failedUnits++;
    }
  }

  return {
    billingMonth,
    processedUnits,
    billsCreated,
    skippedUnits,
    failedUnits,
  };
};
