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
                    :id="item.id"
                    :aid="aid"
                    :cid="item.id"
                    :uid="item.commentBuildUsername"
                    :content="item.commentContent"
                    :likeCount="item.likeNumber"
                    :date="item.buildDate"
                    :subComments="item.replyCommentList"
                    :replyCount="item.replyCount"
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
                :aid="aid"
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
            detail_cid: 0,
            detailed_replyCount: 0
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
        async fetchData() {
            if (this.noMore || this.isLoading) {
                return
            }
            this.isLoading = true
            this.$Axios({
                method: 'get',
                url: '/comment/getComment',
                params: {
                    bindID: this.aid,
                    mainType: "ANSWER",
                    pageNum: this.currentPageNum + 1,
                    commentCount: this.itemsPerPage,
                    replyCount: 2
                },
            }).then(response => {
                let data = response.data.msg.comments
                console.log(response.data.msg)
                this.commentCount = response.data.msg.commentCount
                this.allData = [...this.allData, ...data]
                if (this.allData.length >= this.commentCount) {
                    this.noMore = true
                } else {
                    this.currentPageNum += 1
                }
                this.isLoading = false
            }).catch(error => {
                this.isLoading = false
                console.error('请求失败:', error)
            })
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
