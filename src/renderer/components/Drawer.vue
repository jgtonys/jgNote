<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    dark
    app
    fixed
    mobile-break-point="991"
    width="260"
  >
    <v-img
      :src="image"
      :gradient="sidebarOverlayGradiant"
      height="100%"
    >
      <v-layout
        class="fill-height"
        tag="v-list"
        column
      >
        <v-list-tile avatar>
          <v-list-tile-avatar
            color="white"
          >

          </v-list-tile-avatar>
          <v-list-tile-title class="title">
            TEST DRAWER
          </v-list-tile-title>
        </v-list-tile>
        <v-divider/>
        <v-list-tile
          v-for="(link, i) in links"
          :key="i"
          :to="link.to"
          active-class="rgba(27, 27, 27, 0.74)"
          avatar
          class="v-list-item"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title
            v-text="link.text"
          />
        </v-list-tile>
      </v-layout>
    </v-img>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  name: 'Drawer',
  data: () => ({
    logo: '~@/assets/vuetifylogo.png',
    inputValue: true,
    image: 'https://demos.creative-tim.com/vue-material-dashboard/img/sidebar-2.32103624.jpg',
    links: [
      {
        to: '/dashboard',
        icon: 'mdi-view-dashboard',
        text: 'Main'
      },
      {
        to: '/test',
        icon: 'mdi-account',
        text: '테스트'
      },
      {
        to: '/table-list',
        icon: 'mdi-clipboard-outline',
        text: '테스트'
      },
      {
        to: '/typography',
        icon: 'mdi-format-font',
        text: '테스트'
      },
      {
        to: '/icons',
        icon: 'mdi-chart-bubble',
        text: '테스트'
      },
      {
        to: '/maps',
        icon: 'mdi-map-marker',
        text: '테스트'
      },
      {
        to: '/notifications',
        icon: 'mdi-bell',
        text: '테스트'
      }
    ],
    responsive: true
  }),
  computed: {
    ...mapState('drawer', 'color', 'sidebarBackgroundColor'),
    /*inputValue: {
      get () {
        console.log("asdf");
        return this.$store.getters.getDrawerValue
      },
      set (val) {
        //this.setDrawer(val)
      }
    },*/
    items () {
      return this.$t('Layout.View.items')
    },
    sidebarOverlayGradiant () {
      return `${this.$store.state.sidebarBackgroundColor}, ${this.$store.state.sidebarBackgroundColor}`
    }
  },
  mounted () {
    //this.onResponsiveInverted()
    //window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    //window.removeEventListener('resize', this.onResponsiveInverted)
  },
  methods: {
  }
}
</script>

<style lang="scss">
  #app-drawer {
    .v-list__tile {
      border-radius: 4px;

      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }

    .v-image__image--contain {
      top: 9px;
      height: 60%;
    }

    .search-input {
      margin-bottom: 30px !important;
      padding-left: 15px;
      padding-right: 15px;
    }

    div.v-responsive.v-image > div.v-responsive__content {
      overflow-y: auto;
    }
  }
</style>
