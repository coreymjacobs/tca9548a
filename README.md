# tca9548a
A Node.js module for the TCA9548A I2C 8-channel Multiplexer.

Bilt using node v11.9.0

This is Node.js I2C module for the TCA9548A Low-Voltage 8-Channel I2C Switch/Multiplexer. 

This module uses i2c-bus which should provide access with Node.js on Linux boards like the Raspberry Pi Zero, 1, 2, or 3B and +, BeagleBone, BeagleBone Black, or Intel Edison.

Since TCA9548A needs to talk directly to the I2C bus and requires access to /dev/i2c, you will typically need run Node with elevated privileges or add your user account to the i2c group: $ sudo adduser $USER i2c. On Raspberry PI, be sure to enable I2C protocol in system configuration before proceeding.

<h2>Example Code:</h2>

<pre><code>
//require module
//
<b>const TCA9548A = require('./tca9548a');</b>

//module is constructed via Class so first call a new instance
//device is automatically intialized and ready to use
//addr defaults to 0x70 and bus defaults to 1
//
<b>const tca9548a_1 = new TCA9548A({addr: 0x70, bus: 1});</b>

//if you have more than one TCA9548A, can call another instance
//make sure that the addr is correct!!!
//
<b>const tca9548a_2 = new TCA9548A({addr: 0x71, bus: 1});</b>


//as an example, if using two bme280 temp sensors (sensor1 and sensor2) that have the same address
//need to enable the specific multiplexer port each time you want to read from a certain device
//singlePortOn activates the port number of the argument and disables the other ports
//argument has to be a number 0-7
//
//use a callback to ensure that the port is enabled before proceeding with other processing
//
//for example, sensor1 is atached to port 2 on the multiplexer
//
<b>tca9548a_1.singlePortOn(2, doSomethingWithSensor());</b>

//then you want to read from sensor2 attached to port 6 on the multiplexer
//
<b>tca9548a_1.singlePortOn(6, doSomethingWithSensor());</b>


<b>function doSomethingWithSensor () {</b>
  //process sensor data magic
  <b>console.log('doSomethingWithSensor called');</b>
<b>}</b>



//can also enable all ports
<b>tca9548a_1.allPortsOn();</b>

//or disable all ports
<b>tca9548a_1.allPortsOff();</b>

</code></pre>
