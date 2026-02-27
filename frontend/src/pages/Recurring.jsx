import { useEffect, useState } from "react"

function Recurring() {
  const [recurringSevas, setRecurringSevas] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRecurring = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/recurring-sevas")
      const data = await res.json()
      setRecurringSevas(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching recurring sevas")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecurring()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-800 mb-6">
        🔁 Recurring Sevas
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6">
        {loading ? (
          <p>Loading...</p>
        ) : recurringSevas.length === 0 ? (
          <p className="text-gray-500">No recurring sevas found</p>
        ) : (
          recurringSevas.map((seva) => (
            <div
              key={seva._id}
              className="border rounded-lg p-4 mb-4 flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {seva.devotee?.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {seva.type} — {seva.day}/{seva.month}
                </p>
                {seva.includesAnnadaan && (
                  <p className="text-sm text-amber-600 font-medium">
                    + Annadaan Included
                  </p>
                )}
              </div>

              <div>
                {seva.active ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Active
                  </span>
                ) : (
                  <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                    Cancelled
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

export default Recurring