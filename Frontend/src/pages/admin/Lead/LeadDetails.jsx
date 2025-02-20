import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const LeadDetails = () => {
  const jwtLoginToken = localStorage.getItem("jwtLoginToken");
  const { leadId } = useParams(); // Get the lead ID from the URL
  const [leads, setLeads] = useState([]);
  const [leadDetails, setLeadDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [showInteractionHistoryPopup, setShowInteractionHistoryPopup] =
    useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [interactionHistoryInput, setInteractionHistoryInput] = useState({
    stage_Name: "",
    stage_Detail: "",
  });

  const fetchAllLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/lead/all-leads`, {
        headers: {
          Authorization: `Bearer ${jwtLoginToken}`,
        },
      });
      setLeads(response.data.information.allLeads); // Corrected this line
      console.log(response.data.information.allLeads);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const fetchLeadDetails = async (leadId) => {
    try {
      const response = await axios.get(`${API_URL}/lead/${leadId}`, {
        headers: {
          Authorization: `Bearer ${jwtLoginToken}`,
        },
      });
      setLeadDetails(response.data.information.lead);
      setLoading(false);
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLeads();
    if (leadId) {
      fetchLeadDetails(leadId);
    }
  }, [leadId]); // Corrected the dependency array

  const handleAddNote = async () => {
    try {
      await axios.post(
        `${API_URL}/lead/add-note/${leadId}`,
        { note: noteInput },
        {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
          },
        }
      );
      alert("Note added successfully!");
      setShowNotePopup(false);
      setNoteInput("");
      fetchLeadDetails(leadId); // Refresh lead details after adding a note
    } catch (err) {
      alert(err.response ? err.response.data.message : err.message);
    }
  };

  const handleAddInteractionHistory = async () => {
    try {
      await axios.post(
        `${API_URL}/lead/add-interaction-history/${leadId}`,
        interactionHistoryInput,
        {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
          },
        }
      );
      alert("Interaction stage added successfully!");
      setShowInteractionHistoryPopup(false);
      setInteractionHistoryInput({ stage_Name: "", stage_Detail: "" });
      fetchLeadDetails(leadId); // Refresh lead details after adding interaction history
    } catch (err) {
      alert(err.response ? err.response.data.message : err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-row">
      {/* Leads List Section */}
      <div className="w-1/4 bg-white rounded-lg p-1 min-h-screen">
  <h1 className="text-xl font-semibold text-gray-800 border-b border-gray-400 p-2 bg-white">
    Current Leads
  </h1>
  <div className="mt-4 h-[75vh] overflow-y-auto">
    {leads.map((lead) => (
      <div
        key={lead._id}
        className="p-4 border rounded-md hover:bg-gray-100 cursor-pointer"
        onClick={() => fetchLeadDetails(lead._id)}
      >
        <h2 className="text-md text-gray-700">{lead.lead_Title}</h2>
      </div>
    ))}
  </div>
</div>












      {/* Lead Details Section */}
      <div className="w-full bg-white shadow-lg rounded-lg p-6 mb-16">
        {leadDetails ? (
          <>
          <div className="flex justify-between itmes-center">
            <h1 className=" text-2xl font-bold text-gray-800 ">
              Lead Details
            </h1>
            <div className="space-x-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 "
                onClick={() => setShowNotePopup(true)}
              >
                Add Note
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={() => setShowInteractionHistoryPopup(true)}
              >
                Add Interaction History
              </button>
            </div>
            </div>

            <div className="mt-4 rounded-lg drop-shadow-[0_5px_14px_rgba(0,0,0,0.25)] bg-white px-8 py-4 outline-[1px] outline-gray-300 outline px-3 py-1">
  <h2 className="text-xl font-semibold text-gray-700 outline-[1px] outline-gray-300 outline px-3 py-1">{leadDetails.lead_Title}</h2>

  {/* General Details */}
  <div className="grid grid-cols-2 gap-x-4 text-gray-600 mt-2">
    <div className="grid grid-cols-[auto_1fr] gap-x-2 outline-[1px] outline-gray-300 outline px-3 py-1">
      <span className="font-medium text-gray-700">Label:</span>
      <span>{leadDetails.lead_Label}</span>
    </div>
    <div className="grid grid-cols-[auto_1fr] gap-x-2 outline-[1px] outline-gray-300 outline px-3 py-1">
      <span className="font-medium text-gray-700">Source:</span>
      <span>{leadDetails.lead_Source}</span>
    </div>
  </div>

  {/* Demography */}
  <h3 className="text-lg font-semibold text-gray-700 mt-6 outline-[1px] outline-gray-300 outline px-3 py-1 mb-2">Demography</h3>
  <div className="grid grid-cols-2 gap-x-4 text-gray-600">
    {[
      ["Company Size:", leadDetails.lead_Demography.company_Size],
      ["Industry:", leadDetails.lead_Demography.industry_Match ? "Match" : "No Match"],
      ["Location:", leadDetails.lead_Demography.location],
      ["Job Title:", leadDetails.lead_Demography.job_Title]
    ].map(([label, value], index) => (
      <div key={index} className="grid grid-cols-[auto_1fr] gap-x-2 outline-[1px] outline-gray-300 outline px-3 py-1 mb-2">
        <span className="font-medium text-gray-700 ">{label}</span>
        <span>{value}</span>
      </div>
    ))}
  </div>

  {/* Behaviour */}
  <h3 className="text-lg font-semibold text-gray-700 mt-6 outline-[1px] outline-gray-300 outline px-3 py-1 mb-2">Behaviour</h3>
  <div className="grid grid-cols-2 gap-x-4 text-gray-600">
    {[
      ["Visited Pricing Page:", leadDetails.lead_Behaviour.visited_Pricing_Page],
      ["Downloaded White Paper:", leadDetails.lead_Behaviour.downloaded_White_Paper ? "Yes" : "No"],
      ["Repeated Website Visits:", leadDetails.lead_Behaviour.repeated_Website_Visits ? "Yes" : "No"],
      ["Ignored Email or Unsubscribed:", leadDetails.lead_Behaviour.ignore_Email_or_Unsubscribed ? "Yes" : "No"]
    ].map(([label, value], index) => (
      <div key={index} className="grid grid-cols-[auto_1fr] gap-x-2 outline-[1px] outline-gray-300 outline px-3 py-1 mb-2">
        <span className="font-medium text-gray-700">{label}</span>
        <span>{value}</span>
      </div>
    ))}
  </div>

  {/* Actions */}
  <h3 className="text-lg font-semibold text-gray-700 mt-6 outline-[1px] outline-gray-300 outline px-3 py-1 mb-2">Actions</h3>
  <div className="grid grid-cols-2 gap-x-4 text-gray-600">
    {[
      ["Requested Demo or Quote:", leadDetails.lead_Action.requested_Demo_or_Quote ? "Yes" : "No"],
      ["Attended Sales Call:", leadDetails.lead_Action.attended_Sales_Call ? "Yes" : "No"],
      ["Opted for Trial Services:", leadDetails.lead_Action.opted_for_Trial_Services ? "Yes" : "No"]
    ].map(([label, value], index) => (
      <div key={index} className="grid grid-cols-[auto_1fr] gap-x-2 outline-[1px] outline-gray-300 outline px-3 py-1 mb-2">
        <span className="font-medium text-gray-700">{label}</span>
        <span>{value}</span>
      </div>
    ))}
  </div>

  {/* Notes */}
  <h3 className="text-lg font-semibold text-gray-700 mt-6 outline-[1px] outline-gray-300 outline px-3 py-1 mb-2">Notes</h3>
  <div className="space-y-2">
    {leadDetails.lead_Notes && leadDetails.lead_Notes.length > 0 ? (
      leadDetails.lead_Notes.map((note) => (
        <div key={note._id} className="border p-4 rounded-md outline-[1px] outline-gray-300 outline px-3 py-1 mb-2">
          <p>{note.note}</p>
          <p className="text-sm text-gray-500 mt-2">
            Created At: {new Date(note.note_CreatedAt).toLocaleString()}
          </p>
        </div>
      ))
    ) : (
      <p>No notes available.</p>
    )}
  </div>

  {/* Interaction History */}
  <h3 className="text-lg font-semibold text-gray-700 mt-6">Interaction History</h3>
  <div>
    {leadDetails.lead_InteractionHistory &&
    leadDetails.lead_InteractionHistory.length > 0 ? (
      leadDetails.lead_InteractionHistory.map((stage) => (
        <div key={stage._id} className="border p-4 rounded-md">
          <p>Stage: {stage.stage_Name}</p>
          <p>Details: {stage.stage_Detail}</p>
          <p className="text-sm text-gray-500 mt-2">
            Created At: {new Date(stage.stage_CreatedAt).toLocaleString()}
          </p>
        </div>
      ))
    ) : (
      <p>No interaction history available.</p>
    )}
  </div>
</div>



          </>
        ) : (
          <div>Select a lead to view details</div>
        )}
      </div>

      {/* Note Popup */}
      {showNotePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-bold text-gray-700">Add Note</h3>
            <textarea
              className="w-full p-2 border rounded-md mt-4"
              rows="4"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            ></textarea>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowNotePopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleAddNote}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interaction History Popup */}
      {showInteractionHistoryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-bold text-gray-700">
              Add Interaction History Stage
            </h3>
            <input
              type="text"
              placeholder="Stage Name"
              className="w-full p-2 border rounded-md mt-4"
              value={interactionHistoryInput.stage_Name}
              onChange={(e) =>
                setInteractionHistoryInput({
                  ...interactionHistoryInput,
                  stage_Name: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Stage Detail"
              className="w-full p-2 border rounded-md mt-4"
              rows="4"
              value={interactionHistoryInput.stage_Detail}
              onChange={(e) =>
                setInteractionHistoryInput({
                  ...interactionHistoryInput,
                  stage_Detail: e.target.value,
                })
              }
            ></textarea>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowInteractionHistoryPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={handleAddInteractionHistory}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetails;
