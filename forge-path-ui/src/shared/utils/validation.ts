import { z } from "zod";

export const gstinSchema = z
  .string()
  .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: "Invalid GSTIN format structure",
  });

export const invoiceNumberSchema = z
  .string()
  .min(3, { message: "Invoice number must be at least 3 characters" });
