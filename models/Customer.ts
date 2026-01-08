import mongoose, { Schema, model, models, Types } from "mongoose";
import { required } from "zod/mini";

/* =========================
   EMI TYPE
========================= */
export interface IEmi {
  amount: number;
  dueDate: Date;
  paidDate?: Date | null;
  status: "PENDING" | "PAID";
}

/* =========================
   CUSTOMER TYPE
========================= */
export interface ICustomer {
  name: string;
  fatherName: string;
  contact: string;
  model: string;
  imei: string;

  price: number;
  emiAmount: number;
  downPayment: number;

  emis: IEmi[];

  /* =========================
     AGENT INFO (SNAPSHOT)
  ========================= */
  agentId?: Types.ObjectId;
  agentName?: string;
  agentNumber?: number;
  AlternateNumber?: number;
  Address?: string;

  /* =========================
     APPROVAL FLOW
  ========================= */
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

/* =========================
   EMI SCHEMA
========================= */
const emiSchema = new Schema<IEmi>(
  {
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date, default: null },
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
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    contact: { type: String, required: true },
    model: { type: String, required: true },

    AlternateNumber: {
      type: Number,
    },

    Address: {
      type: String,
      required:true,
    },
    imei: {
      type: String,
      required: true,
      unique: true,
    },

    price: { type: Number, required: true },
    emiAmount: { type: Number, required: true },
    downPayment: { type: Number, required: true },

    emis: {
      type: [emiSchema],
      default: [],
    },

    /* =========================
       AGENT INFO
    ========================= */
    agentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    agentName: {
      type: String,
    },

    agentNumber: {
      type: Number,
    },


    /* =========================
       APPROVAL STATUS
    ========================= */
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
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
