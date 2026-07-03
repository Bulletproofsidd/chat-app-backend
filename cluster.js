const cluster = require("cluster")
const os = require("os")

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length
  console.log(`Master process running, forking ${cpuCount} workers`)
  
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork()
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.id} died, restarting...`)
    cluster.fork()
  })
} else {
  require("./server.js")
}