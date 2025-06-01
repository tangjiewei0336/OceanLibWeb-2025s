<template>
	<v-card
		class="pa-4"
		flat
		:ripple="false"
		@click="toQuestion"
	>
		<div 
			class="d-flex align-center"
			v-if="this.interface === 'hot'"
			style="gap: 12px;"
			>
			<v-chip
				:color="getColor(seqId + 1)"
				small
				style="flex-shrink: 0;"
			>
				{{ seqId + 1 }}
			</v-chip>

			<div 
				class="text-h7 font-weight-bold"
				style="width: 200px;"
			>
				{{ qtitle }}
				<div class="d-flex mt-3">
				<div class="text-caption grey--text">
					<span>热度: {{ hotFormat(hotPoint) }}</span>
				</div>
				</div>
			</div>

			<v-img
				v-if="urls.length > 0"
				:src="urls[0]"
				:width="60"
				:height="60"
				aspect-ratio="1"
				cover
				style="border-radius: 4px;"
			></v-img>
		</div>

		<div v-if="this.interface === 'question' || this.interface === 'answer'">
			<v-card-title class="pt-0 font-weight-bold">{{ qtitle }}</v-card-title>

			<v-card-text v-if="this.interface === 'question'">
				<div class="d-flex align-center">
					<div v-if="!expanded" @click="expanded = true" >
						{{ truncateContent(qcontent) }}
						<span 
							v-if="qcontent.length >= 35"
							class="grey--text text--lighten-1 text-caption"
						>展开...</span>
					</div>
					<div v-if="expanded && qcontent.length >= 35">
						<div v-html="qcontent"></div>
						<div>
							<v-btn 
								@click="expanded = false" 
								text
								small
								color="grey"
							>
								收起
								<v-icon right small>
									{{ 'mdi-chevron-up' }}
								</v-icon>
							</v-btn>
						</div>
					</div>
					<v-img
						v-if="!expanded && urls.length > 0"
						:src="urls[0]"
						:width="120"
						:height="80"
						aspect-ratio="1"
						cover
						style="border-radius: 4px;"
					></v-img>
				</div>
			</v-card-text>

			<div style="margin-left: 20px;" class="text-caption ml-4">
				<span v-if="this.interface === 'answer'">知乎 · </span>
				<span class="font-weight-bold">{{ commentNum }}</span> 回答
				<span v-if="this.interface === 'question'">
					 · <span class="font-weight-bold">{{ browse }}</span> 浏览
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
				1: 'red',
				2: 'orange',
				3: 'yellow'
			}
			return colorMap[num] || 'transparent'
		},
		toQuestion() {
			if (this.interface == 'hot' || this.interface == 'answer') {
				localStorage.setItem('qid', this.qid)
				localStorage.setItem('qtitle', this.qtitle)
				localStorage.setItem('hotPoint', this.hotPoint)
				localStorage.setItem('qcontent', this.qcontent)
				localStorage.setItem('commentNum', this.commentNum)
				localStorage.setItem('browse', this.browse)

				this.$router.push('./question')
			}
		},
		truncateContent(text, length = 34) {
			const regex = /<p[^>]*>(.*?)<\/p>/g;
			let match;
			if ((match = regex.exec(text)) !== null) {
				text = match[1]
			} else {
				text = ""
			}
			return text.length > length 
			? text.substring(0, length)
			: text
		},
	},
	created() {
        this.fetchData()
    }
}
</script>