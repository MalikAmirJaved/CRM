import React from "react";
import { Route } from "react-router-dom";
import { SuperAdminProtectedRoute } from "../utils/protectedRoutes/ProtectedRoutes";
import {
  SuperAdminDashboard,
  PanelCompany,
  AddCompany,
  AddCompanyAdmin,
  AddPackage,
} from "../pages/superAdmin/SuperAdminPages";
import { SuperAdminLayout } from "../layouts/Layout";

const SuperAdminRoutes = () => (
  <>
    <Route
      path="/superadmin/:name"
      element={
        <SuperAdminProtectedRoute>
          <SuperAdminLayout>
            <SuperAdminDashboard />
          </SuperAdminLayout>
        </SuperAdminProtectedRoute>
      }
    />
    <Route
      path="/superadmin/companies"
      element={
        <SuperAdminProtectedRoute>
          <SuperAdminLayout>
            <PanelCompany />
          </SuperAdminLayout>
        </SuperAdminProtectedRoute>
      }
    />
    <Route
      path="/superadmin/add-company"
      element={
        <SuperAdminProtectedRoute>
          <SuperAdminLayout>
            <AddCompany />
          </SuperAdminLayout>
        </SuperAdminProtectedRoute>
      }
    />
    <Route
      path="/superadmin/add-package"
      element={
        <SuperAdminProtectedRoute>
          <SuperAdminLayout>
            <AddPackage />
          </SuperAdminLayout>
        </SuperAdminProtectedRoute>
      }
    />
    <Route
      path="/superadmin/:companyId/add-admin-to-company"
      element={
        <SuperAdminProtectedRoute>
          <SuperAdminLayout>
            <AddCompanyAdmin />
          </SuperAdminLayout>
        </SuperAdminProtectedRoute>
      }
    />
  </>
);

export default SuperAdminRoutes;
