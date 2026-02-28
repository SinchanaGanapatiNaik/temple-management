import { useEffect, useState } from "react"


function Recurring() {
  const [recurringSevas, setRecurringSevas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
const [fullName, setFullName] = useState("")
const [phone, setPhone] = useState("")
const [dateOfBirth, setDateOfBirth] = useState("")
const [type, setType] = useState("BIRTHDAY")
const [includesAnnadaan, setIncludesAnnadaan] = useState(false)
const [spouseName, setSpouseName] = useState("")

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
  const handleCancel = async (id) => {
  try {
    await fetch(
      `http://localhost:5000/api/recurring-sevas/${id}/cancel`,
      {
        method: "PUT",
      }
    )

    fetchRecurring() // refresh list
  } catch (error) {
    console.error("Error cancelling recurring seva")
  }
}
const handleCreateRecurring = async () => {
  try {
    // Step 1: Create Devotee
    const devoteeRes = await fetch("http://localhost:5000/api/devotees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
  fullName,
  phone,
  dateOfBirth,
  spouseName: type === "ANNIVERSARY" ? spouseName : undefined
}),
    })

    const devoteeData = await devoteeRes.json()

    // Step 2: Create Recurring
    await fetch("http://localhost:5000/api/recurring-sevas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        devoteeId: devoteeData._id,
        type,
        includesAnnadaan,
      }),
    })

    // Reset form
    setShowForm(false)
    setFullName("")
    setPhone("")
    setDateOfBirth("")
    setSpouseName("")
    setIncludesAnnadaan(false)

    fetchRecurring()
  } catch (error) {
    console.error("Error creating recurring seva")
  }
}

  return (
    <div>
      <h1 className="text-3xl font-bold text-amber-800 mb-6">
        🔁 Recurring Sevas
      </h1>
      <div className="flex justify-between items-center mb-6">

  <button
    onClick={() => setShowForm(!showForm)}
    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
  >
    + Add Recurring
  </button>
</div>

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
    <button
      onClick={() => handleCancel(seva._id)}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
    >
      Cancel
    </button>
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
      {showForm && (
  <div className="bg-white shadow-md rounded-xl p-6 mb-6">
    <div className="grid grid-cols-2 gap-4">

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="border rounded px-3 py-2"
      />
      {type === "ANNIVERSARY" && (
  <input
    type="text"
    placeholder="Spouse Name"
    value={spouseName}
    onChange={(e) => setSpouseName(e.target.value)}
    className="border rounded px-3 py-2"
  />
)}

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border rounded px-3 py-2"
      />

      <input
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        className="border rounded px-3 py-2"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border rounded px-3 py-2"
      >
        <option value="BIRTHDAY">Birthday</option>
        <option value="ANNIVERSARY">Anniversary</option>
      </select>

      <label className="flex items-center space-x-2 col-span-2">
        <input
          type="checkbox"
          checked={includesAnnadaan}
          onChange={(e) => setIncludesAnnadaan(e.target.checked)}
        />
        <span>Include Annadaan</span>
      </label>

    </div>

    <button
      onClick={handleCreateRecurring}
      className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
    >
      Save
    </button>
  </div>
)}
    </div>
    
  )
}

export default Recurring