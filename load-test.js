import http from "k6/http"
import { sleep, check } from "k6"

export let options = {
  stages: [
    { duration: "10s", target: 1000 },   // ramp up to 1k users
    { duration: "20s", target: 10000 },  // ramp up to 10k users
    { duration: "20s", target: 50000 },  // ramp up to 50k users
    { duration: "10s", target: 0 },      // ramp down
  ]
}

export default function () {
  // test login endpoint
  const loginRes = http.post(
    "http://localhost:5000/api/auth/login",
    JSON.stringify({ email: "sidd@test.com", password: "123456" }),
    { headers: { "Content-Type": "application/json" } }
  )

  check(loginRes, {
    "login status 200": (r) => r.status === 200,
  })

  sleep(1)
}

//mongod --dbpath "C:\data\db"
// sudo service redis-server start