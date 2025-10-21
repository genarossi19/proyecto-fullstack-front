import { Route, Routes } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Layout } from "./layout/Layout";
import { WorkOrders } from "./pages/WorkOrders";
import { Machinery } from "./pages/Machinery";
import { Clients } from "./pages/Clients";
import { CreateWorkOrder } from "./pages/CreateWorkOrder";
function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/work-orders" element={<WorkOrders />} />
          <Route path="/work-orders/new" element={<CreateWorkOrder />} />
          <Route path="/machinery" element={<Machinery />} />
          <Route path="/clients" element={<Clients />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
