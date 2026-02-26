const cron = require("node-cron")
const RecurringSeva = require("../models/RecurringSeva")
const SevaExecution = require("../models/SevaExecution")

// This runs every day at 12:01 AM
cron.schedule("* * * * *", async () => {
  try {
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const year = today.getFullYear()

    console.log("Running recurring seva job for:", month, day)

    // Find all active recurring sevas for today
    const recurringSevas = await RecurringSeva.find({
      active: true,
      month,
      day,
    })

    for (const seva of recurringSevas) {
      // Check if execution already exists for this year
      const existingExecution = await SevaExecution.findOne({
        recurringSeva: seva._id,
        year,
      })

      if (!existingExecution) {
        await SevaExecution.create({
          recurringSeva: seva._id,
          devotee: seva.devotee,
          type: seva.type,
          year,
          month: seva.month,
          day: seva.day,
          includesAnnadaan: seva.includesAnnadaan,
        })

        console.log("Created execution for:", seva._id)
      }
    }
  } catch (error) {
    console.error("Recurring Seva Job Error:", error)
  }
})