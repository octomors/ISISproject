import mongoose from 'mongoose'
import { Task } from '../src/models'
import { config } from '../src/config'

async function run() {
  if (!config.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set')
  }

  await mongoose.connect(config.MONGODB_URI)

  const query = {
    $or: [{ title: { $exists: false } }, { programmingLanguage: { $exists: false } }],
  }

  const before = await Task.countDocuments(query)
  const result = await Task.deleteMany(query)
  const after = await Task.countDocuments(query)

  console.log(`invalid tasks before: ${before}`)
  console.log(`deleted: ${result.deletedCount ?? 0}`)
  console.log(`invalid tasks after: ${after}`)

  await mongoose.disconnect()
}

run().catch((error) => {
  console.error('cleanup failed', error)
  process.exit(1)
})
