<template>
    <div class="forum">
        <v-app-bar app fixed color="white" elevation="1" height="64">
            <AppHeader />
        </v-app-bar>
      
        <v-main class="scrollable-content">
            <v-container class="mt-4">
                <topic-item 
                v-for="topic in topics" 
                :key="topic.id" 
                :topic="topic"
                @reply="handleReply"
                />
                
                <!-- 添加新话题的浮动按钮 -->
                <v-btn
                fab
                dark
                color="primary"
                fixed
                bottom
                right
                @click="showNewTopicDialog = true"
                >
                <v-icon>mdi-plus</v-icon>
                </v-btn>
            </v-container>
        </v-main>
  
      <!-- 底部导航栏 -->
      <v-bottom-navigation 
        shift 
        color="primary" 
        grow 
        fixed
        v-model="navigation"
      >
        <v-btn value="library" to="/index">
          <span>文库</span>
          <v-icon>mdi-text-box-search</v-icon>
        </v-btn>
        <v-btn value="help" to="/wall">
          <span>互助</span>
          <v-icon>mdi-handshake</v-icon>
        </v-btn>
        <v-btn value="mine" to="/mine">
          <span>我的</span>
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
        <v-btn value="forum" to="/forum">
          <span>知乎</span>
          <v-icon>mdi-forum</v-icon>
        </v-btn>
      </v-bottom-navigation>
  
      <!-- 新建话题对话框 -->
      <v-dialog v-model="showNewTopicDialog" max-width="600">
        <v-card>
          <v-card-title>新建话题</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newTopic.title"
              label="标题"
              required
            ></v-text-field>
            <v-textarea
              v-model="newTopic.content"
              label="内容"
              rows="3"
              required
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="showNewTopicDialog = false">取消</v-btn>
            <v-btn color="primary" @click="addNewTopic">发布</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
  
  

  <script>
  import TopicItem from './TopicItem.vue'
  
  import AppHeader from './HeadBar.vue'

  export default {
    components: { TopicItem, AppHeader },
    data() {
      return {
        navigation: 'forum',
        showNewTopicDialog: false,
        newTopic: {
          title: '',
          content: ''
        },
        topics: [
          {
            id: 1,
            title: '如何看待2025年人工智能发展？',
            content: '最新研究显示AI将达到人类水平...',
            reply: {
              author: 'AI研究员',
              content: '从技术角度看...',
              avatar: 'mdi-account-circle',
              date: '2025-05-03'
            },
            children: [
              {
                id: 2,
                title: '具体哪些领域会突破？',
                content: '重点在自然语言处理...',
                reply: {
                  author: '科技观察员',
                  content: '我认为是医疗领域...',
                  avatar: 'mdi-account-tie',
                  date: '2025-05-04'
                }
              }
            ]
          },
          {
            id: 3,
            title: 'Vue 3在大型项目中的实践',
            content: '分享我们在企业级项目中使用Vue 3的经验...',
            reply: {
              author: '前端架构师',
              content: 'Composition API确实提高了代码复用性...',
              avatar: 'mdi-code-json',
              date: '2025-05-02'
            }
          }
        ]
      }
    },
    methods: {
      addNewTopic() {
        const newId = Math.max(...this.topics.map(t => t.id)) + 1
        this.topics.unshift({
          id: newId,
          title: this.newTopic.title,
          content: this.newTopic.content,
          reply: null,
          children: []
        })
        this.showNewTopicDialog = false
        this.newTopic = { title: '', content: '' }
      },
      handleReply({ parentId, content }) {
        // 实际项目中这里应该调用API
        const parent = this.findTopic(this.topics, parentId)
        if (parent) {
          const newId = Math.max(...this.getAllChildIds(this.topics)) + 1
          parent.children.push({
            id: newId,
            title: `回复: ${parent.title.substring(0, 20)}...`,
            content: content,
            reply: {
              author: '当前用户',
              content: content,
              avatar: 'mdi-account',
              date: new Date().toISOString().split('T')[0]
            }
          })
        }
      },
      findTopic(topics, id) {
        for (const topic of topics) {
          if (topic.id === id) return topic
          if (topic.children) {
            const found = this.findTopic(topic.children, id)
            if (found) return found
          }
        }
        return null
      },
      getAllChildIds(topics) {
        let ids = []
        topics.forEach(topic => {
          ids.push(topic.id)
          if (topic.children) {
            ids = ids.concat(this.getAllChildIds(topic.children))
          }
        })
        return ids
      }
    }
  }
  </script>
  
  <style scoped>
  .forum {
    padding-bottom: 56px; /* 底部导航高度 */
  }
  
  /* 话题卡片样式 */
  .v-card {
    margin-bottom: 16px;
    transition: box-shadow 0.3s;
  }
  
  .v-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  /* 浮动按钮位置调整 */
  .v-btn--fab.v-btn--fixed {
    bottom: 72px;
  }

  .forum-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-top: 150px; /* 与顶部栏高度一致 */
  margin-bottom: 56px; /* 底部导航高度 */
}

/* 调整浮动按钮位置 */
.v-btn--fab.v-btn--fixed {
  bottom: 80px; /* 高于底部导航 */
}
  </style>