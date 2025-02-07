import { Dispatch } from "react";
import { PaymentData } from "./type";
import getToken from "./getToken";

// Function to fetch offer details
const fetchOfferDetails = async (
  paymentId: number,
  setPaymentData: Dispatch<React.SetStateAction<PaymentData | null>>
) => {
  if (!paymentId) return;
  console.log(`fetchOfferDetails - Fetching details for Payment ID: ${paymentId}`);

  try {
    const token = await getToken()
    if (!token) {
      console.error("Authentication token is missing.");
      return;
    }

    const response = await fetch(
      "http://54.211.207.66/api/v1/payment/student/notify/verified-offer/",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const offerData = await response.json();
    // console.log("fetchOfferDetails - last verified offer:", offerData);

    if (offerData.status === 200 && offerData.data.payment_id === paymentId) {
      setPaymentData(offerData.data); // Store offer details if the payment_id matches
      console.log("Offer details stored:", offerData.data);
    }
  } catch (error) {
    console.error("Error fetching offer details:", error);
  }
};

export default fetchOfferDetails;
