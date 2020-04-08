[![npm version](https://img.shields.io/npm/v/wbm.svg?color=%2378e08f)](https://www.npmjs.com/package/wbm)

# wbm
> wbm is an **unofficial** API to send bulk messages in whatsapp.

<p align="center"> 
<img style="border-radius: 5px" src="https://raw.githubusercontent.com/Briuor/wbm/master/assets/demo.gif">
</p>

## Installation
```bash
> npm install wbm
```

## Usage
**At the beginning it will display a QR Code on terminal, just scan it using whatsapp app.<br />
Your session will be remembered, there is no need to authenticate everytime.**

### Send same message to every contact

```javascript
const wbm = require('wbm');

wbm.start().then(async () => {
    const phones = ['5535988841854', '35988841854', '5535988841854'];
    const message = 'Good Morning.';
    await wbm.send(phones, message);
    await wbm.end();
}).catch(err => console.log(err));

```
### Send custom message to every contact

```javascript
const wbm = require('wbm');

wbm.start().then(async () => {
    const contacts = [
        { phone: '5535988841854', name: 'Bruno', age: 21 },
        { phone: '5535988841854', name: 'Will', age: 33 }
    ];
    const message = 'Hi {{name}}, your age is {{age}}';
    // Hi Bruno, your age is 21
    // Hi Will, your age is 33
    await wbm.send(contacts, message);
    await wbm.end();
}).catch(err => console.log(err));
```

### Send custom messages using YOUR OWN RULE

```javascript
const wbm = require('wbm');

wbm.start().then(async () => {
    const contacts = [
        { phone: '5535988841854', name: 'Bruno', group: 'friend' }, 
        { phone: '5535988841854', name: 'Will', group: 'customer' }
    ];
    for (contact of contacts) {
        let message = 'hi';
        if(contact.group === 'customer') {
            message = 'Good morning ' + contact.name;
        }
        else if(contact.group === 'friend') {
            message = 'Hey ' + contact.name + '. Wassup?';
        }
        await wbm.sendTo(contact.phone, message);
    }
    await wbm.end();
}).catch(err => console.log(err));

```

## API
### start(options)
* **options**<br />
	Object containing optional parameters as attribute.<br />
	Type: `object`<br />
	* **showBrowser**<br />
	Show browser running the script.<br />
	Default: `false`<br />
	Type: `boolean`<br />
	* **qrCodeData**<br />
	Instead of generate the QR Code, returns the data used to generate the QR Code as promise.<br />
	Default: `false`<br />
	Type: `boolean`<br />
	* **session**<br />
	Keep user session, so the user must scan the QR Code once.<br />
	Default: `true`<br />
	Type: `boolean`

```javascript
// It will open a browser, return the QR code data as promise and not keep user session
wbm.start({showBrowser: true, qrCodeData: true, session: false})
.then(async qrCodeData => {
    console.log(qrCodeData); // show data used to generate QR Code
    await wbm.waitQRCode();
    // waitQRCode() is necessary when qrCodeData is true
    // ...
    await wbm.end();
} ).catch(err => { console.log(err); });
```

### send(phoneOrContacts, message)

Send message to every phone number.

- **phoneOrContacts**<br />
Array of phone numbers: ['5535988841854', ...].<br />
Or <br />
Array of contacts: [{phone: '5535988841854', name: 'Will', group: 'partner', age: 22', any: 'anything', ...}, ...]<br />
Type: `array`

- **message**<br />
Message to send to every phone number.<br />
Text inside curly braces like {{attribute}} will be replaced by the contact object respective attribute.<br />
Type: `string`

```javascript
wbm.start().then(async () => {
    const contacts = [
        {phone: '5535988841854', name: 'Bruno'},
        {phone: '5535988841854', name: 'Will'}
    ];
    await wbm.send(contacts, 'Hey {{name}}');
    // Hey Bruno
    // Hey Will
    await wbm.send(['5535988841854', '5535988841854'], 'Hey man'); 
    // Hey man
    // Hey man
    await wbm.end();
}).catch(err => { console.log(err); });
```

### sendTo(phoneOrContact, message)

Send message to a single phone number.

- **phoneOrContact**<br />
Phone number. Example '5535988841854'.<br />
Type: `string`<br />
Or
Contact object. Example: {phone: '5535988841854', name: 'Will', group: 'partner'}<br />
Type: `object`

- **message**<br />
Message to send to phone number.<br />
Text inside curly braces like {{attribute}} will be replaced by the contact object respective attribute.<br />
Type: `string`

```javascript
wbm.start().then(async () => {
    await wbm.sendTo({phone: '5535988841854', name: 'Bruno'}, 'Hey {{name}}');
    // Hey Bruno
    await wbm.sendTo('5535988841854', 'Hey man');
    // Hey man
    await wbm.end();
}).catch(err => { console.log(err); });
```

### end()
This method must be used at the end of wbm.start() to finish the browser.


## Note
**wbm** is an **unofficial** solution. It's not recommended using **wbm** in your company or for marketing purpose.

## Contributing

Feel free to create pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)