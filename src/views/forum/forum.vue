<template>
    <div class="forum">
        <AppHeader/>

        <div style="position: fixed;bottom: 0;left: 0;right: 0;">
            <v-bottom-navigation shift color="primary" grow class="index__bottom__navigation" v-model="navigation">
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
            <v-btn link to="/forum">
                <span>知乎</span>
                <v-icon>mdi-forum</v-icon>
            </v-btn>
            </v-bottom-navigation>
        </div>
    </div>
  </template>
  
  <script>
import AppHeader from './HeadBar.vue'

export default {
  components: {
    AppHeader
  }
}
</script>

  <style scoped>
  .search-row {
    padding: 8px 16px;
    background: white;
  }
  
  .search-field {
    background: #f5f5f5;
    border-radius: 20px;
  }
  
  .nav-toolbar {
    display: flex;
    justify-content: space-around;
    background: white;
    padding: 0;
  }
  
  .nav-item {
    flex: 1;
    max-width: 25%;
    min-width: 0;
    text-transform: none;
  }
  
  .nav-item span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>