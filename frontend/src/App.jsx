import { Routes, Route } from "react-router-dom"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import Counter from "./pages/Counter"
import AdminLayout from "./layouts/AdminLayout"
import ProtectedRoute from "./components/ProtectedRoute"
import Recurring from "./pages/Recurring"

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
    

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="counter" element={<Counter />} />
  <Route path="devotees" element={<div>Devotees Page</div>} />


<Route path="recurring" element={<Recurring />} />
</Route>
    </Routes>
  )
}

export default App