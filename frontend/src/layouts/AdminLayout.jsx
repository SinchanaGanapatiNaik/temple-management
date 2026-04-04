import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"

function AdminLayout() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
  localStorage.removeItem("token")
  navigate("/")
}

  return (
    <div className="flex min-h-screen bg-amber-50">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold text-amber-700 mb-8">
          🛕 Temple Admin
        </h2>

        <nav className="space-y-2">

  <NavLink
    to="/admin/dashboard"
    className={({ isActive }) =>
      `block px-3 py-2 rounded-lg transition ${
        isActive
          ? "bg-amber-100 text-amber-800 font-semibold"
          : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
      }`
    }
  >
    Dashboard
  </NavLink>

  <NavLink
    to="/admin/counter"
    className={({ isActive }) =>
      `block px-3 py-2 rounded-lg transition ${
        isActive
          ? "bg-amber-100 text-amber-800 font-semibold"
          : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
      }`
    }
  >
    Counter
  </NavLink>

  <NavLink
    to="/admin/devotees"
    className={({ isActive }) =>
      `block px-3 py-2 rounded-lg transition ${
        isActive
          ? "bg-amber-100 text-amber-800 font-semibold"
          : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
      }`
    }
  >
    Devotees
  </NavLink>

  <NavLink
    to="/admin/recurring"
    className={({ isActive }) =>
      `block px-3 py-2 rounded-lg transition ${
        isActive
          ? "bg-amber-100 text-amber-800 font-semibold"
          : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
      }`
    }
  >
    Recurring Sevas
  </NavLink>
  <NavLink
    to="/admin/seva-catalog"
    className={({ isActive }) =>
      `block px-3 py-2 rounded-lg transition ${
        isActive
          ? "bg-amber-100 text-amber-800 font-semibold"
          : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
      }`
    }
  >
    Seva Catalog
  </NavLink>
  <NavLink
    to="/admin/receipts"
    className={({ isActive }) =>
      `block px-3 py-2 rounded-lg transition ${
        isActive
          ? "bg-amber-100 text-amber-800 font-semibold"
          : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
      }`
    }
  >
    Receipts
  </NavLink>
  <NavLink
  to="/admin/reports"
  className={({ isActive }) =>
    `block px-3 py-2 rounded-lg transition ${
      isActive
        ? "bg-amber-100 text-amber-800 font-semibold"
        : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
    }`
  }
>
  Reports
</NavLink>
  

</nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-end relative">
          <div
            onClick={() => setOpen(!open)}
            className="cursor-pointer bg-amber-100 px-4 py-2 rounded-full text-sm font-medium text-amber-800"
          >
            Admin ▾
          </div>

          {open && (
            <div className="absolute right-6 top-16 bg-white shadow-lg rounded-lg p-4 w-40">
              <p className="text-sm font-semibold mb-2">Role: ADMIN</p>
              <button
                onClick={handleLogout}
                className="w-full text-left text-red-600 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Content */}
        <main className="p-8">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AdminLayout