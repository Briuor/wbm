const puppeteer = require("puppeteer");
const qrcode = require("qrcode-terminal");
const { default: PQueue } = require('p-queue');

const queue = new PQueue({ concurrency: 1 });

let browser = null;
let page = null;

async function start() {
    browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox"]
    });
    page = await browser.newPage();
    // prevent dialog blocking page and just accept it(necessary when a message is sent too fast)
    page.on("dialog", async dialog => {
        await dialog.accept();
    });
    // fix the chrome headless mode true issues
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    );
    page.setDefaultTimeout(60000);

    await page.goto("https://web.whatsapp.com");
    // generate QRCode
    await page.waitForSelector('div[data-ref]');
    const qrcodeData = await page.evaluate(() => {
        let qrcodeDiv = document.querySelector("div[data-ref]");
        return qrcodeDiv.getAttribute("data-ref");
    });
    qrcode.generate(qrcodeData, { small: true });
    console.log("Qrcode generated")
    await page.waitForSelector('div[data-ref]', { hidden: true });
};
async function sendTo(phone, message) {
    await page.goto("https://web.whatsapp.com/send?phone=" + phone + "&text=" + message);
    await page.waitForSelector('div[data-tab="1"]');
    await page.keyboard.press("Enter");
    console.log(phone + " sended");
}

async function send(phones, message) {
    for (let phone of phones) {
        await queue.add(() => sendTo(phone, message))
    }
}

module.exports = {
    start,
    send,
    sendTo,
}