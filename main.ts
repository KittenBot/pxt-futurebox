declare namespace pins {

    //% fixedInstance shim=pxt::getPin(3)
    const RGB: DigitalInOutPin;

    //% fixedInstance shim=pxt::getPin(49)
    const DUMMY: DigitalInOutPin;

    /**
     * Read `size` bytes from a 7-bit I2C `address`.
     */
    //% shim=pins::i2cReadBuffer
    // function i2cReadBuffer(address: int32, size: int32, repeat?: boolean): Buffer;

    /**
     * Write bytes to a 7-bit I2C `address`.
     */
    //% shim=pins::i2cWriteBuffer
    // function i2cWriteBuffer(address: int32, buf: Buffer, repeat?: boolean): int32;


    /**
     * Read the specified pin or connector as either 0 or 1
     * @param name pin to read from, eg: DigitalPin.P0
     */
    //% help=pins/digital-read-pin weight=30
    //% blockId=device_get_digital_pin block="digital read|pin %name" blockGap=8
    //% name.shadow=digital_pin shim=pins::digitalReadPin
    // function digitalReadPin(name: int32): int32;

    /**
     * Set a pin or connector value to either 0 or 1.
     * @param name pin to write to, eg: DigitalPin.P0
     * @param value value to set on the pin, 1 eg,0
     */
    //% help=pins/digital-write-pin weight=29
    //% blockId=device_set_digital_pin block="digital write|pin %name|to %value"
    //% value.min=0 value.max=1
    //% name.shadow=digital_pin shim=pins::digitalWritePin
    // function digitalWritePin(name: int32, value: int32): void;

    /**
     * Read the connector value as analog, that is, as a value comprised between 0 and 1023.
     * @param name pin to write to, eg: AnalogPin.P0
     */
    //% help=pins/analog-read-pin weight=25
    //% blockId=device_get_analog_pin block="analog read|pin %name" blockGap="8"
    //% name.shadow=analog_pin shim=pins::analogReadPin
    // function analogReadPin(name: int32): int32;

    /**
     * Set the connector value as analog. Value must be comprised between 0 and 1023.
     * @param name pin name to write to, eg: AnalogPin.P0
     * @param value value to write to the pin between ``0`` and ``1023``. eg:1023,0
     */
    //% help=pins/analog-write-pin weight=24
    //% blockId=device_set_analog_pin block="analog write|pin %name|to %value" blockGap=8
    //% value.min=0 value.max=1023
    //% name.shadow=analog_pin shim=pins::analogWritePin
    // function analogWritePin(name: int32, value: int32): void;

    /**
     * Configure the pull direction of of a pin.
     * @param name pin to set the pull mode on, eg: DigitalPin.P0
     * @param pull one of the mbed pull configurations, eg: PinPullMode.PullUp
     */
    //% help=pins/set-pull advanced=true
    //% blockId=device_set_pull block="set pull|pin %pin|to %pull"
    //% pin.shadow=digital_pin
    //% group="Pins"
    //% weight=15
    //% blockGap=8 shim=pins::setPull
    // function setPull(name: int32, pull: PinPullMode): void;

    /**
     * Configure the pulse-width modulation (PWM) period of the analog output in microseconds.
     * If this pin is not configured as an analog output (using `analog write pin`), the operation has no effect.
     * @param name analog pin to set period to, eg: AnalogPin.P0
     * @param micros period in microseconds. eg:20000
     */
    //% help=pins/analog-set-period weight=23 blockGap=8
    //% blockId=device_set_analog_period block="analog set period|pin %pin|to (µs)%micros"
    //% pin.shadow=analog_pin shim=pins::analogSetPeriod
    function analogSetPeriod(name: int32, micros: int32): void;

    /**
     * Configure the IO pin as an analog/pwm output and set a pulse width. The period is 20 ms period and the pulse width is set based on the value given in **microseconds** or `1/1000` milliseconds.
     * @param name pin name
     * @param micros pulse duration in microseconds, eg:1500
     */
    //% help=pins/servo-set-pulse weight=19
    //% blockId=device_set_servo_pulse block="servo set pulse|pin %value|to (µs) %micros"
    //% value.shadow=analog_pin
    //% group="Servo" shim=pins::servoSetPulse
    function servoSetPulse(name: int32, micros: int32): void;

}
namespace futurebox {
    const DA213ADDR = 39;

    export function onboardPixel() {
        let s = light.createNeoPixelStrip(pins.RGB, 3)
        s._clkPin = pins.DUMMY
        return s
    }

    export function initImu() {
        // init da213
        const DA213ADDR2 = 39
        pins.i2cWriteRegister(DA213ADDR2, 0x7f, 0x83)
        pins.i2cWriteRegister(DA213ADDR2, 0x7f, 0x69)
        pins.i2cWriteRegister(DA213ADDR2, 0x7f, 0xbd)
        let a = pins.i2cReadRegister(DA213ADDR2, 0x8e)
        if (a == 0) {
            pins.i2cWriteRegister(DA213ADDR2, 0x8e, 0x50)
        }
        pins.i2cWriteRegister(DA213ADDR2, 0x0f, 0x40)
        pins.i2cWriteRegister(DA213ADDR2, 0x20, 0x00)
        pins.i2cWriteRegister(DA213ADDR2, 0x11, 0x34)
        pins.i2cWriteRegister(DA213ADDR2, 0x10, 0x07)
        pins.i2cWriteRegister(DA213ADDR2, 0x1a, 0x04)
        pins.i2cWriteRegister(DA213ADDR2, 0x15, 0x04)
    }

    export function readImu() {
        pins.i2cWriteNumber(DA213ADDR, 0x02, NumberFormat.UInt8LE);
        let data = pins.i2cReadBuffer(DA213ADDR, 6);
        let x = data.getNumber(NumberFormat.Int16LE, 0)
        let y = data.getNumber(NumberFormat.Int16LE, 2)
        let z = data.getNumber(NumberFormat.Int16LE, 4)
        return [x, y, z]
    }

}
declare const enum Port {
    //% block="P1"
    P1 = 4,
    //% block="P2"
    P2 = 7,
    //% block="P3"
    P3 = 5,
    //% block="P4"
    P4 = 6,
}
declare const enum Motor {
    //% block="M1"
    M1 = 1,
    //% block="M2"
    M2 = 2,
}
