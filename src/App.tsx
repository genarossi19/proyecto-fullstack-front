import { Route, Routes } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Layout } from "./layout/Layout";
import { WorkOrders } from "./pages/WorkOrders";
import { Machinery } from "./pages/Machinery";
import { MachineryDetail } from "./pages/MachineryDetail";
import { Clients } from "./pages/Clients";
import { LotDetail } from "./pages/LotDetail";
import { CreateWorkOrder } from "./pages/CreateWorkOrder";
import { WorkOrderDetail } from "./pages/WorkOrderDetail";
function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/work-orders" element={<WorkOrders />} />
          <Route path="/work-orders/:id" element={<WorkOrderDetail />} />
          <Route path="/work-orders/new" element={<CreateWorkOrder />} />
          <Route path="/machinery" element={<Machinery />} />
          <Route path="/machinery/:id" element={<MachineryDetail />} />
          <Route path="/lots/:id" element={<LotDetail />} />
          <Route path="/clients" element={<Clients />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
