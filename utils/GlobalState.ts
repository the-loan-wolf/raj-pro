import { atom } from "jotai";
import { PaymentData } from "./type";

const payDataAtom = atom<PaymentData | null>(null);

export default payDataAtom;
