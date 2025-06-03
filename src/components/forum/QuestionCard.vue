<template>
	<v-card
		class="pa-2"
		flat
		:ripple="false"
		@click="toQuestion"
	>
		<div v-if="this.interface === 'hot'">
			<div class="d-flex align-start" style="gap: 12px;">
				<div class="d-flex align-center" style="margin-top: 5px;">
					<div 
						class="bubble-chip"
						:style="{
						backgroundColor: getColor(seqId),
						color: getTextColor(seqId)
						}"
					>
						{{ seqId + 1 }}
						<div class="bubble-tail"></div>
					</div>
				</div>

				<div 
					class="custom-title font-weight-bold"
					style="width: calc(100vw - 100px); "
				>
					{{ qtitle }}
					<div class="d-flex mt-3">
						<div class="text-caption grey--text">
							<span>{{ hotFormat(hotPoint) }} 热度</span>
						</div>
					</div>
				</div>

				<v-img
					v-if="urls.length > 0"
					:src="urls[0]"
					:width="80"
					:height="80"
					aspect-ratio="1"
					cover
					style="border-radius: 4px; margin-bottom: 10px;"
				></v-img>
			</div>
			<v-divider/>
		</div>

		<div v-if="this.interface === 'question' || this.interface === 'answer'">
			<v-card-title class="pt-0 font-weight-bold">{{ qtitle }}</v-card-title>

			<v-card-text v-if="this.interface === 'question'">
				<div class="d-flex align-center">
					<div 
						class="text-container" 
						:style="{ width: expanded ? '100%' : 'calc(100% - 130px)' }"
					>
					<div v-if="!expanded" @click="expanded = true">
						{{ truncateContent(qcontent) }}
						<span 
							v-if="extractText(qcontent).length >= 35"
							class="grey--text text--lighten-1 text-caption"
						>展开...</span>
					</div>

					<div v-if="expanded && qcontent.length >= 35">
						<div class="html-container">
							<div v-html="qcontent" class="html-content"></div>
						</div>
						<div style="margin-top: -20px">
							<v-btn 
								@click="expanded = false" 
								text small
								color="grey"
							>
								收起
								<v-icon right small>mdi-chevron-up</v-icon>
							</v-btn>
							</div>
						</div>
					</div>

					<v-img
						v-if="!expanded && urls.length > 0"
						:src="urls[0]"
						:width="120"
						:height="80"
						aspect-ratio="1"
						cover
						style="border-radius: 4px; margin-left: 10px;"
					></v-img>
				</div>
			</v-card-text>

			<div style="margin-left: 20px;" class="text-caption ml-4">
				<span v-if="this.interface === 'answer'">知乎 · </span>
				<span class="font-weight-bold">{{ commentNum }}</span> 回答
				<span v-if="this.interface === 'question'">
					 · <span class="font-weight-bold">{{ hotFormat(browse) }}</span> 浏览
				</span>
			</div>
		</div>

		<div v-if="this.interface === 'answerWrite'">
			<v-card-title class="pt-0 font-weight-bold">{{ qtitle }}</v-card-title>
		</div>
	</v-card>
</template>
  
<script>
import Mock from 'mockjs'
export default {
	name: 'QuestionCard',
	data() {
        return {
			expanded: false,
			urls: [],
        }
    },
	props: {
		qid: {
			type: Number,
			required: true
		},
		interface: {
			type: String,
			required: true
		},
		seqId: {
			type: Number,
			default: 0
		},
		qtitle: {
			type: String,
			default: ''
		},
		hotPoint: {
			type: Number,
			default: 0
		},
		qcontent: {
			type: String,
			default: ''
		},
		commentNum: {
			type: Number,
			default: 0
		},
		browse: {
			type: Number,
			default: 0
		},
		likeCount: {
			type: Number,
			default: 0
		},
		qliked: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		hotFormat() {
			if (this.hotPoint < 10000) {
				return this.hotPoint.toString()
			} else {
				return (this.hotPoint / 10000).toFixed(1) + '万'
			}
		},
		extractImageUrls(html) {
			const regex = /<img[^>]+src="([^">]+)"/g;
			this.urls = [];
			let match;
			while ((match = regex.exec(html)) !== null) {
				this.urls.push(match[1]);
			}
		},
		fetchData() {
			try {
				this.extractImageUrls(this.qcontent)
				localStorage.setItem('qtitle', this.qtitle)
            } catch (error) {
                console.error('请求失败:', error)
            }
		},
		getColor(num) {
			const colorMap = {
				0: '#FC5D57',
				1: '#FF8E0C',
				2: '#EDB56B'
			}
			return colorMap[num] || 'transparent'
		},
		getTextColor(num) {
			if (num < 3) return 'white';
			else return '#F58231';
		},
		toQuestion() {
			if (this.interface == 'hot' || this.interface == 'answer') {
				localStorage.setItem('qid', this.qid)
				localStorage.setItem('qtitle', this.qtitle)
				localStorage.setItem('hotPoint', this.hotPoint)
				localStorage.setItem('qcontent', this.qcontent)
				localStorage.setItem('commentNum', this.commentNum)
				localStorage.setItem('browse', this.browse)
				localStorage.setItem('likeCount', this.likeCount)
				localStorage.setItem('qliked', this.qliked)
				this.$router.push('./question')
			}
		},
		truncateContent(text, length = 34) {
			let pure_text = this.extractText(text)
			return pure_text.length > length 
			? pure_text.substring(0, length)
			: pure_text
		},
		extractText(htmlString) {
			const parser = new DOMParser();
			const doc = parser.parseFromString(htmlString, 'text/html');
			return doc.body.textContent || '';
		},
	},
	created() {
        this.fetchData()
    }
}
</script>

<style scoped>

.html-container {
  width: 500px;
  max-width: 100%;
  overflow: hidden;
}

.html-content img {
  max-width: 100%; /* 图片不超出容器 */
  height: auto;
}

.bubble-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 20px;
  /* padding: 0 8px; */
  border-radius: 2px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.bubble-tail {
  position: absolute;
  left: 50%;
  bottom: -4px;
  width: 8px;
  height: 8px;
  background: inherit;
  transform: translateX(-50%) rotate(45deg);
  clip-path: polygon(0% 0%, 100% 100%, 0% 100%);
}

.custom-title {
  font-size: 1rem;
  line-height: 1.2;
}

</style>