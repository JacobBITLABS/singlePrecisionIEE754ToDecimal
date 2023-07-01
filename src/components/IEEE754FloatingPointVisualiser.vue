<template>
  <div>
    <div class="header-div">
      <h1>IEEE 754 Singe-Precision Floating Point Converter</h1>
      <p>Convert from 754 Singe-Precision Floating Point to Decimal. See the interactive calculator below.</p>
    </div>

    <div class="input-div">
      <b-form-input
        class="text-input"
        v-on:input="bitStringToConvert = inputText; arrangeTextInput();"
        v-model="inputText"
        placeholder="Enter number to convert"
      ></b-form-input>
    </div>

    <p v-if="!inputOk" class="failInInput">Input Incorrect. Only '1' and '0' are accepted as input.</p>

    <b-container v-if="bitStringToConvert.length == 32 && inputOk" class="input-split">
      <b-row>
        <b-col class="signBit">
          {{ this.bitStringToConvert.substring(0,1) }}
          <span id="signBit" class="signBit">Sign</span>
        </b-col>
        <b-col class="exponentBits">
          {{ this.bitStringToConvert.substring(1,9) }}
          <span
            id="exponentBits"
            class="exponentBits"
          >Exponent</span>
        </b-col>
        <b-col class="mantissaBits">
          {{ this.bitStringToConvert.substring(9) }}
          <span
            id="mantissaBits"
            class="mantissaBits"
          >Mantissa</span>
        </b-col>
      </b-row>
    </b-container>

    <b-container v-if="bitStringToConvert.length == 32">
      <!-- Exponent -->
      <b-row class="cal-card-row">
        <b-col>
          <b-card id="exponent-card" class="mb-2 card">
            <p class="exponentTitle subTitle">1. Calculate the exponent (e)</p>

            <b-container class="bv-example-row">
              <b-row>
                <b-col
                  v-for="bitPosition in bitStringAsArray"
                  v-bind:key="bitPosition"
                  class="eksponent-bins"
                >{{bitPosition.bit}}</b-col>
                <div class="w-100"></div>
                <b-col
                  v-for="powerPostition in powerArray"
                  v-bind:key="powerPostition"
                  class="eksponent-bins"
                >
                  2
                  <sup>{{powerPostition.power}}</sup>
                </b-col>
              </b-row>
            </b-container>

            <p></p>
            <p v-if="bitStringToConvert.length > 0">
              All the bits representing 1 is "activating" their corresponding 2
              <sup>power</sup>
            </p>

            <div v-for="(cal,index) in calArray" v-bind:key="cal" class="calculation">
              2
              <sup>{{cal.dig}}</sup>

              <p v-if="index == calArray.length - 1" class="calculation">
                <!-- //-if="cal.digt == 0" Then we must be at the last one! meaning = -->
                =
              </p>
              <p v-else class="calculation">
                <!-- else we must be in the middle of the cal -->
                +
              </p>
            </div>
            <p
              v-if="this.calResult > 0"
              class="calculation"
              id="resultP"
            >{{calResult.toString()}} -127 = {{calResult.toString()-127}}</p>
            <p
              v-if="bitStringToConvert.length > 0"
            >We subtract 127 from the result in order to adjust for the bias. In IEEE-754 representation, the exponent is stored as an 8-bit value. When this value is 0000 0000, the actual value of the exponent is -127. When the value is 1111 1111, the actual value of the exponent is 128. This allows us to handle negative values without using two's complement</p>
          </b-card>
        </b-col>
      </b-row>
      <!-- mantissa------------------------------------------------------------------------------------------------------------------------ -->
      <b-row class="cal-card-row">
        <b-col>
          <b-card id="mantissa-card" class="mb-2 card">
            <p class="mantissaTitle subTitle">2. Calculate the mantissa (m)</p>

            <b-container class="bv-example-row">
              <b-row>
                <b-col
                  v-for="bitPosition in bitStringAsArrayM"
                  v-bind:key="bitPosition"
                  class="eksponent-bins"
                >{{bitPosition.bit}}</b-col>
                <div class="w-100"></div>
                <b-col
                  v-for="powerPostition in powerArrayMdisplay"
                  v-bind:key="powerPostition"
                  class="eksponent-bins"
                >
                  2
                  <sup>{{powerPostition.power}}</sup>
                </b-col>
              </b-row>
            </b-container>

            <p></p>
            <p v-if="bitStringToConvert.length > 0">
              All the bits representing 1 is "activating" their corresponding 2
              <sup>power</sup>
            </p>
            <div v-for="(cal,index) in calArrayM" v-bind:key="cal" class="calculation">
              2
              <sup>{{cal.dig}}</sup>

              <p v-if="index == calArrayM.length-1" class="calculation">
                <!-- //-if="cal.digt == 0" Then we must be at the last one! meaning = -->
                =
              </p>
              <p v-else class="calculation">
                <!-- else we must be in the middle of the cal -->
                +
              </p>
            </div>
            <p
              v-if="this.calResult > 0"
              class="mantissaCal calculation"
              id="resultMantissa"
            >{{ calResultM }}</p>

            <p v-if="bitStringToConvert.length > 0">
              Since the binary floating point numbers are of the from (1.{{bitStringToConvert.substring(10,32)}} x 2
              <sup>e</sup>), the mantissa represents everything after the binary point. The '1.' is implicit! It is omitted in order to save a bit internally, and that's why we have to add 1 to the mantissa below
            </p>
          </b-card>
        </b-col>
      </b-row>

      <!-- formula------------------------------------------------------------------------------------------------------------------------ -->
      <b-row class="cal-card-row">
        <b-col>
          <b-card id="formula-card" class="mb-2 card">
            <p id="formula-title" class="subTitle">3. Plug into the formula</p>
            <div class="formula-section">
              <div class="formula-details">
                (-1)
                <sup class="formula-details signBit">s</sup>
                x (1+
                <p class="formula-details mantissaTitle">m</p>)
                x 2
                <sup class="formula-details exponentTitle">e</sup>
              </div>

              <div class="formulaCal">
                (-1)
                <sup class="formula-details signBit">{{inputText.charAt(0)}}</sup>
                x (1+
                <p class="formula-details mantissaTitle">{{calResultM}}</p>)
                x 2
                <sup class="formula-details exponentTitle">{{calResult-127}}</sup>
              </div>

              <p class="calculationsFormula">
                = {{ Math.pow(-1, parseInt(inputText.charAt(0))) * (1+calResultM) }} x 2
                <sup>{{calResult-127}}</sup>
              </p>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>

  <!-- 10011000100100001000000000000000 -->
