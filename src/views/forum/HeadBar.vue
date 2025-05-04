<template>
    <v-app-bar app flat height="auto" class="multi-line-bar">
      <v-container>
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              solo flat hide-details
              prepend-inner-icon="mdi-magnify"
              class="search-field"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn text class="nav-item" to="/recommend">
            <v-icon left>mdi-thumb-up</v-icon>
            <span>推荐</span>
            </v-btn>
            <v-btn text class="nav-item" to="/quick-answer">
            <v-icon left>mdi-comment-question</v-icon>
            <span>直答</span>
            </v-btn>
            <v-btn text class="nav-item" to="/notifications">
            <v-badge dot color="error">
                <v-icon left>mdi-bell</v-icon>
            </v-badge>
            <span>通知</span>
            </v-btn>
            <v-btn text class="nav-item" to="/profile">
            <v-icon left>mdi-account</v-icon>
            <span>我的</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </template>
  
  <script>
  export default {
    name: 'AppHeader'
  }
  </script>
  
  <style scoped>
  .multi-line-bar {
    height: auto !important;
  }
  
  .search-field {
    margin: 8px 0;
  }
  
  .nav-toolbar {
    display: flex;
    justify-content: space-around;
    padding: 0;
  }
  
  .nav-item {
    flex: 1;
    min-width: 0;
    text-transform: none;
  }
  
  .nav-item span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>