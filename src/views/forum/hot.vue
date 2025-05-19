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
                :qid="item.id"
                interface="hot"
            />
            <v-progress-circular
                v-if="isLoading"
                indeterminate
                color="primary"
            />
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
import Mock from 'mockjs'

export default {
    components: { AppHeader, QuestionCard },
    data() {
        return {
            navigation: '',
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
            try {
                // const response = await axios.get(`/api/questions?page=${this.currentPage}&limit=${this.itemsPerPage}`)
                this.isLoading = true
                const response = [200, {
                    state: "SUCCESS",
                    code: "1",
                    msg: {
                        pageNum: this.currentPageNum,
                        pageSize: this.itemsPerPage,
                        total: 100,
                        isLastPage: false,
                        list: Mock.mock({
                            [`list|${this.itemsPerPage}`]: [{
                            'id|+1': (this.currentPageNum - 1) * this.itemsPerPage + 1,
                            title: '@ctitle(10,20)',
                            'hotPoint|5000-3000000': 1,
                            content: '@ctitle(50,100)',
                            'answerCount|0-100': 1,
                            'rewardPoints|0-50': 1,
                            createTime: '@datetime'
                            }]
                        }).list
                    }
                }]
                
                let data = response[1].msg
                this.allData = [...this.allData, ...data.list]
                if (data.list.length < this.itemsPerPage) {
                    this.noMore = true
                }
                this.currentPageNum += 1
                this.isLoading = false
            } catch (error) {
                console.error('请求失败:', error)
            }
        }
    },
    created() {
        let refresh = localStorage.getItem('refresh')
        if (refresh == 'true') {
            localStorage.setItem('refresh', 'false')
            this.$router.go(0)
        }
        this.fetchData()
    }
}
</script>