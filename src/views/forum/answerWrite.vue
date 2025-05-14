<template>
    <div class="forum">
        <v-app-bar app fixed color="white" elevation="1" height="64">
            <AppHeader />
        </v-app-bar>
        <div style="margin-top: 220px; margin-bottom: 50px">
            <QuestionCard 
                :title="title"
                :content="content"
                :answer-count="answerCount"
                :reward="rewardPoints"
                :isAnswerWriting=true
            />

            <v-card-text>
                <v-textarea
                    v-model="answerContent"
                    label="写下您的回答"
                    auto-grow
                    outlined
                    rows="3"
                    row-height="24"
                    no-resize
                    :rules="[v => !!v || '内容不能为空']"
                ></v-textarea>

                <v-file-input
                    v-model="files"
                    multiple
                    prepend-icon="mdi-paperclip"
                    label="添加附件"
                    show-size
                    counter
                    truncate-length="15"
                ></v-file-input>
            </v-card-text>

            <v-card-actions>
                <v-btn 
                    color="primary" 
                    depressed
                    @click="submitAnswer"
                    :loading="submitting"
                >
                    <v-icon left>mdi-send</v-icon>
                    提交回答
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click="clearForm">清空</v-btn>
            </v-card-actions>
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
import QuestionCard from '../../components/forum/QuestionCard.vue';

export default {
    components: { AppHeader, QuestionCard },
    data() {
        return {
            title:localStorage.getItem('forum_title'),
            content:localStorage.getItem('forum_content'),
            answerCount:localStorage.getItem('forum_answerCount'),
            rewardPoints:localStorage.getItem('forum_reward'),
            answerContent:"",
            files:[]
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