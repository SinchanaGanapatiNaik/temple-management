import { Routes, Route } from "react-router-dom"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import Counter from "./pages/Counter"

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/counter" element={<Counter />} />
    </Routes>
  )
}

export default App