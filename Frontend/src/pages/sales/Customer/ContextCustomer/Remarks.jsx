import React from "react";
import { Field, ErrorMessage } from "formik";

const Remarks = () => {
  return (
    <div className="tab-pane">
      <div className="form-group">
        <label
          htmlFor="remarks"
          className="block text-sm font-semibold text-gray-700"
        >
          Remarks (For Internal Use)
        </label>
        <div>
          <Field
            name="customer_Remarks"
            as="textarea"
            rows="3"
            cols="100"
            className="mt-2 p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter remarks here"
          />
          <small id="remarks-help" className="text-xs text-gray-500"></small>
        </div>
      </div>
    </div>
  );
};

export default Remarks;
