<template>
    <v-card flat>
        <div v-if="!detailed">
            <div class="d-flex justify-end pa-0">
                <v-btn
                    fab
                    text
                    small
                    @click="close">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
            <v-avatar
                size="30"
                color="primary"
                class="mr-3"
                style="margin-left: 15px; margin-bottom: 5px;">
                <span class="white--text">{{ uid.charAt(0) }}</span>
            </v-avatar>
            <span>{{ uid }}</span>
            <v-sheet 
                color="grey lighten-2" 
                height="5px"
                width="100%"
                rounded="0"
            />
            <div>
                <v-card-text class="pa-1" style="margin-left: 10px;">
                    评论 {{ commentCount }}
                </v-card-text>
            </div>
            <v-container 
                ref="scrollContainer"
                class="overflow-y-auto pa-0"
                fluid
                style="height: 500px;"
                @scroll.passive="handleScroll"
            >
                <CommentCard
                    v-for="(item, index) in paginatedData" 
                    :key="index"
                    :cid="item.cid"
                    :uid="item.uid"
                    :content="item.content"
                    :date="item.date"
                    :subComments="item.subComments"
                    :likeCount="item.likeCount"
                    :liked="item.liked"
                    :disliked="item.disliked"
                    interface="outer"
                    @allreply="allReply"
                />
        
            </v-container>
        </div>
        <div v-if="detailed">
            <div class="d-flex align-center">
                <v-btn icon @click="goBack">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <span class="text-h6 mx-auto pa-2">评论回复</span>
            </div>
            <ReplyCard
                :cid="detail_cid"
            />
        </div>
    </v-card>
</template>

<script>
import Mock from 'mockjs'
import CommentCard from './CommentCard.vue'
import ReplyCard from './ReplyCard.vue'

export default {
    name: 'CommentPopup',
    components: { CommentCard, ReplyCard },
    data() {
        return {
            commentCount: 0,
            isLoading: false,
            noMore: false,
            currentPageNum: 0,
            itemsPerPage: 6,
            allData: [],

            detailed: false,
            detail_cid: 0
        }
    },
    props: {
        uid: {
            type: String,
            required: true
        },
        aid: {
            aid: Number,
			required: true
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
        fetchData() {
            if (this.noMore) {
                return
            }
            try {
                this.isLoading = true
                const response = [200, {
                    state: "SUCCESS",
                    code: "1",
                    msg: {
                        commentCount: 10,
                        list: Mock.mock({
                        [`list|${this.itemsPerPage}`]: [{
                            'id|+1': (this.currentPageNum - 1) * this.itemsPerPage + 1,
                            uid: '@ctitle(3,8)',
                            'cid|1-1000': 1,
                            content: '@ctitle(50,100)',
                            'date': '@datetime',
                            'likeCount|0-500': 1,
                            'liked|1': [true, false],
                            'disliked|1': [true, false],
                            'subComments|2-10': [{ 
                                'cid|1-1000': 1,
                                'reply_cid|1-100': 0,
                                'reply_uid': '@ctitle(3,8)',
                                'uid': '@ctitle(3,8)',
                                'content': '@ctitle(20,100)',
                                'likeCount|0-500': 1,
                                'liked|1': [true, false],
                                'disliked|1': [true, false],
                                'date': '@datetime',
                            }]
                        }]
                    }).list}
                }]

                let data = response[1].msg
                this.commentCount = data.commentCount
                this.allData = [...this.allData, ...data.list]
                if (data.list.length < this.itemsPerPage) {
                    this.noMore = true
                }
                this.currentPageNum += 1
                this.isLoading = false
            } catch (error) {
                console.error('请求失败:', error)
            }
        },
        allReply(cid) {
            this.detailed = true
            this.detail_cid = cid
        },
        close() {
            this.$emit('close')
        },
        goBack() {
            this.detailed = false
        },
        focusInput() {
            this.$nextTick(() => {
                this.$refs.inputField.focus(); // 手动聚焦
            });
        }
    },
    created() {
        this.fetchData();
    }
}
</script>
