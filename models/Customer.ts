import mongoose, { Schema, model, models } from "mongoose";

/* =========================
   PAYMENT TYPE (NEW)
========================= */
export interface IPayment {
  amount: number;
  date: Date;
}

/* =========================
   EMI TYPE (EXTENDED, NOT BROKEN)
========================= */
export interface IEmi {
  amount: number;      
  penalty: number;       // penalty amount
  paidAmount: number;    // total paid so far (cached)
  dueDate: Date;
  paidDate?: Date | null; // last payment date (cached)
  status: "PENDING" | "PARTIAL" | "PAID";

  payments: IPayment[]; // ✅ NEW: full payment history
}

/* =========================
   CUSTOMER TYPE (UNCHANGED)
========================= */
export interface ICustomer {
  profileImage: string;
  name: string;
  fatherName?: string;
  address?: string;
  contact?: string;
  model?: string;
  imei: string;
  aadhar?: string;
  alternateNumber?: string;
  supplier?: string;
  supplierNumber?: string;
  price?: number;
  emiAmount?: number;
  downPayment?: number;
  pendingdownPayment?: number;

  emis: IEmi[];

  status: "PENDING" | "APPROVED";

  createdBy: {
    userId: string;
    role: "ADMIN" | "AGENT";
  };

  createdAt?: Date;
  updatedAt?: Date;
}

/* =========================
   PAYMENT SCHEMA (NEW)
========================= */
const paymentSchema = new Schema<IPayment>(
  {
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { _id: false }
);

/* =========================
   EMI SCHEMA (EXTENDED)
========================= */
const emiSchema = new Schema<IEmi>(
  {
    amount: { type: Number, required: true },
    penalty: { type: Number, default: 0 }, // ✅ NEW

    paidAmount: {
      type: Number,
      default: 0, // cached total
    },

    dueDate: { type: Date, required: true },

    paidDate: {
      type: Date,
      default: null, // last payment date
    },

    status: {
      type: String,
      enum: ["PENDING", "PARTIAL", "PAID"],
      default: "PENDING",
    },

    payments: {
      type: [paymentSchema], // ✅ NEW
      default: [],
    },
  },
  { _id: false }
);

/* =========================
   CUSTOMER SCHEMA (UNCHANGED)
========================= */
const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    profileImage: { type: String, default: "" },
    fatherName: String,
    address: String,
    contact: String,
    model: String,

    imei: { type: String, unique: true, required: true },

    alternateNumber: String,
    supplier: String,
    supplierNumber: String,

    price: Number,
    emiAmount: Number,
    downPayment: Number,
    pendingdownPayment: Number,

    emis: { type: [emiSchema], default: [] },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED"],
      default: "PENDING",
    },

    createdBy: {
      userId: String,
      role: {
        type: String,
        enum: ["ADMIN", "AGENT"],
      },
    },
  },
  { timestamps: true }
);

export default models.Customer ||
  model<ICustomer>("Customer", customerSchema);
