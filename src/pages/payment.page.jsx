import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { makeRequest } from "../utils/axios";
import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "../common/checkoutForm";
import { useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const Payment = () => {
  const [clientSecret, setClientSecret] = useState("");
  const location = useLocation();
  const amount = location?.state;

  // console.log(amount);

  useEffect(() => {
    const makePayment = async () => {
      try {
        const res = await makeRequest.post(`/payment`, {
          amount: amount * 100 || 0,
        });

        setClientSecret(res.data);
      } catch (error) {
        console.log(error);
        const err =
          error?.response?.data.error || "Opps! Something went wrong.";
        toast.error(err);
      }
    };
    makePayment();
  }, [amount]);

  // console.log(clientSecret);

  return (
    <div className="max-w-[540px] mx-auto p-4 mt-8">
      <Toaster />
      <h1 className="text-3xl mb-2">Pay here</h1>
      <p className="mb-6 text-dark-grey">
        <span className="text-[#222] bg-yellow-300 p-1">
          Note<span className="text-red">*</span>:
        </span>{" "}
        Use 4242 4242 4242 4242 as moke card numbers
      </p>

      {stripePromise && clientSecret && (
        <Elements
          stripe={stripePromise}
          key={clientSecret}
          options={{ clientSecret }}
        >
          <CheckOutForm />
        </Elements>
      )}
    </div>
  );
};

export default Payment;
