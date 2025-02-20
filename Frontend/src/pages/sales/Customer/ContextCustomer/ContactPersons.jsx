import React from "react";
import { Field, ErrorMessage, FieldArray } from "formik";

const ContactPersons = () => {
  return (
    <>
      <div className="">
        <div className="">
          <FieldArray name="customer_ContactPersons">
            {({ push, remove, form }) => (
              <div>
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
                    {form.values.customer_ContactPersons.map((contactPerson, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                          <Field
                            name={`customer_ContactPersons[${index}].salutation`}
                            className="border px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                          <Field
                            name={`customer_ContactPersons[${index}].firstName`}
                            className="border px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                          <Field
                            name={`customer_ContactPersons[${index}].lastName`}
                            className="border px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                          <Field
                            name={`customer_ContactPersons[${index}].email`}
                            type="email"
                            className="border px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                          <Field
                            name={`customer_ContactPersons[${index}].phone`}
                            className="border px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                          <Field
                            name={`customer_ContactPersons[${index}].designation`}
                            className="border px-2 py-1 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ">
                          <button
                            type="button"
                            className="bg-red-500 text-white py-1 px-4 rounded"
                            onClick={() => remove(index)} // Remove contact person
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button
                  type="button"
                  onClick={() => push({ salutation: "", firstName: "", lastName: "", email: "", phone: "", designation: "" })}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add Contact Person
                </button>
              </div>
            )}
          </FieldArray>
        </div>
      </div>
    </>
  );
};

export default ContactPersons;
