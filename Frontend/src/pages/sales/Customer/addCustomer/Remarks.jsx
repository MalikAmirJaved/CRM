import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { createRemarks } from "../../../../features/customerSlice";

const Remarks = () => {
  const dispatch = useDispatch();
  const customerData = useSelector((state) => state.customer);

  const handleRemarks = (e) => {
    dispatch(createRemarks({ field: e.target.name, value: e.target.value }));
  };

  return (

    <>
        <div className="tab-pane">
      <div className="form-group">
        <label
          htmlFor="remarks"
          className="block text-sm font-semibold text-gray-700"
        >
          Remarks (For Internal Use)
        </label>
        <textarea
          id="customer_Remarks"
          name="customer_Remarks"
          type="text"
          value={customerData.customer_Remarks}
          onChange={handleRemarks}
          rows="3"
          cols="100"
          className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter remarks here"
        ></textarea>
        <small
          id="remarks-help"
          className="text-xs text-gray-500"
        ></small>
      </div>
    </div>
    </>
  );
};

export default Remarks;
