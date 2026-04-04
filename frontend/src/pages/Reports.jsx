import { useEffect, useState } from "react"

function Reports() {
  const [paymentInsights, setPaymentInsights] = useState([])

  const fetchInsights = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/receipts/payment-mode-insights"
      )

      const data = await res.json()
      setPaymentInsights(data)

    } catch (error) {
      console.error("Error fetching insights")
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        📊 Reports & Insights
      </h1>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          💳 Payment Mode Insights
        </h2>

        <div className="space-y-4">
          {paymentInsights.map((item, index) => (
            <div
              key={index}
              className="flex justify-between border-b pb-2"
            >
              <span>{item.mode}</span>
              <span>
                {item.count} receipts ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Reports