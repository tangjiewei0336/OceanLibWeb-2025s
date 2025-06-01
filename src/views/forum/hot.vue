<template>
    <div class="forum">
        <v-app-bar app fixed color="white" elevation="1" height="64">
        </v-app-bar>
            <AppHeader />

        <v-container 
            ref="scrollContainer"
            class="overflow-y-auto"
            fluid
            style="height: 500px; margin-top: 150px;"
            @scroll.passive="handleScroll"
        >
            <QuestionCard 
                v-for="(item, index) in paginatedData" 
                :key="index"
                :seqId="index"
                :qid="item.bindId"
                :qtitle="item.title"
                :hotPoint="item.viewCount"
                :qcontent="item.content"
                :browse="item.viewCount"
                interface="hot"
            />
            <v-row justify="center" align="center">
                <v-col cols="auto">
                    <v-progress-circular
                        v-if="isLoading"
                        indeterminate
                        color="primary"
                    />
                </v-col>
            </v-row>
            <v-card-text
                v-if="noMore"
                class="text-center text-caption pa-2"
            >
                没有更多了...
            </v-card-text>

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
    </div>
  </template>

<script>
import AppHeader from '../../components/nav/ForumHeadBar.vue'
import QuestionCard from '../../components/forum/QuestionCard.vue';
import axios from 'axios'
import Mock from 'mockjs'

export default {
    components: { AppHeader, QuestionCard },
    data() {
        return {
            navigation: 3,
            isLoading: false,
            noMore: false,
            currentPageNum: 0,
            itemsPerPage: 6,
            allData: []
        }
    },
    computed: {
        paginatedData() {
            const end = this.allData.length
            return this.allData.slice(0, end)
        }
    },
    methods: {
        handleScroll() {
            const container = this.$refs.scrollContainer;
            if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
                this.fetchData();
            }
        },
        async fetchData() {
            if (this.noMore) {
                return
            }
            this.isLoading = true
            this.$Axios({
                method: 'get',
                url: '/qaService/question/list',
                params: {
                    page: this.currentPageNum + 1,
                    pageSize: this.itemsPerPage,
                    sort: 1
                },
            }).then(response => {
                let data = response.data.msg.content
                this.allData = [...this.allData, ...data]
                if (data.length < this.itemsPerPage) {
                    this.noMore = true
                }
                this.currentPageNum += 1
                this.isLoading = false
            }).catch(error => {
                console.error('请求失败:', error)
            })
        }
    },
    created() {
        let refresh = localStorage.getItem('refresh')
        if (refresh == 'true') {
            localStorage.setItem('refresh', 'false')
            this.$router.go(0)
        } else {
            localStorage.setItem('refresh', 'true')
        }
        this.fetchData()
    }
}
</script>