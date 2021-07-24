const { contextBridge } = require('electron')
const { readFileSync } = require('fs')
const path = require('path');

contextBridge.exposeInMainWorld('readConfig', () => {
  const rawdata = readFileSync(path.join(__dirname, 'config.json'))
  const data = {
    ...JSON.parse(rawdata),
    chrome: process.versions['chrome'],
    node: process.versions['node'],
    electron: process.versions['electron']
  }
  
  return data
})