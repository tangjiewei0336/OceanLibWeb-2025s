<template>
    <v-bottom-navigation 
      shift 
      color="primary" 
      grow 
      class="index__bottom__navigation" 
      v-model="activeTab"
    >
      <v-btn link to="/index">
        <span>文库</span>
        <v-icon>mdi-text-box-search</v-icon>
      </v-btn>
      <v-btn link to="/wall">
        <span>互助</span>
        <v-icon>mdi-handshake</v-icon>
      </v-btn>
      <v-btn link to="/mine">
        <span>我的</span>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </template>
  
  <script>
  export default {
    name: 'BottomNavigation',
    data() {
      return {
        activeTab: 0 // 默认激活的tab索引
      }
    }
  }
  </script>