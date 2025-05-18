<template>
    <v-card class="pa-4" flat>

        <v-container 
            ref="scrollContainer"
            class="overflow-y-auto"
            fluid
            style="height: 1100px;"
            @scroll.passive="handleScroll"
        >
    
            <div v-for="(comment, id) in paginatedData" :key="id" class="mb-4">
                <div class="d-flex align-start">
                    <v-avatar size="60" color="primary" class="mr-3">
                        <span class="white--text">{{ comment.userId.charAt(0) }}</span>
                    </v-avatar>
                    
                    <div class="flex-grow-1">
                        <div class="d-flex align-center">
                            <strong class="mr-2">{{ comment.userId }}</strong>
                            <v-chip x-small color="grey lighten-2">{{ formatDate(comment.date) }}</v-chip>
                        </div>
                        <p class="mt-1 mb-2">{{ comment.content }}</p>
                        
                        <!-- Like & Reply Button -->
                        <div class="d-flex">
                            <v-btn 
                                x-small 
                                text 
                                color="grey" 
                                @click="toggleLike(comment)"
                                class="mr-2"
                            >
                                <v-icon left :color="comment.liked ? 'red' : ''">
                                    {{ comment.liked ? 'mdi-heart' : 'mdi-heart-outline' }}
                                </v-icon>
                                {{ comment.likeCount }}
                            </v-btn>
                            
                            <v-btn 
                                x-small 
                                text 
                                color="grey" 
                                @click="unfoldId = id"
                            >
                                <v-icon left>mdi-reply</v-icon>
                                {{ comment.commentCount }}
                            </v-btn>
                        </div>
                        
                        <!-- Reply Input -->
                        <v-expand-transition>
                            <div v-if="activeReplyId === id" class="mt-3">
                                <v-row no-gutters align="center">
                                    <v-col cols="9">
                                        <v-textarea
                                            v-model="replyContent"
                                            outlined
                                            dense
                                            rows="2"
                                            :placeholder="`回复 ${comment.userId}`"
                                            hide-details
                                            class="mr-2"
                                        ></v-textarea>
                                    </v-col>
                                    <v-col cols="auto">
                                        <v-btn small color="primary" @click="submitReply(comment)">发布</v-btn>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-expand-transition>
                        
                        <!-- Reply List -->
                        <div v-if="comment.replies.length" class="mt-3 pl-6">
                            <div v-for="reply in comment.replies" :key="reply.id" class="mb-3">
                                <div class="d-flex align-start">
                                    <v-avatar size="60" color="secondary" class="mr-2">
                                    <span class="white--text">{{ reply.author.charAt(0) }}</span>
                                    </v-avatar>
                                    <div>
                                    <div class="d-flex align-center">
                                        <strong class="mr-2">{{ reply.author }}</strong>
                                        <v-chip x-small color="grey lighten-2">{{ formatDate(reply.date) }}</v-chip>
                                    </div>
                                    <p class="mt-1 mb-0">{{ reply.content }}</p>
                                    </div>
                                </div>

                                <div class="d-flex">
                                    <v-btn 
                                        x-small 
                                        text 
                                        color="grey" 
                                        @click="toggleLike(reply)"
                                        class="mr-2"
                                    >
                                        <v-icon left :color="reply.liked ? 'red' : ''">
                                            {{ reply.liked ? 'mdi-heart' : 'mdi-heart-outline' }}
                                        </v-icon>
                                        {{ reply.likeCount }}
                                    </v-btn>
                                    
                                    <v-btn 
                                        x-small 
                                        text 
                                        color="grey" 
                                        @click="toggleReplyForm(id)"
                                    >
                                        <v-icon left>mdi-reply</v-icon>
                                        回复
                                    </v-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
        </v-container>

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
    </v-card>
</template>

<script>
import Mock from 'mockjs'
export default {
    name: 'CommentCard',
    data() {
        return {
            isLoading: false,
            noMore: false,
            currentPageNum: 0,
            itemsPerPage: 4,
            totalItem: 0,
            allData: [],
            unfoldId: -1,
        }
    },
    computed: {
        paginatedData() {
            const end = this.currentPageNum * this.itemsPerPage
            return this.allData.slice(0, end)
        }
    },
    props: {
        uid: {
            type: String,
            require: true
        }
    },
    methods: {
        fetchData() {
            if (this.noMore) {
                return
            }
            try {
                // request the all direct comment of given uid
                // const response = await axios.get(`/api/questions?page=${this.currentPage}&limit=${this.itemsPerPage}`)

                console.log("here")

                const response = [200, {
                    state: "SUCCESS",
                    code: "1",
                    msg: Mock.mock({
                    [`list|${this.itemsPerPage}`]: [{
                        'id|+1': this.currentPageNum * this.itemsPerPage + 1,
                        commentId: '@guid()',
                        userId: '@ctitle(3,6)',
                        content: '@cparagraph(1,3)',
                        date: '@datetime("yyyy-MM-dd")',
                        'liked|1': [true, false],
                        'likeCount|0-1000': 1,
                        'commentCount|0-50': 1,
                        'replies|0-2': [
                            {
                            'id|+1': 100,
                            'author': '@cname',
                            'content': '@csentence(5, 10)',
                            'date': '@date("yyyy-MM-dd")',
                            'liked|1': [true, false],
                            'likeCount|0-1000': 1,
                            }
                        ]
                    }]
                    }).list
                }];
                let data = response[1].msg

                console.log("here0")
                if (data.length < this.itemsPerPage) {
                    this.noMore = true
                }
                console.log("here1")
                this.allData = [...this.allData, ...data]

                this.currentPageNum += 1
                this.isLoading = false
            } catch (error) {
                console.error('请求失败:', error)
            }
        },
        handleScroll() {
            const container = this.$refs.scrollContainer;
            if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
                this.fetchData();
            }
        },
        async formatDate(date) {
            return date.toLocaleDateString()
        },
        addComment() {
            if (this.newComment.trim()) {
                this.comments.push({
                id: Date.now(),
                author: this.currentUser,
                content: this.newComment,
                date: new Date(),
                likes: 0,
                liked: false,
                replies: []
                })
                this.newComment = ''
            }
        },
        toggleLike(comment) {
            comment.liked = !comment.liked
            comment.likeCount += comment.likeCount ? 1 : -1
        },
        toggleReplyForm(commentId) {
            this.activeReplyId = this.activeReplyId === commentId ? null : commentId
            this.replyContent = ''
        },
        cancelReply() {
            this.activeReplyId = null
            this.replyContent = ''
        },
        submitReply(comment) {
            if (this.replyContent.trim()) {
                comment.replies.push({
                id: Date.now(),
                author: this.currentUser,
                content: this.replyContent,
                date: new Date()
                })
                this.cancelReply()
            }
        }
    },
    created() {
        this.fetchData()
    }
}
</script>

<style scoped>
.v-avatar {
  flex-shrink: 0;
}
</style>