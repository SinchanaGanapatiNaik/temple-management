import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts"

function Reports() {
  const [paymentInsights, setPaymentInsights] = useState([])
  const [peakDay, setPeakDay] = useState(null)
  const [weekdayData, setWeekdayData] = useState([])
  const [monthlyTrend,setMonthlyTrend]=useState([])
const [sevaTrend, setSevaTrend] = useState([])
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
  const fetchSevaTrend = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/receipts/historical-seva-trend"
    )

    const data = await res.json()
    setSevaTrend(data)

  } catch (error) {
    console.error("Error fetching seva trend")
  }
}
  const fetchMonthlyTrend = async () => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/receipts/monthly-trend"
    )

    const data = await res.json()
    setMonthlyTrend(data)

  } catch (error) {
    console.error("Error fetching monthly trend")
  }
}
const fetchWeekdayInsights = async () => {
  const res = await fetch(
    "http://localhost:5000/api/receipts/weekday-insights"
  )

  const data = await res.json()
  setWeekdayData(data)
}
  useEffect(() => {
  fetchInsights()
  fetchWeekdayInsights()
  fetchMonthlyTrend()
  fetchSevaTrend()
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
      <div className="bg-white shadow rounded-xl p-6 mt-6">
  <h2 className="text-xl font-semibold mb-4">
    📈 Monthly Revenue Trend
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={monthlyTrend}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="revenue"
      />
    </LineChart>
  </ResponsiveContainer>
</div>
<div className="bg-white shadow rounded-xl p-6 mt-6">
  <h2 className="text-xl font-semibold mb-4">
    🔥 Historical Seva Trend
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={sevaTrend}
      layout="vertical"
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis
        dataKey="sevaName"
        type="category"
        width={120}
      />
      <Tooltip />
      <Bar dataKey="count" />
    </BarChart>
  </ResponsiveContainer>
</div>
     <div className="bg-white shadow rounded-xl p-6 mt-6">
  <h2 className="text-xl font-semibold mb-4">
    📊 Weekly Receipt Trend
  </h2>

  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={weekdayData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" />
    </BarChart>
  </ResponsiveContainer>
</div>
    </div>
  )
}

export default Reports