<template>
    <v-card class="pa-4" flat>
        <div v-for="comment in comments" :key="comment.id" class="mb-4">
            <div class="d-flex align-start">
                <v-avatar size="60" color="primary" class="mr-3">
                    <span class="white--text">{{ comment.author.charAt(0) }}</span>
                </v-avatar>
                
                <div class="flex-grow-1">
                    <div class="d-flex align-center">
                        <strong class="mr-2">{{ comment.author }}</strong>
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
                            {{ comment.likes }}
                        </v-btn>
                        
                        <v-btn 
                            x-small 
                            text 
                            color="grey" 
                            @click="toggleReplyForm(comment.id)"
                        >
                            <v-icon left>mdi-reply</v-icon>
                            回复
                        </v-btn>
                    </div>
                    
                    <!-- Reply Input -->
                    <v-expand-transition>
                        <div v-if="activeReplyId === comment.id" class="mt-3">
                            <v-row no-gutters align="center">
                                <v-col cols="9">
                                    <v-textarea
                                        v-model="replyContent"
                                        outlined
                                        dense
                                        rows="2"
                                        :placeholder="`回复 ${comment.author}`"
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
                    <div v-if="comment.replies && comment.replies.length" class="mt-3 pl-6">
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
                                    @click="toggleLike(comment)"
                                    class="mr-2"
                                >
                                    <v-icon left :color="comment.liked ? 'red' : ''">
                                        {{ comment.liked ? 'mdi-heart' : 'mdi-heart-outline' }}
                                    </v-icon>
                                    {{ comment.likes }}
                                </v-btn>
                                
                                <v-btn 
                                    x-small 
                                    text 
                                    color="grey" 
                                    @click="toggleReplyForm(comment.id)"
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
        
    </v-card>
</template>

<script>
export default {
    name: 'CommentCard',
    data() {
        return {
            currentUser: '当前用户',
            newComment: '',
            replyContent: '',
            activeReplyId: null,
            comments: [
                {
                    id: 1,
                    author: '张三',
                    content: '这篇文章很有帮助，解决了我很多问题！',
                    date: new Date('2025-05-10'),
                    likes: 5,
                    liked: false,
                    replies: [
                        {
                        id: 101,
                        author: '李四',
                        content: '确实很有用，我也学到了很多',
                        date: new Date('2025-05-11')
                        }
                    ]
                },
                {
                    id: 2,
                    author: '王五',
                    content: '期待作者更新更多相关内容',
                    date: new Date('2025-05-09'),
                    likes: 2,
                    liked: true,
                    replies: []
                }
            ]
        }
    },
    methods: {
        formatDate(date) {
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
            comment.likes += comment.liked ? 1 : -1
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
    }
}
</script>

<style scoped>
.v-avatar {
  flex-shrink: 0;
}
</style>