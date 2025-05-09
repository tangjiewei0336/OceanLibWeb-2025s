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

            <v-expand-transition>
                <div v-show="expanded">
                    <v-card-text class="pt-0">
                    {{ question.details }}
                    </v-card-text>
                </div>
            </v-expand-transition>

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

export default {
    components: { AppHeader },
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