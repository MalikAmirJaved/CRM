import React from "react";
import { Route } from "react-router-dom";
import { AdminProtectedRoute } from "../utils/protectedRoutes/ProtectedRoutes";
import {
  AdminDashboard,
  AddStaff,
  PanelStaff,
  PanelDepartment,
  EditStaff,
  PanelProducts,
  PanelQuote,
  AddQuote,
  EditQuote,
  ViewQuote,
  PanelLeads,
  OptionalDataLead,
  LeadToQuoteConversion,
  LeadDetails,
  PanelInvoices,
  AddInvoice,
  EditInvoice,
  ViewInvoice,
  AddProduct,
  EditProduct,
  AdminPayrolls,
  PanelCalendar,
  PanelCustomers,
  CustomerForm,
  CustomerProvider,
  EditCustomer
} from "../pages/admin/AdminPages";
import { AdminLayout } from "../layouts/Layout";

const AdminRoutes = () => (
  <>
        <Route path="/admin/:name" element={<AdminProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminProtectedRoute>} />

        <Route path="/staff" element={<AdminProtectedRoute><AdminLayout><PanelStaff /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/payroll" element={<AdminProtectedRoute><AdminLayout><AdminPayrolls /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/addStaff" element={<AdminProtectedRoute><AdminLayout><AddStaff /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/update-staff/:userId" element={<AdminProtectedRoute><AdminLayout><EditStaff /></AdminLayout></AdminProtectedRoute>} />

        <Route path="/products" element={<AdminProtectedRoute><AdminLayout><PanelProducts /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/add-product" element={<AdminProtectedRoute><AdminLayout><AddProduct /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/update-product/:productId" element={<AdminProtectedRoute><AdminLayout><EditProduct /></AdminLayout></AdminProtectedRoute>} />

        <Route path="/leads" element={<AdminProtectedRoute><AdminLayout><PanelLeads /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/lead-detail/:leadId" element={<AdminProtectedRoute><AdminLayout><LeadDetails /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/optional-data-lead/:leadId" element={<AdminProtectedRoute><AdminLayout> <OptionalDataLead /></AdminLayout></AdminProtectedRoute>}/>
        <Route path="/lead-to-quote-conversion/:leadId" element={<AdminProtectedRoute><AdminLayout> <LeadToQuoteConversion /></AdminLayout></AdminProtectedRoute>}/>

        <Route path="/quotes" element={<AdminProtectedRoute><AdminLayout><PanelQuote /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/add-quote" element={<AdminProtectedRoute><AdminLayout><AddQuote /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/edit-quote/:quoteId" element={<AdminProtectedRoute><AdminLayout><EditQuote /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/view-quote/:quoteId" element={<AdminProtectedRoute><AdminLayout><ViewQuote /></AdminLayout></AdminProtectedRoute>} />

        <Route path="/invoices" element={<AdminProtectedRoute><AdminLayout><PanelInvoices /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/add-invoice" element={<AdminProtectedRoute><AdminLayout><AddInvoice /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/edit-invoice/:invoiceId" element={<AdminProtectedRoute><AdminLayout><EditInvoice /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/view-invoice/:invoiceId" element={<AdminProtectedRoute><AdminLayout><ViewInvoice /></AdminLayout></AdminProtectedRoute>} />

        <Route path="/departments" element={<AdminProtectedRoute><AdminLayout><PanelDepartment /></AdminLayout></AdminProtectedRoute>} />

        <Route path="/calendar" element={<AdminProtectedRoute><AdminLayout><PanelCalendar /></AdminLayout></AdminProtectedRoute>} />
       
        <Route path="/customers" element={<AdminProtectedRoute><AdminLayout><PanelCustomers /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/add-customer" element={<AdminProtectedRoute><AdminLayout><CustomerForm /></AdminLayout></AdminProtectedRoute>} />
        <Route path="/edit-customer/:customerId" element={<AdminProtectedRoute><AdminLayout><EditCustomer /></AdminLayout></AdminProtectedRoute>} />

  </>
);

export default AdminRoutes;
