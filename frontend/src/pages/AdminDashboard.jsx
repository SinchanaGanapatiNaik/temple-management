import { useEffect, useState } from "react"

function AdminDashboard() {

  const [executions, setExecutions] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/receipts/stats")
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats")
    }
  }

  const fetchTodayExecutions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/executions/today")
      const data = await res.json()
      setExecutions(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching executions")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodayExecutions()
    fetchStats()
  }, [])

  const markCompleted = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/executions/${id}/complete`, {
        method: "PUT",
      })
      fetchTodayExecutions()
    } catch (error) {
      console.error("Error updating execution")
    }
  }

  const handleMarkPaid = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/executions/${id}/mark-paid`, {
        method: "PUT",
      })
      fetchTodayExecutions()
    } catch (error) {
      console.error("Error marking as paid")
    }
  }

  const totalSevas = executions.length

  const pendingPayments = executions.filter(
    (e) => e.paymentStatus === "PENDING"
  ).length

  const completedSevas = executions.filter(
    (e) => e.completed === true
  ).length

  /* -------- Seva Analytics -------- */

  const sevaAnalytics = {}

  executions.forEach((e) => {
    const key = e.type
    sevaAnalytics[key] = (sevaAnalytics[key] || 0) + 1
  })

  const sortedSevas = Object.entries(sevaAnalytics).sort(
    (a, b) => b[1] - a[1]
  )

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        🛕 Temple Admin Dashboard
      </h1>

      {/* Revenue Stats */}

      {stats && (
        <div className="grid grid-cols-4 gap-6 mb-8">

          <div className="bg-white shadow rounded-xl p-6">
            <p className="text-gray-500 text-sm">Today's Revenue</p>
            <p className="text-3xl font-bold text-green-600">
              ₹ {stats.todayRevenue}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <p className="text-gray-500 text-sm">Today's Receipts</p>
            <p className="text-3xl font-bold text-gray-800">
              {stats.todayReceipts}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <p className="text-gray-500 text-sm">This Month Revenue</p>
            <p className="text-3xl font-bold text-indigo-600">
              ₹ {stats.monthRevenue}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <p className="text-gray-500 text-sm">Total Receipts</p>
            <p className="text-3xl font-bold text-gray-800">
              {stats.totalReceipts}
            </p>
          </div>

        </div>
      )}

      {/* Seva Status Cards */}

      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500 text-sm">Sevas Today</p>
          <p className="text-3xl font-bold text-gray-800">
            {totalSevas}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500 text-sm">Pending Payments</p>
          <p className="text-3xl font-bold text-yellow-600">
            {pendingPayments}
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-6">
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-3xl font-bold text-green-600">
            {completedSevas}
          </p>
        </div>

      </div>

      {/* Seva Analytics */}

      <div className="bg-white shadow rounded-xl p-6 mb-8">

        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          📊 Top Sevas Today
        </h2>

        {sortedSevas.length === 0 ? (
          <p className="text-gray-500">No sevas today</p>
        ) : (
          sortedSevas.map(([seva, count]) => (
            <div
              key={seva}
              className="flex justify-between border-b py-2"
            >
              <span>{seva}</span>
              <span className="font-semibold">{count}</span>
            </div>
          ))
        )}

      </div>

      {/* Today's Sevas */}

      <div className="bg-white shadow-lg rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Today's Sevas
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : executions.length === 0 ? (
          <p className="text-gray-500">No sevas scheduled for today</p>
        ) : (
          executions.map((exec) => (
            <div
              key={exec._id}
              className="border rounded-lg p-4 mb-4 flex justify-between items-center hover:shadow-md transition"
            >

              <div>

                <p className="text-lg font-semibold text-gray-800">
                  {exec.devotee.fullName}
                </p>

                <p className="text-sm text-gray-600">
                  {exec.type}
                  {exec.includesAnnadaan && (
                    <span className="ml-1 text-orange-600 font-medium">
                      + Annadaan
                    </span>
                  )}
                </p>

                <div className="mt-2">
                  {exec.paymentStatus === "PAID" ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      Paid
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      Payment Pending
                    </span>
                  )}
                </div>

              </div>

              <div className="flex flex-col items-end space-y-2">

                {exec.paymentStatus === "PENDING" && (
                  <button
                    onClick={() => handleMarkPaid(exec._id)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Mark as Paid
                  </button>
                )}

                {exec.paymentStatus === "PAID" && !exec.completed && (
                  <button
                    onClick={() => markCompleted(exec._id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    Mark Complete
                  </button>
                )}

                {exec.completed && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Completed
                  </span>
                )}

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  )
}

export default AdminDashboard