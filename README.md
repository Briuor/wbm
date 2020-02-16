
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
    const phones = ['5535988841854'];
    const message = "good morning";
    await wbm.send(phones, message);
})

```
### Send custom message to every contact

```javascript
const wbm = require('wbm');

wbm.start().then(async () => {
    const contacts = [{ phone: '5535988841854', name: 'Bruno' }];
    for (contact of contacts) {
        let message = 'good morning ' + contact.name;
        await wbm.sendTo(contact.phone, message);
    }
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

### sendTo(phone, message)

Send message to a phone number.

##### phone
Phone number: '5535988841854'.<br />
Type: `string`


##### message
Message to send to phone number.<br />
Type: `string`

## License

[MIT](https://choosealicense.com/licenses/mit/)
