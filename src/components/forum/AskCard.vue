<template>
  <v-card elevation="2" class="ask-card">
      <!-- 标题输入 -->
      <textarea
          v-model="title"
          class="title-input"
          placeholder="输入问题标题，并以问号结尾（必填）"
          @blur="checkTitle"
          @input="onTitleInput"
          ref="titleInput"
      ></textarea>

      <!-- 分割线 -->
      <hr class="divider" />

      <!-- 富文本编辑器 -->
      <div class="editor-container" ref="editorContent">
          <div class="editor-toolbar">
              <v-btn icon @click="openImageDialog" class="editor-btn">
                  <v-icon small>mdi-image</v-icon>
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
                      @change="uploadImage"
                  />
              </v-card-text>
              <v-card-actions>
                  <v-btn text @click="imageDialog = false">取消</v-btn>
                  <v-btn color="primary" @click="imageDialog = false">上传</v-btn>
              </v-card-actions>
          </v-card>
      </v-dialog>
  </v-card>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';

export default {
  name: 'AskCard',
  setup() {
      const title = ref('');
      const editorContent = ref(null);
      const editor = ref(null);
      const imageDialog = ref(false);
      const imageFile = ref(null);
      const titleInput = ref(null);

      onMounted(() => {
          editor.value = new Editor({
              element: editorContent.value,
              extensions: [
                  StarterKit,
                  Image,
                  Placeholder.configure({
                      placeholder: '请输入您的问题描述...',
                  })
              ],
              content: '',
          });
      });

      const checkTitle = () => {
        if (title.value && !title.value.trim().endsWith("？") && !title.value.trim().endsWith("?")) {
          title.value = title.value.trim() + "？";
        }
      };

      const onTitleInput = () => {
        // 自动调整高度
        const el = titleInput.value;
        el.style.height = '1px';    // 先重置高度
        el.style.height = el.scrollHeight + 'px'; // 根据内容设置高度
        if (title.value.trim().endsWith('?')) {
          setTimeout(() => {
            editor.value.chain().focus().run();
          }, 100);
        }
      };

      const openImageDialog = () => {
        imageDialog.value = true;
      };

      const uploadImage = () => {
          if (imageFile.value) {
              const reader = new FileReader();
              reader.onload = (e) => {
                  const imageUrl = e.target.result;
                  editor.value.commands.setImage({ src: imageUrl, alt: '上传图片' });
              };
              reader.readAsDataURL(imageFile.value);
          }
      };

      return {
          title,
          editorContent,
          checkTitle,
          onTitleInput,
          openImageDialog,
          imageDialog,
          imageFile,
          uploadImage,
          editor,
          titleInput
      };
  },
};
</script>

<style scoped>
.ask-card {
  max-width: 100%;
  margin: 10px auto;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px 15px;
  background-color: #fff;
}

.title-input {
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  border: none;
  outline: none;
  background-color: transparent;
  resize: none;         /* 禁止手动拉伸 */
  overflow: hidden;     /* 避免出现滚动条 */
  line-height: 1.5;
  height: auto;        /* 自动适应高度 */
  padding: 0;          /* 去掉内边距 */
  box-sizing: border-box; /* 包含 padding 和 border */
}

.divider {
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 4px 0;
}

.editor-container {
  min-height: 250px;
  border: none;
  padding: 4px 0;
  background-color: transparent;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
}

.editor-container p {
  margin: 6px 0;
}

.editor-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 6px;
}

.editor-btn {
  color: #616161;
  transition: color 0.2s ease;
}

.editor-btn:hover {
  color: #1976d2;
}
</style>
