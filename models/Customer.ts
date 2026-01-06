import mongoose, { Schema, model, models } from "mongoose";

/* =========================
   EMI TYPE (TypeScript)
========================= */
export interface IEmi {
  amount: number;
  dueDate: Date;
  paidDate?: Date | null;
  status: "PENDING" | "PAID";
}

/* =========================
   CUSTOMER TYPE (TypeScript)
========================= */
export interface ICustomer {
  name: string;
  fatherName?: string;
  contact?: string;
  model?: string;
  imei: string;
  price?: number;
  emiAmount?: number;
  downPayment?: number;
  emis: IEmi[];
  createdAt?: Date;
  updatedAt?: Date;
}

/* =========================
   EMI SCHEMA
========================= */
const emiSchema = new Schema<IEmi>(
  {
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
    },
  },
  { _id: false }
);

/* =========================
   CUSTOMER SCHEMA
========================= */
const customerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
    },
    contact: {
      type: String,
    },
    model: {
      type: String,
    },
    imei: {
      type: String,
      unique: true,
      required: true,
    },
    price: {
      type: Number,
    },
    emiAmount: {
      type: Number,
    },
    downPayment: {
      type: Number,
    },
    emis: {
      type: [emiSchema], // ✅ ARRAY OF EMI OBJECTS
      default: [],
    },
  },
  { timestamps: true }
);

/* =========================
   EXPORT MODEL
========================= */
const Customer =
  models.Customer || model<ICustomer>("Customer", customerSchema);

export default Customer;
