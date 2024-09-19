import { get, post } from "./methods.js"
import fs from 'fs'
import CryptoJS from "crypto-js";
import dotenv from 'dotenv'
dotenv.config()

const baseURL = "https://mori-testnet.mtshby.com/"
// let dotenv = require('dotenv').config()
// // Check if the server is alive
async function test() {
      await get(baseURL + "test", function (data) {
            let result = JSON.parse(data)
            console.log(result)
      });
}



// Get the Authentication token
async function login(password) {
      await get(baseURL + "login?password=" + password, function (data) {
            let result = JSON.parse(data)
            console.log(result)

            if (result.status == 'error') {
                  console.error('Login failed: ' + result.msg)

            } else {
                  fs.writeFileSync('auth-token.json', JSON.stringify({
                        auth_token: result.token
                  }))
            }
      });
}



// Get all tickets
async function getAllPayRequests() {
      await get(baseURL + "allPay", function (data) {
            let result = JSON.parse(data)
            console.log(result)

            // This specific parameter returns the event_id
            console.log(result.data[0].result)

            //It can be used as the transaction receipt. 
            // Example:
            let viewer = 'https://testnet.tonviewer.com/transaction/'
            console.log('To see more on ' + viewer + result.data[0].result.event_id)
      });
}



// Get ticket by ticketId
async function getRequestStatus(ticketId) {
      await get(baseURL + "getTicketById?ticketId=" + ticketId, function (data) {
            let result = JSON.parse(data)
            console.log(result)

            // This specific parameter returns the event_id
            console.log(result.data.result)

            //It can be used as the transaction receipt. 
            // Example:
            let viewer = 'https://testnet.tonviewer.com/transaction/'
            console.log('To see more on ' + viewer + result.data.result.event_id)
      });
}

// Post a Pay request
async function sendPayRequest(address, amount) {
      // puuling the auth toen
      let rawData = fs.readFileSync('auth-token.json')
      let token = 'bearer ' + JSON.parse(rawData).auth_token
      //console.log(token)

      //generating a unique ticket id
      let ticketId = 'T' + Date.now(); // will be something like T1726502537896

      // forming the ticket
      let ticket = {
            ticketId: ticketId,
            address: address,
            amount: amount
      }

      // encrypting the ticket
      let ticketString = JSON.stringify(ticket)
      let encrypted = CryptoJS.AES.encrypt(ticketString, process.env.SECRET);
      let encryptedString = encrypted.toString()


      // defining the request body
      let body = { encryptedTicket: encryptedString }

      //sending the request
      let result = await post(baseURL + "sendticket", body, token);
      console.log("result: ")
      console.log(result)






}




// test()
// await login('')
// getAllPayRequests()
// getRequestStatus('T1726733947388')
// sendPayRequest('0QAWlM-TfzMBM6upSg6vfsy8WZirJkJFusRVPL75JD6gn-wG', 11)

