import { Route, Routes } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Layout } from "./layout/Layout";
import { WorkOrders } from "./pages/WorkOrders";
import { Machinery } from "./pages/Machinery";
import { MachineryDetail } from "./pages/MachineryDetail";
import { Clients } from "./pages/Clients";
import { LotDetail } from "./pages/LotDetail";
import { CreateWorkOrderNew } from "./pages/CreateWorkOrderNew";
import { WorkOrderDetail } from "./pages/WorkOrderDetail";
import { Profile } from "./pages/Profile";
import { EditProfile } from "./pages/EditProfile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login onLogin={() => {}} />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Rutas privadas CON Layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/work-orders" element={<WorkOrders />} />
                  <Route
                    path="/work-orders/:id"
                    element={<WorkOrderDetail />}
                  />
                  <Route
                    path="/work-orders/new"
                    element={<CreateWorkOrderNew />}
                  />
                  <Route path="/machinery" element={<Machinery />} />
                  <Route path="/machinery/:id" element={<MachineryDetail />} />
                  <Route path="/lots/:id" element={<LotDetail />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
