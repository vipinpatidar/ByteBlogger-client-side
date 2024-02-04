import { useContext, useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toast } from "react-hot-toast";

import { UserContext } from "../context/user.context";

import { useNavigate } from "react-router-dom";
import { storeInSession } from "./session";
import { makeRequest } from "../utils/axios";

const CheckOutForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [locate, setLocate] = useState(false);
  const { userAuth, setUserAuth } = useContext(UserContext);

  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();

  // if Payment successful Make user Admin

  const makeEditorHandler = async () => {
    try {
      const res = await makeRequest.put(`/users/update-as-editor`, {
        userId: userAuth.userId,
        isEditor: true,
      });
      if (res?.data) {
        // console.log(res.data);
        storeInSession("user", JSON.stringify(res?.data));
        setUserAuth({ isAuthenticated: true, ...res?.data });
        setLocate(true);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  //Handling payments

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("clicked");

      if (!stripe || !elements) {
        return;
      }
      setIsProcessing(true);

      const { error } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message);
      }
      if (!error) {
        elements.getElement(PaymentElement).clear();
        console.log("Payment success");
        await makeEditorHandler();
        setTimeout(() => {
          setLocate(true);
        }, 100);
      }

      // navigate("/login");

      setIsProcessing(false);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (locate === true) {
      navigate("/");
    }
  }, [locate, navigate]);

  return (
    <form onSubmit={handlePaySubmit} className="shadow-md text-gray px-4 py-8">
      <PaymentElement />
      <button disabled={!stripe} className="btn-dark mt-4">
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckOutForm;
