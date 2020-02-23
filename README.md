[![npm version](https://img.shields.io/npm/v/wbm.svg?color=%2378e08f)](https://www.npmjs.com/package/wbm)

# wbm
> wbm is an API to send bulk messages in whatsapp.

<p align="center"> 
<img style="border-radius: 5px" src="https://raw.githubusercontent.com/Briuor/wbm/master/assets/demo.gif">
</p>

## Installation
```bash
> npm install wbm
```

## Usage
**At the beginning it will display a QR Code on terminal, just scan it using whatsapp app.**

### Send same message to every contact

```javascript
const wbm = require('wbm');

wbm.start().then(async () => {
    const phones = ['5535988841854', '35988841854', '5535988841854'];
    const message = 'Good Morning.';
    await wbm.send(phones, message);
})

```
### Send custom message to every contact

```javascript
const wbm = require('wbm');

wbm.start().then(async () => {
    const contacts = [{ phone: '5535988841854', name: 'Bruno', age: 21 }];
    const message = 'Hi {{name}}, your age is {{age}}';
    // it will send 'Hi Bruno, your age is 21'
    await wbm.sendCustom(contacts, message); 
});
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
    await wbm.end()
})

```

## API

### send(phones, message)

Send same message to every phone number.

##### phones
Array of phone numbers: ['5535988841854', ...].<br />
Type: `array`

##### message
Message to send to every phone number.<br />
Type: `string`

### sendCustom(contacts, message)

Send custom message to every phone number.

##### contacts
Array of contact objects created by the user(with dynamic properties)<br />
like [{phone: '5535988841854', name: 'Will', group: 'partner', age: 22', any: 'anything', ...}, ...].<br />
Type: `array`

##### message
Message prototype to send to every phone number, text with curly braces like {{text}}<br />
will be replaced by the contact property with same text name.<br />
Type: `string`

### sendTo(phone, message)

Send message to a phone number.

##### phone
Phone number: '5535988841854'.<br />
Type: `string`


##### message
Message to send to phone number.<br />
Type: `string`

## Contributing

Feel free to create pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
