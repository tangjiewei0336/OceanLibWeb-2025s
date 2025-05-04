<template>
    <v-card class="mb-4">
      <v-card-title @click="toggleExpand" style="cursor: pointer">
        <v-icon left>{{ expanded ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
        {{ topic.title }}
        <v-chip small class="ml-2" v-if="topic.children && topic.children.length > 0">
          {{ topic.children.length }}
        </v-chip>
      </v-card-title>
      
      <v-expand-transition>
        <div v-show="expanded">
          <v-card-text>
            <div class="content">{{ topic.content }}</div>
            
            <!-- 回复区域 -->
            <div v-if="topic.reply" class="reply-section mt-4">
              <v-divider></v-divider>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>{{ topic.reply.avatar }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ topic.reply.author }}</v-list-item-title>
                  <v-list-item-subtitle>{{ topic.reply.date }}</v-list-item-subtitle>
                  <div class="reply-content mt-2">{{ topic.reply.content }}</div>
                </v-list-item-content>
              </v-list-item>
            </div>
  
            <!-- 回复按钮 -->
            <div class="text-right mt-2">
              <v-btn small @click="showReplyDialog = true">
                <v-icon small left>mdi-reply</v-icon>
                回复
              </v-btn>
            </div>
          </v-card-text>
  
          <!-- 递归渲染子话题 -->
          <div v-if="topic.children" class="ml-6">
            <topic-item 
              v-for="child in topic.children" 
              :key="child.id" 
              :topic="child"
              @reply="handleChildReply"
            />
          </div>
        </div>
      </v-expand-transition>
  
      <!-- 回复对话框 -->
      <v-dialog v-model="showReplyDialog" max-width="500">
        <v-card>
          <v-card-title>回复话题</v-card-title>
          <v-card-text>
            <v-textarea
              v-model="replyContent"
              label="回复内容"
              rows="3"
              required
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="showReplyDialog = false">取消</v-btn>
            <v-btn color="primary" @click="submitReply">提交</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </template>
  
  <script>
  export default {
    name: 'TopicItem',
    props: {
      topic: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        expanded: false,
        showReplyDialog: false,
        replyContent: ''
      }
    },
    methods: {
      toggleExpand() {
        this.expanded = !this.expanded
      },
      submitReply() {
        if (this.replyContent.trim()) {
          this.$emit('reply', {
            parentId: this.topic.id,
            content: this.replyContent
          })
          this.showReplyDialog = false
          this.replyContent = ''
        }
      },
      handleChildReply(payload) {
        this.$emit('reply', payload)
      }
    }
  }
  </script>
  
  <style scoped>
  .content {
    white-space: pre-line;
    line-height: 1.6;
  }
  
  .reply-section {
    background-color: #f9f9f9;
    border-radius: 4px;
    padding: 8px;
  }
  
  .reply-content {
    background-color: white;
    padding: 8px;
    border-radius: 4px;
    border-left: 3px solid #1976d2;
  }
  </style>