</template>

<script>
export default {
  /* eslint-disable */
  data() {
    return {
      inputText: "10011000100100001000000000000000",
      bitStringToConvert: "",
      //Eksponent variables
      bitStringAsArray: [],
      powerArray: [],
      calArray: [],
      calResult: 0,
      //Mantissa variables
      bitStringAsArrayM: [],
      powerArrayM: [],
      powerArrayMdisplay: [],
      calArrayM: [],
      calResultM: 0,
      inputOk: true,

      calculations: []
    };
  },

  methods: {
    testIEE754String(input) {
      // Try to parse the input as a floating-point number
      var number = parseFloat(input);

      // Check if the parsed number is finite and not NaN
      return isFinite(number) && !isNaN(number);
    },
    arrangeTextInput() {
      // Define the regular expression pattern
      var pattern = /^[01]{32}$/;
      //this.inputText.length == 32 && 
      if (this.inputText.length == 32) {
        if(this.testIEE754String(this.inputText)){
          this.inputOk = true;
          this.setCalsAndCalculate()
        }
      }
      else {
        this.inputOk = false;

      }
    },
    setCalsAndCalculate() {
      //Eksponent ---------------------------------------------------
      this.bitStringAsArray = [];
      this.powerArray = [];
      this.calArray = [];
      this.calculation = [];
      this.calResult = 0;

      //make the bit-string to convert, by cutting it out of input
      var exponentBitStringToConvert = this.bitStringToConvert.substring(1, 9);
      //split the string into the bitStringAsArray for repreæsetnation
      var bitArr = exponentBitStringToConvert.split("");

      //put the splitted bitstring into an array for illustration by vue!
      for (var i = 0; i < bitArr.length; i++) {
        var currentBit = bitArr[i];
        this.bitStringAsArray.push({ bit: currentBit });
      }

      //put the numbers corresponding to the bits into the array of 2^power
      var lengthOfBitstring = exponentBitStringToConvert.length;
      while (lengthOfBitstring > 0) {
        this.powerArray.push({ power: lengthOfBitstring - 1 });
        lengthOfBitstring = lengthOfBitstring - 1;
      }

      //setting the two arrays together to put into table **TABLE COLUMN**
      for (var i = 0; i < bitArr.length; i++) {
        var bit = bitArr[i];
        var bitPow = this.powerArray[i];
        //add to column
        this.calculations.push({ bit: bitPow });
      }

      //make the calculation and construct the string explaining the result!
      for (var i = 0; i < bitArr.length; i++) {
        if (bitArr[i].toString() == "1") {
          this.calArray.push({ dig: this.powerArray[i].power });
          this.calResult += Math.pow(2, this.powerArray[i].power);
        }
      }

      //Mantissa ----------------------------------------------------------
      this.bitStringAsArrayM = [];
      this.powerArrayM = [];
      this.powerArrayMdisplay = [];
      this.calArrayM = [];
      this.calculationM = [];
      this.calResultM = 0;

      //make the bit-string to convert, by cutting it out of input
      var exponentBitStringToConvertM = this.bitStringToConvert.substring(
        9,
        32
      );
      //split the string into the bitStringAsArray for repreæsetnation
      var bitArrM = exponentBitStringToConvertM.split("");

      //lets found out how long we need to go by the bit arr (if there is only zeros as the last onces they mean nothing)
      var arrayL = bitArrM.length;
      var reelLengthOfArr = null;
      var foundLastOneInArr = false;

      while (foundLastOneInArr == false) {
        if (bitArrM[arrayL] == "1") {
          reelLengthOfArr = arrayL;
          foundLastOneInArr = true;
        } else {
          arrayL = arrayL - 1;
        }
      }

      //Put the splitted bitstring into an array for illustration by vue!
      for (var i = 0; i <= arrayL; i++) {
        var currentBit = bitArrM[i];
        this.bitStringAsArrayM.push({ bit: currentBit });
      }

      //put the numbers corresponding to the bits into the array of 2^power
      var lengthOfBitstringM = exponentBitStringToConvertM.length;
      for (var i = 0; i <= arrayL; i++) {
        this.powerArrayM.push({ power: i + 1 });
        this.powerArrayMdisplay.push({ power: (i + 1) * -1 });
      }

      //make the calculation and construct the string explaining the result!
      for (var i = 0; i <= arrayL; i++) {
        if (bitArrM[i].toString() == "1") {
          this.calArrayM.push({ dig: this.powerArrayM[i].power * -1 });
          this.calResultM += 1 / Math.pow(2, this.powerArrayM[i].power); // 1/2^n = 2^-
        }
      }
    }
  },
  // mounted() {
  //   this.arrangeTextInput();
  // }
};
</script>



