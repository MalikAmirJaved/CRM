import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createContactPersons } from "../../../../features/customerSlice";

const ContactPersons = () => {
  const dispatch = useDispatch();
  const contactPersons = useSelector(
    (state) => state.customer.customer_ContactPersons
  );

  const handleContactPersons = (index, field) => (e) => {
    dispatch(
      createContactPersons({
        index,
        field,
        value: e.target.value,
      })
    );
  };

  const handleRemoveContactPerson = (index) => {
    dispatch(
      createContactPersons({
        index,
        action: "remove",
      })
    );
  };

  return (
    <>
      <div className="tab-pane">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">SALUTATION</th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">FIRST NAME</th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">LAST NAME</th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">EMAIL ADDRESS</th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">WORK PHONE</th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">MOBILE</th>
                <th className="px-4 py-2 border-b text-left text-sm text-gray-700">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {contactPersons.map((contactPerson, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                    <input
                      id="salutation"
                      name="salutation"
                      type="text"
                      value={contactPerson.salutation}
                      onChange={handleContactPersons(index, "salutation")}
                      className="border px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={contactPerson.firstName}
                      onChange={handleContactPersons(index, "firstName")}
                      className="border px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"


                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={contactPerson.lastName}
                      onChange={handleContactPersons(index, "lastName")} className="border px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={contactPerson.email}
                      onChange={handleContactPersons(index, "email")} className="border px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      value={contactPerson.phone}
                      onChange={handleContactPersons(index, "phone")}
                      className="border px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                    <input
                      id="designation"
                      name="designation"
                      type="text"
                      value={contactPerson.designation}
                      onChange={handleContactPersons(index, "designation")} className="border px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </td>
                  <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                    <button
                      className="bg-red-500 text-white py-1 px-4 rounded"
                      onClick={() => handleRemoveContactPerson(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              <button
                onClick={() =>
                  dispatch(createContactPersons({ index: contactPersons.length }))
                }
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add Contact Person
              </button>
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
};

export default ContactPersons;
