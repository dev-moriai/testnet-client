// const https = require("https");
import https from "https"

const get = async (url, callback) => {
      "use-strict";
      https.get(url, function (result) {
            var dataQueue = "";
            result.on("data", function (dataBuffer) {
                  dataQueue += dataBuffer;
            });
            result.on("end", function () {
                  callback(dataQueue);
            });
      });
}





const post = async (url, data, auth_token) => {
      const dataString = JSON.stringify(data)

      const options = {
            method: 'POST',
            headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': dataString.length,
                  'Authorization' : auth_token
            },
            timeout: 4000, // in ms
      }

      return new Promise((resolve, reject) => {
            const req = https.request(url, options, (res) => {
                  if (res.statusCode < 200 || res.statusCode > 299) {
                        return reject(new Error(`HTTP status code ${res.statusCode}`))
                  }

                  const body = []
                  res.on('data', (chunk) => body.push(chunk))
                  res.on('end', () => {
                        const resString = Buffer.concat(body).toString()
                        resolve(resString)
                  })
            })

            req.on('error', (err) => {
                  reject(err)
            })

            req.on('timeout', () => {
                  req.destroy()
                  reject(new Error('Request time out'))
            })

            req.write(dataString)
            req.end()
      })
}


export { get, post }
// const res = await post('https://...', data)