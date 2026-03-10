import { useEffect, useState } from "react"

function Receipts() {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const fetchReceipts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/receipts")
      const data = await res.json()

      setReceipts(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching receipts")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReceipts()
  }, [])

  // Filtered receipts
  const filteredReceipts = receipts
    .filter((receipt) =>
      receipt.receiptNumber
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .filter((receipt) => {
      const receiptDate = new Date(receipt.date)

      if (fromDate && receiptDate < new Date(fromDate)) return false
      if (toDate && receiptDate > new Date(toDate)) return false

      return true
    })

  // Revenue calculation
  const filteredRevenue = filteredReceipts.reduce(
    (sum, r) => sum + r.totalAmount,
    0
  )

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📄 Receipt History
      </h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search receipt number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-3 py-2 mb-4 w-full"
      />

      {/* Date Filters */}
      <div className="flex gap-6 mb-6">

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </div>

      </div>

      {/* Summary */}
      <div className="flex justify-between mb-4 text-sm text-gray-700">
        <p>
          Receipts:{" "}
          <span className="font-semibold">
            {filteredReceipts.length}
          </span>
        </p>

        <p>
          Filtered Revenue:{" "}
          <span className="font-semibold text-green-700">
            ₹{filteredRevenue}
          </span>
        </p>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl p-6">

        {loading ? (
          <p>Loading receipts...</p>
        ) : filteredReceipts.length === 0 ? (
          <p className="text-gray-500">No receipts found</p>
        ) : (

          <table className="w-full border-collapse">

            <thead>
              <tr className="border-b text-left">
                <th className="py-3">Receipt No</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Payment Mode</th>
              </tr>
            </thead>

            <tbody>
              {filteredReceipts.map((receipt) => (
                <tr
                  key={receipt._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-3 font-medium">
                    {receipt.receiptNumber}
                  </td>

                  <td>
                    {new Date(receipt.date).toLocaleDateString()}
                  </td>

                  <td className="font-semibold">
                    ₹{receipt.totalAmount}
                  </td>

                  <td>
                    {receipt.paymentMode}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        )}

      </div>

    </div>
  )
}

export default Receipts