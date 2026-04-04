import { useEffect, useState } from "react"

function Receipts() {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
const [totalPages, setTotalPages] = useState(1)

const fetchReceipts = async (page = 1) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/receipts?page=${page}`
    )

    const data = await res.json()

    setReceipts(data.receipts)
    setTotalPages(data.totalPages)
    setCurrentPage(data.currentPage)

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
  const handleReprint = (receipt) => {
  const printWindow = window.open("", "_blank")

  const receiptHTML = `
    <html>
      <head>
        <title>Receipt ${receipt.receiptNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h2 {
            text-align: center;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 6px 0;
          }
          hr {
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
 
        <h2>🛕 Temple Counter Receipt</h2>
        

        <p><strong>Receipt No:</strong> ${receipt.receiptNumber}</p>
        <p><strong>Date:</strong> ${new Date(receipt.date).toLocaleDateString()}</p>

        <hr/>

        ${receipt.items.map(item => `
          <div class="row">
            <span>${item.sevaName} × ${item.quantity}</span>
            <span>₹${item.lineTotal}</span>
          </div>
        `).join("")}

        <hr/>

        <div class="row">
          <strong>Total</strong>
          <strong>₹${receipt.totalAmount}</strong>
        </div>

        <p><strong>Payment Mode:</strong> ${receipt.paymentMode}</p>

        <p style="text-align:center; margin-top:20px;">
          Thank you 🙏
        </p>
      </body>
    </html>
  `

  printWindow.document.write(receiptHTML)
  printWindow.document.close()
  printWindow.print()
}
const handleExportCSV = () => {
  const headers = [
    "Receipt Number",
    "Date",
    "Amount",
    "Payment Mode"
  ]

  const rows = receipts.map((receipt) => [
    receipt.receiptNumber,
    new Date(receipt.date).toLocaleDateString(),
    receipt.totalAmount,
    receipt.paymentMode
  ])

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n")

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;"
  })

  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", "receipts.csv")

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold text-gray-800">
    📄 Receipt History
  </h1>

  <button
    onClick={handleExportCSV}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
  >
    Export CSV
  </button>
</div>

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
    <th>Action</th>
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
                  <td>
  <button
    onClick={() => handleReprint(receipt)}
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
  >
    Reprint
  </button>
</td>
                </tr>
              ))}
            </tbody>

          </table>

        )}
        

      </div>
<div className="flex gap-2 mt-4">
  {[...Array(totalPages)].map((_, index) => (
    <button
      key={index}
      onClick={() => fetchReceipts(index + 1)}
      className={`px-3 py-1 rounded ${
        currentPage === index + 1
          ? "bg-indigo-600 text-white"
          : "bg-gray-200"
      }`}
    >
      {index + 1}
    </button>
  ))}
</div>
    </div>
    
  )
}

export default Receipts