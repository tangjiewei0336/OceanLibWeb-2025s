<template>
    <v-card flat>
      <v-card-title class="text-h7">
        {{ question.title }}
      </v-card-title>
  
      <v-card-text>
        <div>
          {{ truncateAnswer(answer.content) }}
        </div>
        <v-btn 
          color="primary" 
          text 
          small
          @click="expandAnswer"
        >
          阅读全文
          <v-icon right>mdi-chevron-down</v-icon>
        </v-btn>
      </v-card-text>
  
      <v-card-actions class="px-2 pt-0">
        <v-btn 
          text 
          small
          @click="vote('up')"
        >
          <v-icon left>mdi-thumb-up</v-icon>
          {{ question.upvotes }}
        </v-btn>
        
        <v-btn 
          text 
          small
          @click="vote('down')"
        >
          <v-icon left>mdi-thumb-down</v-icon>
          {{ question.downvotes }}
        </v-btn>
        
        <v-btn 
          text 
          small
          @click="showComments"
        >
          <v-icon left>mdi-comment</v-icon>
          {{ question.commentCount }}
        </v-btn>
        
        <v-btn 
          text 
          small
          @click="like"
        >
          <v-icon left>mdi-heart</v-icon>
          {{ question.likes }}
        </v-btn>
        
        <v-btn 
          icon 
          small
          @click="showReward"
        >
          <v-icon>mdi-hand-coin</v-icon>
		  {{  }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  export default {
    name: 'ContentCard',
    data() {
      return {
        question: {
          title: "如何评价Vuetify 3.0的新特性？",
          upvotes: 124,
          downvotes: 5,
          commentCount: 32,
          likes: 89
        },
        answer: {
          content: "Vuetify 3.0带来了多项重大改进，包括：1. 完全兼容Vue 3的Composition API；2. 全新的设计系统，支持动态主题切换；3. 性能优化，组件渲染速度提升约40%；4. 新增VDataTable等实用组件...（此处省略后续内容）"
        }
      }
    },
    methods: {
      truncateAnswer(text, length = 30) {
        return text.length > length 
          ? text.substring(0, length) + '...' 
          : text
      },
      expandAnswer() {
        // 展开全文逻辑
      },
      vote(type) {
        // 赞同/反对逻辑
      },
      showComments() {
        // 显示评论逻辑
      },
      like() {
        // 点赞逻辑
      },
      showReward() {
        // 打赏逻辑
      }
    }
  }
  </script>
  
  <style scoped>
  .v-card__title {
    word-break: break-word;
    padding-bottom: 8px;
  }
  .v-card__text {
    padding-top: 0;
  }
  </style>