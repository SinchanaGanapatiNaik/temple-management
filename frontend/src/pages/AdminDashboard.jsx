import { useEffect, useState } from "react"
function AdminDashboard() {
  const [executions, setExecutions] = useState([])
const [loading, setLoading] = useState(true)
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
  return (
  <div className="min-h-screen bg-gray-100 p-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">
      🛕 Temple Admin Dashboard
    </h1>

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
                {exec.type}{" "}
                {exec.includesAnnadaan && (
                  <span className="ml-1 text-orange-600 font-medium">
                    + Annadaan
                  </span>
                )}
              </p>
            </div>

            <div>
              {exec.completed ? (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Completed
                </span>
              ) : (
                <button
                  onClick={() => markCompleted(exec._id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Mark Complete
                </button>
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