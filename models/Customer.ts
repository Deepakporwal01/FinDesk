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
       required: true,
    },
    contact: {
      type: String,
       required: true,
    },
    model: {
      type: String,
       required: true,
    },
    imei: {
      type: String,
      unique: true,
      required: true,
    },
    price: {
      type: Number,
       required: true,
    },
    emiAmount: {
      type: Number,
       required: true,
    },
    downPayment: {
      type: Number,
       required: true,
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
