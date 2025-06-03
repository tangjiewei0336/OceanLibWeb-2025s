<template>
    <v-app>
        <v-app-bar app flat color="white">
            <v-btn text color="grey" @click="handleCancel">
                取消
            </v-btn>
            
            <v-spacer></v-spacer>
            <v-toolbar-title class="font-weight-small">写回答</v-toolbar-title>
            <v-spacer></v-spacer>
            
            <v-btn
                text
                color="primary" 
                depressed
                @click="handlePublish"
                class="mr-2"
            >
                发布
            </v-btn>
        </v-app-bar>

        <v-container 
            fluid
        >
    
            <QuestionCard
                :qid="qid"
                interface="answerWrite"
            />

            <v-sheet 
                color="grey lighten-2" 
                height="3px" 
                class="mx-auto"
                rounded="0"
            />

        </v-container>
        

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
            <v-btn value="forum" to="/forum/hot">
            <span>知乎</span>
            <v-icon>mdi-forum</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-app>
  </template>
  
<script>

import AskCard from '../../components/forum/AskCard.vue'
import QuestionCard from '../../components/forum/QuestionCard.vue';

export default {
    components: { QuestionCard},
    data() {
        return {
            navigation: 3,
            qid: 0,
            qtitle: ''
        }
    },
    methods: {
        handleCancel() {
            // 取消操作逻辑
            this.$router.go(-1)
        },
        handlePublish() {
            // 发布操作逻辑
            console.log('发布回答')
        }
    },
    created() {
        // this.qid = Number(localStorage.getItem('qid'))
    }
}
</script>