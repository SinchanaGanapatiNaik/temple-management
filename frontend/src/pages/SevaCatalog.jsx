import { useEffect, useState } from "react"

function SevaCatalog() {
  const [sevas, setSevas] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [showExisting, setShowExisting] = useState(false)

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [search, setSearch] = useState("")

  const fetchSevas = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sevas")
      const data = await res.json()

      console.log("SEVAS FROM API:", data)

      setSevas(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching sevas")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSevas()
  }, [])

  const handleAddSeva = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sevas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price,
        }),
      })

      if (res.ok) {
        setName("")
        setPrice("")
        fetchSevas()
        setShowModal(false)
      }
    } catch (error) {
      console.error("Error adding seva")
    }
  }

  const toggleSevaStatus = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/sevas/${id}/toggle`, {
        method: "PUT",
      })

      fetchSevas()
    } catch (error) {
      console.error("Error toggling seva")
    }
  }

  const inactiveSevas = sevas.filter((s) => !s.active)

  const filteredInactive = inactiveSevas.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const restoreSeva = async (id) => {
    await toggleSevaStatus(id)
    setShowModal(false)
  }

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          🛕 Seva Catalog
        </h1>

        <button
          onClick={() => {
            setShowModal(true)
            setShowExisting(false)
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Seva
        </button>
      </div>

      {/* Active Seva List */}
      {loading ? (
        <p>Loading...</p>
      ) : sevas.filter((s) => s.active).length === 0 ? (
        <p>No active sevas</p>
      ) : (
        <div className="space-y-4">

          {sevas
            .filter((seva) => seva.active)
            .map((seva) => (
              <div
                key={seva._id}
                className="flex justify-between items-center border p-4 rounded"
              >
                <div>
                  <p className="font-semibold">{seva.name}</p>
                  <p className="text-gray-500">₹{seva.price}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    Active
                  </span>

                  <button
                    onClick={() => toggleSevaStatus(seva._id)}
                    className="text-sm bg-gray-800 text-white px-3 py-1 rounded"
                  >
                    Disable
                  </button>
                </div>
              </div>
            ))}

        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

          <div className="bg-white rounded-xl shadow-lg p-6 w-[500px]">

            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {showExisting ? "Restore Existing Seva" : "Add New Seva"}
              </h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            {/* Add New Seva */}
            {!showExisting && (
              <>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    placeholder="Seva name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded w-1/2"
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="border p-2 rounded w-1/3"
                  />

                  <button
                    onClick={handleAddSeva}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>

                <button
                  onClick={() => setShowExisting(true)}
                  className="text-indigo-600 text-sm"
                >
                  Add existing seva instead?
                </button>
              </>
            )}

            {/* Restore Existing */}
            {showExisting && (
              <>
                <input
                  type="text"
                  placeholder="Search inactive sevas"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border p-2 rounded w-full mb-4"
                />

                <div className="space-y-3 max-h-60 overflow-y-auto">

                  {(search.length > 0
                    ? filteredInactive
                    : inactiveSevas.slice(0, 4)
                  ).map((seva) => (
                    <div
                      key={seva._id}
                      className="flex justify-between items-center border p-3 rounded"
                    >
                      <span>{seva.name}</span>

                      <button
                        onClick={() => restoreSeva(seva._id)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Restore
                      </button>
                    </div>
                  ))}

                  {inactiveSevas.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      No inactive sevas
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setShowExisting(false)}
                  className="text-indigo-600 text-sm mt-4"
                >
                  Back to add new
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default SevaCatalog