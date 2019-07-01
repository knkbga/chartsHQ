<template>
  <div id="app">
    <h4 style="color:red">{{ getPrompt }}</h4>
    <div class="input-fields">
      <div class="headline-wrapper">
        <h2 class="headline">Enter list</h2>
        <p>Enter comma seperated list of numbers</p>
      </div>
      <div class="input-wrapper">
        <input @input="onChange" v-model="inputString" :disabled="getStatus==='wait'" class="input-string" type="text">
        <br>
        <button v-on:click="genRandom()">Generate<br>Random Numbers</button>
        <button v-on:click="genStats()" class="primary">Calculate<br>Statistics</button>
      </div>
    </div>
    <hr>
    <div class="output-fields" align="center">
      <div class="output-wrapper">
        <p class="output-stats">
          <span>Original Data: </span>
          <span>{{ '[' + inputString + ']' }}</span>
        </p>
        <p class="output-stats">
          <span>Mean: </span>
          <span>{{ getStats.mean }}</span>
        </p>
        <p class="output-stats">
          <span>Median: </span>
          <span>{{ getStats.median }}</span>
        </p>
        <p class="output-stats">
          <span>Variance: </span>
          <span>{{ getStats.variance }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  data() {
    return {
      stats:{
        mean: '',
        median: '',
        variance: ''
      }
    }
  },
  methods: {
    genRandom() {
      this.$store.dispatch('genRandom')
    },
    genStats() {
      if(this.inputString == '') {
        alert("Input is empty")
      } else {
        this.$store.dispatch('genStats', this.inputString)
      }
    },
    onChange(e) {
      this.$store.dispatch('updateInput', e.target.value)
    }
  },
  computed: {
    ...mapGetters([
      'getStatus',
      'getInputString',
      'getPrompt',
      'getStats'
    ]),
    formatStringToArray() {
      return '[' + this.inputString + ']'
    },
    inputString: {
      get() {
        if(this.getInputString != '')
          return this.getInputString
        else
          return ''
      },
      set(newValue) {
        inputString = newValue
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.input-fields{ 
  .input-wrapper, .headline-wrapper {
    display: inline-block;
    margin: 10px;
  }
  .headline-wrapper {
    .headline {
      text-align: left;
    }
  }
  .input-wrapper {
    button {
      display: inline-block;
      border: 0px;
      border-radius: 5px;
      margin: 7px 13px;
      cursor: pointer;
    }

    button.primary {
      background-color: #1ca3cc;
      color: #fff;
    }
  }
}

.output-fields {

  .output-wrapper {
    width: 300px;

    .output-stats {
      text-align: left;
    }
  }
  
}

</style>
