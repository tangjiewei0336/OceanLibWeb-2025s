<template>
  <v-card elevation="2" class="ask-card">
    <!-- 顶部导航栏 -->
    <div class="ask-card-toolbar">
      <v-btn icon @click="$emit('close')" class="close-btn">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <span class="ask-card-title">提问</span>
      <v-btn color="primary" @click="publish" class="publish-btn" 
        :disabled="!title.trim()" 
        >
        发布
      </v-btn>
    </div>
    <!-- <van-nav-bar id="toolbar" title="提问" left-text="返回" left-arrow @click-left="back" fixed placeholder @click-right="publish">
      <template #right>
        <a>发布</a>
      </template>
    </van-nav-bar>
    <div class="newcollection">
      <v-text-field class="newcollection__input small" placeholder="输入问题标题，并以问号结尾（必填）" outlined dense hide-details="auto">
  
      </v-text-field>
      <v-textarea class="newcollection__input " v-model="collectionDesc" placeholder="详细说明问题，以获取专业解答（选填）" outlined dense hide-details></v-textarea>
    </div> -->

    <!-- 标题输入 -->
    <input
      v-model="title"
      class="title-input"
      placeholder="输入问题标题，并以问号结尾（必填）"
      @blur="checkTitle"
      @input="onTitleInput"
      ref="titleInput"
    />

    <!-- 分割线 -->
    <hr class="divider" />

    <div class="editor-container">
      <editor-content :editor="editor" />
      <div class="editor-toolbar">
        <v-btn icon @click="openImageDialog" class="editor-btn">
          <v-icon>mdi-image</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- 图片上传对话框 -->
    <v-dialog v-model="imageDialog" max-width="600px">
      <v-card>
        <v-card-title class="headline">上传图片</v-card-title>
        <v-card-text>
          <v-file-input
            v-model="imageFile"
            label="选择图片"
            accept="image/*"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="imageDialog = false">取消</v-btn>
          <!-- <v-btn color="primary" @click="imageDialog = false">上传</v-btn> -->
          <v-btn color="primary" @click="confirmUpload">上传</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'

export default {
  name: 'AskCard',
  emits: ['close'],
  components: {
    EditorContent,
  },
  data() {
    return {
      title: '',
      editor: null,
      imageDialog: false,
      imageFile: null,
    }
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Image,
        Placeholder.configure({
          placeholder: '详细说明问题，以获取专业解答（选填）',
        }),
      ],
      content: '',
    })
  },
  beforeUnmount() {
    if (this.editor) {
      this.editor.destroy()
      this.editor = null
    }
  },
  methods: {
    checkTitle() {
      if (
        this.title &&
        !this.title.trim().endsWith('？') &&
        !this.title.trim().endsWith('?')
      ) {
        this.title = this.title.trim() + '？'
      }
    },
    onTitleInput() {
      if (this.title.trim().endsWith('?')) {
        setTimeout(() => {
          this.editor.chain().focus().run()
        }, 100)
      }
    },
    openImageDialog() {
      this.imageDialog = true
    },
    confirmUpload() {
      if (!this.imageFile) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;

        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;

        imgElement.onload = () => {
          // 获取编辑器内容区域的宽度作为最大宽度
          const editorContent = this.$el.querySelector('.editor-container');
          const maxWidth = editorContent ? editorContent.clientWidth : window.innerWidth * 0.9;

          let width = imgElement.width;
          let height = imgElement.height;

          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }

          // 插入图片到编辑器
          this.editor.chain().focus().setImage({ src: imageUrl }).run();

          // 延时确保图片插入到 DOM 后设置宽高
          setTimeout(() => {
            const insertedImages = document.querySelectorAll('.ProseMirror img');
            const lastImage = insertedImages[insertedImages.length - 1];
            if (lastImage) {
              lastImage.style.width = `${width}px`;
              lastImage.style.height = `${height}px`;
              lastImage.style.maxWidth = '100%'; // 防止超出边界
              lastImage.style.height = 'auto';   // 保持纵横比
            }
          }, 50);

          // 清除文件和关闭对话框
          this.imageFile = null;
          this.imageDialog = false;
          console.log('上传成功');
        };
      };
      reader.readAsDataURL(this.imageFile);
    },

    publish() {
      const content = this.editor.getHTML()
      if (!this.title) {
        alert('请填写标题')
        return
      }
      // TODO: 调用发布 API
      console.log('发布内容：', { title: this.title, content })
      alert('发布成功！')
    },
  },
}
</script>

<style>
.ask-card {
  max-width: 100%;
  margin: 10px auto;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
  background-color: #fff;
}

.ask-card-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  /* border-bottom: 1px solid #e0e0e0; */
  /* background-color: #f9f9f9; */
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 0px 3px;
  padding-right: 10px;
}

.ask-card-title {
  font-size: 15px;
  font-weight: 500;
}

.close-btn {
  color: #616161;
  height: 40px !important; /* 确保和发布按钮一致 */
  width: 40px !important;
}

.publish-btn {
  font-size: 13px !important;
  border-radius: 13px !important;
  height: 26px !important;
  min-width: 55px !important;
  align-items: center;
  justify-content: center;
  padding-left: 10px !important;
  padding-right: 10px !important;
  transition: background-color 0.3s ease;
}

.title-input {
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 14px;
}

.divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 4px 12px;
}

.editor-container {
  min-height: 250px;
  border: none;
  padding: 4px 14px;
  background-color: transparent;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
}
.editor-container div[contenteditable='true'] {
  outline: none; /* 去掉选中时的轮廓 */
  border: none;
  box-shadow: none;
  padding: 8px 0;
}

.editor-container p {
  margin: 6px 0;
}

.editor-toolbar {
  bottom: 0; /* 初始底部对齐 */
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  background-color: #fff;
  padding: 5px 0;
  border-top: 1px solid #e0e0e0;
  z-index: 1000;
  transition: bottom 0.2s ease;
}

.editor-btn {
  color: #616161;
  transition: color 0.2s ease;
}

.editor-btn:hover {
  color: #1976d2;
}

.ProseMirror p.is-editor-empty::before {
  content: attr(data-placeholder);
  color: #a9a9a9;
  float: left;
  height: 0;
  pointer-events: none;
  user-select: none;
}

</style>

<style lang="less" scoped>
@import '~@/vant-variables.less';
.newcollection {
  display: flex;
  flex-direction: column;
  margin: 20px;
  &__input {
    margin-bottom: 15px !important;
    margin-top: 0px !important;
    &__label {
      font-size: 14px;
    }
  }
}
</style>