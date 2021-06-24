<template>
  <div class="main">
    <div class="container mt-5 border border-primary rounded border-sm p-4">
      <div class="w-25">
        <h1 class="text-primary">Colors</h1>
        <hr class="mt-0">
      </div>

      <div class="mb-3">
        <div>Welcome to the color generator!</div>
        <div>To get started, click the active color button or type in a hex code in the input field below.</div>
        <div>Have fun!</div>
      </div>

      <b-card-group deck>
        <b-card class="color-card" border-variant="light">
          <b-card-header class="text-on-primary bg-primary">Color list</b-card-header>

          <b-list-group>
            <draggable v-model="colors" handle=".handle">
              <b-list-group-item v-for="(color, index) in colors" :key="index"
                                 @click="storeCurrentAndSetNewActiveColor(color)"
                                 ref="colorCardItem">
                <b-icon-list class="mr-2 text-dark handle"></b-icon-list>

                <span
                    :style="{color: `#${color}`}"
                    :class="{'font-weight-bold': color === activeColor}">
                  #{{ color }}
                </span>

                <b-icon-arrow-left class="ml-2 text-primary" v-if="color === activeColor"></b-icon-arrow-left>
              </b-list-group-item>
            </draggable>
          </b-list-group>

          <b-form @submit.prevent="onColorFormSubmit" class="mt-2">
            <div class="d-flex align-items-center">
              <b-input-group prepend="#">
                <b-form-input
                    v-model="colorInput"
                    :formatter="colorInputFormatter"
                    @focus="colorFormError = null"
                    maxlength="6" placeholder="888 or 888888">
                </b-form-input>
              </b-input-group>

              <b-button class="ml-2" type="submit" variant="outline-primary">Add</b-button>
            </div>

            <small v-if="colorFormError" class="text-danger">{{ colorFormError }}</small>
          </b-form>
        </b-card>

        <b-card class="button-card" border-variant="light">
          <b-card-header class="text-on-primary bg-primary">
            Active color
          </b-card-header>

          <b-card-body class="d-flex flex-column justify-content-center align-items-center">
            <b-button variant="outline-primary" @click="onColorButtonClick">
              <div class="d-flex align-items-center">
                {{ colorButtonText }}
                <b-spinner small class="ml-2" v-if="loading"></b-spinner>
              </div>
            </b-button>

            <div>
              <small v-if="fetchColorError" class="text-danger">{{ fetchColorError }}</small>
            </div>
          </b-card-body>
        </b-card>
      </b-card-group>

      <small class="d-flex justify-content-end text-primary mt-4">&copy;Nikola Lenert for Dept – Jun 2021</small>
    </div>
  </div>
</template>

<script>
import {fetchRandomColor} from "@/http";
import {BIconArrowLeft, BIconList} from 'bootstrap-vue'
import draggable from 'vuedraggable'

const COLOR_FORM_ERROR = 'Invalid hex code, please check and try again'
const FETCH_COLOR_ERROR = 'Couldn\'t fetch color, please try again'
const DEFAULT_COLOR = 'aab1d0'

export default {
  name: 'App',
  components: {BIconArrowLeft, BIconList, draggable},
  data() {
    return {
      colors: [],
      loading: false,
      activeColor: DEFAULT_COLOR,
      colorInput: null,
      colorFormError: null,
      fetchColorError: null
    }
  },
  computed: {
    colorInputHex() {
      return this.colorInput ? `#${this.colorInput}` : null
    },
    activeColorHex() {
      return this.activeColor ? `#${this.activeColor}` : null
    },
    colorButtonText() {
      return this.colorInputHex || this.activeColorHex || `Click me`
    }
  },
  methods: {
    // fetch random color, add it to the list and set it as active
    onColorButtonClick() {
      this.fetchColorError = null
      this.colorFormError = null
      this.colorInput = null

      if (this.loading) {
        return
      }

      this.loading = true
      fetchRandomColor().then(response => {
        //handles case when we get a status 200 response but the hex on the color object is empty
        if (!response.data || !response.data.new_color) {
          this.fetchColorError = FETCH_COLOR_ERROR
          return
        }
        this.storeCurrentAndSetNewActiveColor(response.data.new_color)
      }, error => this.fetchColorError = FETCH_COLOR_ERROR).finally(() => this.loading = false)
    },
    onColorFormSubmit() {
      this.colorFormError = null

      if (!this.colorInput || this.colorInput.length % 3 !== 0 || this.colorInput.length > 6 || /[^a-f0-9]/.test(this.colorInput)) {
        this.colorFormError = COLOR_FORM_ERROR
        return
      }

      const color = this.colorInput.length === 6
          ? this.colorInput
          : this.colorInput.split('').reduce((result, current) => {
            result += `${current}${current}`
            return result
          }, '')

      this.storeCurrentAndSetNewActiveColor(color)
      this.colorInput = null
    },
    storeCurrentAndSetNewActiveColor(color) {
      // add the previous color to list if it doesn't exist
      if (!this.colors.find(el => el === this.activeColor)) {
        this.colors.push(this.activeColor)
      }

      this.activeColor = color
      document.documentElement.style.setProperty('--primary', `#${color}`);

      // scroll to existing active color or end of the list
      const activeColorIndex = this.colors.findIndex(el => el === this.activeColor)
      this.$nextTick(() => {
        this.$refs.colorCardItem[activeColorIndex > -1 ? activeColorIndex : this.colors.length - 1].scrollIntoView({behavior: 'smooth'})
      })
    },
    colorInputFormatter(value) {
      return value ? value.replace(/[^a-fA-f0-9]+/g, '').toLowerCase() : null
    },
  }
}
</script>

<style lang="scss">
@import "./src/assets/styles";
</style>
