<template>
    <v-card class="d-flex align-start pa-4" flat>
        <v-avatar v-if="this.interface==='outer'" size="30" color="primary" class="mr-3">
            <span class="white--text">{{ uid.charAt(0) }}</span>
        </v-avatar>
        <v-avatar v-if="this.interface==='inner'" size="25" color="primary" class="mr-3">
            <span class="white--text">{{ uid.charAt(0) }}</span>
        </v-avatar>
        <div>
            <div>
                <span>{{ uid }}</span>
            </div>
            <div>
                <span class="text--lighten-1 text-caption" @click="reply">{{ content }}</span>
            </div>
            <div class="d-flex align-center">
                <span class="grey--text text--lighten-1 text-caption">
                    {{ formatDate(date) }}
                </span>
                <v-btn :ripple="false" small text class="pa-0" @click="reply">
                    回复
                </v-btn>
                <v-spacer></v-spacer>
                <div>
                    <v-btn :ripple="false" x-small text @click="likeComment">
                        <v-icon left small>{{ inner_liked ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
                        {{ inner_likeCount }}
                    </v-btn>
                    <v-btn :ripple="false" x-small text @click="dislikeComment">
                        <v-icon left small>{{ inner_disliked ? 'mdi-heart-off' : 'mdi-heart-off-outline' }}</v-icon>
                    </v-btn>
                </div>
            </div>

            <CommentCard
                v-for="(item, index) in SubData" 
                :key="index"
                :cid="item.cid"
                :uid="item.uid"
                :content="item.content"
                :date="item.date"
                :subComments="item.subComments"
                :likeCount="item.likeCount"
                :liked="item.liked"
                :disliked="item.disliked"
                interface="inner"
            />
            <div v-if="subComments.length > 2" class="d-flex align-center">
                <v-btn
                    small
                    :ripple="false"
                    @click="allReply"
                    class="rounded-pill"
                    depressed
                >
                    查看更多 {{ subComments.length - 2 }} 条回复 >
                </v-btn>
            </div>
        </div>
    </v-card>
</template>

<script>
export default {
    name: "CommentCard",
    data() {
        return {
            inner_likeCount: 0,
            inner_liked: false,
            inner_disliked: false,
        }
    },
    props: {
        cid: {
            type: Number,
            required: true
        },
        uid: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        likeCount: {
            type: Number,
            default: 0
        },
        liked: {
            type: Boolean,
            default: false
        },
        disliked: {
            type: Boolean,
            default: false
        },
        subComments: {
            type: Array,
            default: () => []
        },
        interface: {
            type: String,
            required: true
        }
    },
    computed: {
        SubData() {
            const end = Math.min(this.subComments.length, 2);
            return this.subComments.slice(0, end)
        }
    },
    methods: {
        formatDate(date) {
			return new Date(date).toLocaleDateString('zh-CN', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			})
		},
        likeComment() {
            if (this.inner_liked) {
                this.inner_likeCount -= 1
                this.inner_liked = false
            } else {
                this.inner_likeCount += 1
                this.inner_liked = true
                this.inner_disliked = false
            }
        },
        dislikeComment() {
            if (this.inner_disliked) {
                this.inner_disliked = false
            } else {
                this.inner_disliked = true
                if (this.inner_liked) {
                    this.inner_likeCount -= 1
                    this.inner_liked = false
                }
            }
        },
        reply() {
            console.log('reply')
        },
        allReply() {
            this.$emit('allreply', this.cid);
        }
    },
    created() {
        this.inner_likeCount = this.likeCount
        this.inner_liked = this.liked
        this.inner_disliked = this.disliked
    }
}
</script>