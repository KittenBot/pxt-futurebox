declare namespace pins {

    //% fixedInstance shim=pxt::getPin(3)
    const RGB: DigitalInOutPin;

    //% fixedInstance shim=pxt::getPin(49)
    const DUMMY: DigitalInOutPin;

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

/**
 * futurebox lib support
 */
//% weight=70 color=#ec7505 icon="\uf1da"
namespace futurebox {
    const DA213ADDR = 39;

    export enum Port {
        //% block="P1"
        P1 = 4,
        //% block="P2"
        P2 = 7,
        //% block="P3"
        P3 = 5,
        //% block="P4"
        P4 = 6,
    }
    export enum Motor {
        //% block="M1"
        M1 = 1,
        //% block="M2"
        M2 = 2,
    }


    //% blockId=futurebox_pixel block="Pixel"
    export function onboardPixel() {
        let s = light.createNeoPixelStrip(pins.RGB, 3)
        s._clkPin = pins.DUMMY
        return s
    }

    //% blockId=futurebox_initimu block="Imu init"
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

    //% blockId=futurebox_readimu block="Read Imu"
    export function readImu() {
        pins.i2cWriteNumber(DA213ADDR, 0x02, NumberFormat.UInt8LE);
        let data = pins.i2cReadBuffer(DA213ADDR, 6);
        let x = data.getNumber(NumberFormat.Int16LE, 0)
        let y = data.getNumber(NumberFormat.Int16LE, 2)
        let z = data.getNumber(NumberFormat.Int16LE, 4)
        return [x, y, z]
    }

    //% blockId=futurebox_motor block="Motor %motor|speed %speed"
    //% speed.min=-255 speed.max=255
    export function motorRun(motor: Motor, speed: number) {
        let p1 = 14
        let p2 = 13
        if (motor == Motor.M2) {
            p1 = 47
            p2 = 21
        }
        if (speed >= 0) {
            pins.analogWritePin(p1, speed * 16) // 256 > 4096
            pins.analogWritePin(p2, 0)
        } else {
            pins.analogWritePin(p1, 0)
            pins.analogWritePin(p2, -speed * 16)
        }
    }

    //% blockId=futurebox_geekservo block="Servo %port|angle %angle"
    //% angle.min=0 angle.max=180
    export function geekServo(port: Port, angle: number) {
        let v_us = (angle - 90) * 20 / 3 + 1500
        pins.servoSetPulse(port, v_us)
    }

}
