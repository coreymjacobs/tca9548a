class TCA9548A {
    constructor(options) {
        const i2c = require('i2c-bus');
        //sent from instance call
        let opts = options || {};
        //device vars
        this.device = {};
        this.device.name = (opts.hasOwnProperty('name')) ? opts.name : 'tca9548a';
        this.device.type = (opts.hasOwnProperty('type')) ? opts.type : 'I2C 8 MUX';
        this.device.bus = (opts.hasOwnProperty('bus')) ? opts.bus : 1; //default is 1
        this.device.addr = (opts.hasOwnProperty('addr')) ? opts.addr : 0x70; //default is 0x70
        //byte to write to
        this.device.cmd_byte = 1;
        //times device tried to read/write
        this.device.tries = 0;
 
        //set the bus number, call with this.bus.whatEver
        this.bus = i2c.openSync(this.device.bus);

        //shows all connected devices if you want
        //console.log('Scan:', this.bus.scanSync());

    }

/////////////////////--------------------------------//////////////////////

    async singlePortOn(arg) {
        try {
            //pulls value from the object passed to the function argument
            //checks that it is a number from 0-7
            if (isNaN(arg) || arg < 0 || arg > 7) throw new Error (`Passed parameter ${arg} is not a number between 0-7`);  
            
            //shift 1 bit to the left xx places set by passed arg
            //needs to start as 1, 00000001, then shift 1 to which bit/port from arg
            //for example, if arg=3 then result would be, 000001000
            let new_byte = 1 << arg;
            
            //set byte
            await this.setByte(new_byte);

            return true;
        }
        catch (err) {
            this.logError("singlePortOn", err);
            return false;
        }
    }

    async allPortsOn() {
        try {
            //can put 255 for decimal or 0xFF for hexadecimal
            await this.setByte(255);
            return true;
        }
        catch (err) {
            this.logError("allPortsOn", err);
            return false;
        }
    }

    async allPortsOff() {
        try {
            //can put 0 for decimal or 0x00 for hexadecimal
            await this.setByte(0);
            return true;
        }
        catch (err) {
            this.logError("allPortsOff", err);
            return false;
        }
    }


    // ------------ reads/writes -----------------------------------

    async setByte(arg) {
        try {            
            //using async callback so can see an error
            this.bus.writeByte(this.device.addr, this.device.cmd_byte, arg, (err) => {
                if (err) throw new Error ('MUX writeByte Failed!');
            });
            
            //if want to use sync method
            //this.bus.writeByteSync(this.device.addr, this.device.cmd_byte, arg);
            //await this.sleep(10);

            //if successful, set back to 0
            this.device.tries = 0;

            return 1;
        }
        catch (err) {
            this.logError("setByte", err);
            //only try 10 times
            this.device.tries++;
            if (this.device.tries < 11) {
                //pause and try again
                await this.sleep(5);
                //try again with same arg
                this.setByte(arg);
            }
            else {
                console.log('TCA9548A failed to writeByte!!!');
                return false;
            }
        }
    }

    async readByte() {
        try {
            //set empty buffer
            let buffer = Buffer.alloc(1);

            this.bus.i2cReadSync(this.device.addr, this.device.cmd_byte, buffer);

            return buffer;
        }
        catch (err) {
            console.log('TCA9548A failed to readByte!!!');
            return false;
        }
    }
    
    // ------------ general functions -----------------------------------

    sleep(millis) {
        return new Promise(resolve => setTimeout(resolve, millis));
    }

    logError(funcname, err) {
        let error_txt = `${this.device.name}, File: tca9548a_module.js, Function: ${funcname}, ${err.stack}, ERROR: ${err}`;
        console.error(error_txt);
    }

}

module.exports = TCA9548A;
