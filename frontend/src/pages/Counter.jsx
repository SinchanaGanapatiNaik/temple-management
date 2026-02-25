import { useEffect, useState } from "react"

function Counter() {
  const [sevas, setSevas] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [paymentMode, setPaymentMode] = useState("CASH")
  const [total, setTotal] = useState(0)
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    fetchSevas()
  }, [])

  const fetchSevas = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sevas")
      const data = await res.json()
      setSevas(data)
    } catch (err) {
      console.error("Error fetching sevas")
    }
  }
  const addItem = (seva) => {
  const existing = selectedItems.find(
    (item) => item.sevaCatalogId === seva._id
  )

  if (existing) {
    const updated = selectedItems.map((item) =>
      item.sevaCatalogId === seva._id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
    setSelectedItems(updated)
  } else {
    setSelectedItems([
      ...selectedItems,
      {
        sevaCatalogId: seva._id,
        sevaName: seva.name,
        unitPrice: seva.price,
        quantity: 1,
      },
    ])
  }
}
const generateReceipt = async () => {
  if (selectedItems.length === 0) {
    alert("No items selected")
    return
  }

  try {
    const res = await fetch("http://localhost:5000/api/receipts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        paymentMode,
        items: selectedItems.map(item => ({
          sevaCatalogId: item.sevaCatalogId,
          quantity: item.quantity
        }))
      })
    })

    const data = await res.json()

    if (!res.ok) {
      alert("Error generating receipt")
      return
    }

    setReceipt(data)
    setSelectedItems([])
    setTimeout(() => {
  window.print()
}, 300)
  } catch (err) {
    alert("Server error")
  }
}

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Temple Counter</h1>

      <div className="bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Available Sevas</h2>
        <div className="bg-white shadow-md p-4 rounded-lg mt-6">
  <h2 className="text-lg font-semibold mb-2">Selected Items</h2>

  {selectedItems.length === 0 ? (
    <p className="text-gray-500">No items selected</p>
  ) : (
    <>
      {selectedItems.map((item) => (
        <div
          key={item.sevaCatalogId}
          className="flex justify-between border-b py-2"
        >
          <div>
            <p>{item.sevaName}</p>
            <p className="text-sm text-gray-500">
              ₹{item.unitPrice} × {item.quantity}
            </p>
          </div>
          <p className="font-medium">
            ₹{item.unitPrice * item.quantity}
          </p>
        </div>
      ))}

      <div className="flex justify-between mt-4 font-bold">
        <span>Total</span>
        <span>
          ₹
          {selectedItems.reduce(
            (sum, item) => sum + item.unitPrice * item.quantity,
            0
          )}
        </span>
      </div>
      
      <div className="mt-4">
  <label className="block mb-2 font-medium">Payment Mode</label>
  <select
    value={paymentMode}
    onChange={(e) => setPaymentMode(e.target.value)}
    className="border rounded px-3 py-2 w-full"
  >
    <option value="CASH">Cash</option>
    <option value="UPI">UPI</option>
    <option value="CARD">Card</option>
  </select>
</div>

<button
  onClick={generateReceipt}
  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
>
  Generate Receipt
</button>
    </>
    
  )}
</div>

       {sevas.map((seva) => (
  <div key={seva._id} className="flex justify-between items-center border-b py-2">
    <div>
      <p className="font-medium">{seva.name}</p>
      <p className="text-sm text-gray-500">₹{seva.price}</p>
    </div>
    <button
      onClick={() => addItem(seva)}
      className="bg-blue-500 text-white px-3 py-1 rounded"
    >
      Add
    </button>
  </div>
))}
      </div>
   {receipt && (
  <div className="print-area bg-white p-6 mt-6 rounded-lg shadow-md">
    <h2 className="text-xl font-bold text-center mb-4">
      🛕 Temple Counter Receipt
    </h2>

    <div className="mb-2">
      <p><strong>Receipt No:</strong> {receipt.receiptNumber}</p>
      <p><strong>Date:</strong> {new Date(receipt.date).toLocaleDateString()}</p>
    </div>

    <hr className="my-2" />

    {receipt.items.map((item) => (
      <div
        key={item._id}
        className="flex justify-between py-1"
      >
        <span>{item.sevaName} × {item.quantity}</span>
        <span>₹{item.lineTotal}</span>
      </div>
    ))}

    <hr className="my-2" />

    <div className="flex justify-between font-bold mt-2">
      <span>Total</span>
      <span>₹{receipt.totalAmount}</span>
    </div>

    <p className="mt-2">
      <strong>Payment Mode:</strong> {receipt.paymentMode}
    </p>

    <p className="text-center mt-4 text-sm">
      Thank you 🙏
    </p>
  </div>
)}
    </div>
  )
}

export default Counter