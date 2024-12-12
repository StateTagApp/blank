<template>

  <!--{{ tagSpecs }}-->
  <component :is="tagName(tagSpec(tagSpecs, 0))"
             :class="tagClasses(tagSpec(tagSpecs, 0))"
             v-if="isHtml"
             v-show="!_.isEmpty(tryContent) || _.isNumber(tryContent)"
             v-html=this.htmlDynamicFilters(tryContent)>
  </component>

  <component :is="tagName(tagSpec(tagSpecs, 1))"
             :class="tagClasses(tagSpec(tagSpecs, 1))"
             v-else
             v-show="!_.isEmpty(tryContent) || _.isNumber(tryContent)"
  >{{ tryContent | dynamicFilters(privateFilters) }}
  </component>

</template>

<script>
import {mapGetters} from 'vuex'
import _Services from "./_Services";

export default {
  extends: _Services,

  props: {
    fallback: {
      type: String,
      default: ''
    },

    tagSpecs: {
      type: String,
      default: "div,span"
    },

    isHtml: {
      type: Boolean,
      default: false
    },

    filters: {
      type: String,
      default: JSON.stringify([])
    }
  },

  data: function () {
    return {
      privateFilters: null
    }
  },

  methods: {
    htmlDynamicFilters: function (value) {
      console.log(value);
      return this.$options.filters
          .dynamicFilters(value, this.privateFilters);
    }
  },

  computed: {

    tryContent: function () {
      return (!_.isEmpty(this.serviceContent) || _.isNumber(this.serviceContent))
          ? this.serviceContent
          : this.fallback;
    }
  },

  mounted: function () {
    this.privateFilters = JSON.parse(this.filters);
  }

}
</script>
