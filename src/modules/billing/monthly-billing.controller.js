import { generateMonthlyRentBills } from "./monthly-billing.service.js";

/**
 * Trigger Monthly Rent Bill Generation Controller
 */
export const generateMonthlyRentBillsController = async (req, res, next) => {
  try {
    const ownerId = req.owner.id;

    const result = await generateMonthlyRentBills({
      ownerId,
    });

    return res.status(200).json({
      message: "Monthly rent bill generation completed",
      billingMonth: result.billingMonth,
      summary: {
        processedUnits: result.processedUnits,
        billsCreated: result.billsCreated,
        skippedUnits: result.skippedUnits,
        failedUnits: result.failedUnits,
      },
    });
  } catch (error) {
    next(error);
  }
};
