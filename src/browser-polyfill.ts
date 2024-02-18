const MockBrowser = require('mock-browser').mocks.MockBrowser;
const browser = new MockBrowser();

global['window'] = browser.getWindow();
global['document'] = browser.getDocument();
