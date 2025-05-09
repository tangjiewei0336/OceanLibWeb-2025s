<template>
    <div class="forum">
        <v-app-bar app fixed color="white" elevation="1" height="64">
            <AppHeader />
        </v-app-bar>
        <div style="margin-top: 220px; margin-bottom: 50px">
            <QuestionCard 
                v-for="(item, index) in paginatedData" 
                :key="index"
                :title="item.title"
                :answer-count="item.answerCount"
                :reward="item.reward"
                />
                
            <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="7"
                @input="fetchData"
                class="mt-4"
            ></v-pagination>
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
import axiosPlugin from '../../axios/axiosPlugin'
import Mock from 'mockjs'

export default {
    components: { AppHeader, QuestionCard },
    data() {
        return {
            currentPage: 1,
            itemsPerPage: 4, // 每页显示4个QuestionCard
            totalItems: 0,   // 从API获取的总数据量
            allData: []      // 存储所有数据
        }
    },
    computed: {
        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage)
        },
        paginatedData() {
            const start = (this.currentPage - 1) * this.itemsPerPage
            const end = start + this.itemsPerPage
            return this.allData.slice(start, end)
        }
    },
    methods: {
        async fetchData() {
            try {
                console.log("try to get")
                // const response = await axiosPlugin({
                //     method: "get",
                //     url: '/questions/list',
                //     headers: {
                //         'Content-Type': 'application/x-www-form-urlencoded',
                //     },
                //     data: qs.stringify({
                //     }),
                // })
                const response = {
                    data: Mock.mock({  // 添加data层级
                        [`items|${this.itemsPerPage}`]: [{
                        'id|+1': (this.currentPage - 1) * this.itemsPerPage + 1,
                        title: '@ctitle(15)',
                        'answerCount|0-100': 1,
                        'reward|0-500': 1
                        }],
                        total: 50
                    })
                }
                this.allData = response.data.items
                this.totalItems = response.data.total
            } catch (error) {
                console.error('API请求失败:', error)
            }
        },
    },
    created() {
        this.fetchData()
    }
}
</script>