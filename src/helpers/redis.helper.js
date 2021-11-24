const redis = require("redis")
const client = redis.createClient(process.env.REDIS_URL)

client.on("error", function (error) {
  console.error(error)
})

const setJWT = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      client.set(key, value, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    } catch (err) {
      reject(err)
    }
  })
}

const getJWT = key => {
  return new Promise((resolve, reject) => {
    try {
      client.set(key, (err, res) => {
        if (err) reject(err)
        resolve(res)
      })
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = {
  setJWT,
  getJWT
}
