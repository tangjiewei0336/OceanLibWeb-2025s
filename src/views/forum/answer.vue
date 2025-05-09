<template>
    <div class="forum">
        <v-app-bar app fixed color="white" elevation="1" height="64">
            <AppHeader />
        </v-app-bar>
        <div style="margin-top: 220px; margin-bottom: 50px">
            <div class="text-h8">{{ question.title }}</div>
            <v-spacer></v-spacer>
            <v-btn 
                icon 
                @click="expandQuestion"
            >
                <v-icon>{{ expanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
            <ContentCard/>
            <ContentCard/>
            <ContentCard/>
        </div>
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
            <v-btn value="forum" to="/forum/recommend">
            <span>知乎</span>
            <v-icon>mdi-forum</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </div>
  </template>
  
<script>
import AppHeader from '../../components/nav/ForumHeadBar.vue'
import ContentCard from '../../components/forum/ContentCard.vue';

export default {
    components: { AppHeader, ContentCard },
    data() {
        return {
            expanded: false,
            submitting: false,
            question: {
                title: "Vuetify 3.0相比2.0有哪些重大改进？",
                details: "最近项目准备升级到Vuetify 3.0，想了解下主要的新特性和可能的升级注意事项..."
            },
            answerContent: '',
            files: []
        }
    },
    methods: {
        expandQuestion() {
            this.expanded = !this.expanded
        },
        submitAnswer() {
            this.submitting = true
            // 模拟API请求
            setTimeout(() => {
                console.log('提交内容:', {
                    answer: this.answerContent,
                    files: this.files
                })
                this.submitting = false
                this.$emit('answered')
            }, 1500)
        },
        clearForm() {
            this.answerContent = ''
            this.files = []
        },
        handleEnter(e) {
            if (e.ctrlKey || e.shiftKey) {
                this.answerContent += '\n'
            } else {
                this.submitAnswer()
            }
        }
    }
}
</script>