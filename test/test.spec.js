const path = require('path')
const Application = require('spectron').Application
const assert = require('assert')

const app = new Application({
  path: path.join(__dirname, '../dist/mac/electron-react-template.app/Contents/MacOS/electron-react-template')
})

const verifyWindowIsVisibleWithTitle = async (app) => {
  await app.start()
  try {
    // Check if the window is visible
    const isVisible = await app.browserWindow.isVisible()
    console.log('isVisible:', isVisible)
    // Verify the window is visible
    assert.strictEqual(isVisible, true)

    // Get the window's title
    const title = await app.client.getTitle()
    console.log('title:', title)
    // Verify the window's title
    assert.strictEqual(title, 'Electron React App')
    

  } catch (error) {
    // Log any failures
    console.error('Test failed', error.message)
  }
  // Stop the application
  await app.stop()
}

verifyWindowIsVisibleWithTitle(app)