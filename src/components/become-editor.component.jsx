import React, { useState } from "react";
import { policyPoints } from "../utils/policyPoints";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

const BecomeEditor = () => {
  const [isRead, setIsRead] = useState(false);
  const navigate = useNavigate();

  const payToBeEditorBtnHandler = () => {
    if (!isRead) {
      toast.error("Please first read the all policies carefully then pay.");
      return;
    }

    navigate("/payment", { state: 2000 });
  };

  return (
    <div className="max-w-[700px] mx-auto mt-12">
      <Toaster />
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Policies And Payment
      </h1>

      <div className="py-4 pl-8 pr-4 md:px-8 border-b border-dark-grey">
        {policyPoints.map((keyHeading, idx) => (
          <div key={idx} className="mb-4">
            <div className="text-2xl mb-2 -ml-5 flex gap-2">
              <span className="text-2xl font-medium">0{idx + 1}.</span>
              <p className="text-2xl font-medium text-black">
                {Object.keys(keyHeading)[0]}
              </p>
            </div>
            <ul className="flex flex-col gap-1 list-disc">
              {keyHeading[Object.keys(keyHeading)[0]].map((keyPoint, idx) => (
                <li className="leading-7 text-[15px]" key={idx}>
                  {keyPoint}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="py-8 px-4 mb-6">
        <div className="flex items-center gap-2 ">
          <input
            type="checkbox"
            name="isRead"
            id="isRead"
            checked={isRead}
            className="h-5 w-5 cursor-pointer "
            onChange={() => setIsRead((prevState) => !prevState)}
          />

          <label htmlFor="isRead" className="text-xl">
            Have you read all policies and agree with them
          </label>
        </div>
        <p className="mt-3 text-dark-grey">
          <span className="text-black">
            Note<span className="text-red">*</span>:
          </span>{" "}
          Your editor status will be removed if you not follow this policies
        </p>
        <button className="btn-dark mt-4" onClick={payToBeEditorBtnHandler}>
          Pay 2000 ₹/year
        </button>
      </div>
    </div>
  );
};

export default BecomeEditor;
