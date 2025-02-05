type Shop = {
  id: string;
  shop_name: string;
  address: string;
  zip_code: string;
  contact_number: string;
  category: string;
  opening_time: string;
  closing_time: string;
  min_discount: string;
  max_discount: string;
};

type PaymentData = {
  payment_id: number;
  offer_id: number;
  offer_amount: string;
  remaining_amount_to_pay: string;
  message: string;
};

export {Shop, PaymentData};