<style>
.failInInput {
  margin-top: 20px;
  color: rgb(175, 141, 17);
  font-size: 40px;
  font-weight: 600;
}

.eksponent-bins {
  font-size: 22px;
  border: 0.2px solid rgba(185, 185, 185, 0.8);
}

.formulaCal {
  display: block;
  font-weight: 300;
  font-size: 25px;
}

.formula-details {
  display: inline-block;
  font-weight: 300;
  font-size: 25px;
}
.calculationsFormula {
  display: block;
  font-weight: 300;
  font-size: 25px;
}
.formula-section {
  text-align: center;
}
#formula-title {
  color: black;
}
#formula-card {
  border-color: black;
}
#resultMantissa {
  color: rgb(41, 91, 228);
}

#mantissaBits {
  font-weight: 200;
  font-size: 20px;
  display: block;
}
#exponentBits {
  font-weight: 200;
  font-size: 20px;
  display: block;
}
#signBit {
  font-weight: 200;
  font-size: 20px;
  display: block;
}
.mantissaBits {
  color: rgb(41, 91, 228);
}
.exponentBits {
  color: rgb(175, 141, 17);
}
.signBit {
  color: rgb(87, 183, 70);
}
.mantissaTitle {
  color: rgb(41, 91, 228);
}
.exponentTitle {
  color: rgb(175, 141, 17);
}
.subTitle {
  font-size: 22px;
  text-align: left;
  font-weight: 200;
}
#mantissa-card {
  border-color: rgb(41, 91, 228);
}
#exponent-card {
  border-color: rgb(175, 141, 17);
}
.card-exponent {
  text-align: center;
  width: 70%;
  display: block;
  margin: 0 auto; /* Added */
  float: none; /* Added */
  margin-bottom: 100px; /* Added */
}
.cal-card-row {
  text-align: center;
  width: 70%;
  margin: auto;
  margin-bottom: 40px;
}
.input-split {
  text-align: center;
  font-weight: 300;
  font-size: 40px;
  margin-top: 20px;
  margin-bottom: 30px;
}
.text-input {
  text-align: center;
  width: 70%;
  display: inline-block;
  margin: 0, auto;
}
.input-div {
  text-align: center;
  width: 60%;
  margin: auto;
}

.header-div {
  margin-top: 100px;
}
#resultP {
  color: #f1af36;
  font-size: 30px;
  font-weight: 300;
}

.calculation {
  font-size: 30px;
  font-weight: 300;
  display: inline-block;
}

#numberToConvert {
  margin-top: 10px;
  font-size: 40px;
  font-weight: 800;
}

.result {
  margin-top: 10px;
  font-size: 40px;
  font-weight: 800;
  color: #f1af36;
}
</style>