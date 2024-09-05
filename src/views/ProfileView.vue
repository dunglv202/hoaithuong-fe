<template>
  <div class="nav">
    <el-button class="btn-close" :icon="IconX" circle @click="closeView" />
  </div>
  <div class="container">
    <div v-loading="uploading" class="avatar__container" @click="changeAvatar">
      <el-avatar class="avatar" :src="profile.avatar" alt="avatar">
        <img class="placeholder" src="@/assets/user.svg" alt="avatar" />
      </el-avatar>
      <div class="avatar__overlay">
        <el-icon :size="23">
          <IconCamera />
        </el-icon>
      </div>
    </div>
    <div class="name-container">
      <h2 class="name" contenteditable="true" ref="nameElement">
        {{ profile.displayName }}
      </h2>
      <el-icon class="icon__edit-name" :size="18">
        <IconPencil />
      </el-icon>
    </div>
    <el-form v-loading="fetching" class="profile-form" :label-position="labelPosition">
      <el-form-item label="General report URL" label-width="150px">
        <el-input
          class="inp"
          v-model="profile.configs.generalReportUrl"
          placeholder="Spreadsheet URL"
        />
      </el-form-item>
      <el-form-item label="Sheet name" label-width="150px">
        <el-input
          class="inp"
          v-model="profile.configs.generalReportSheet"
          placeholder="Sheet name"
        />
      </el-form-item>
      <el-divider border-style="dashed" />
      <el-form-item label="Detail report URL" label-width="150px">
        <el-input
          class="inp"
          v-model="profile.configs.detailReportUrl"
          placeholder="Spreadsheet URL"
        />
      </el-form-item>
      <el-form-item label="Sheet name" label-width="150px">
        <el-input
          class="inp"
          v-model="profile.configs.detailReportSheet"
          placeholder="Sheet name"
        />
      </el-form-item>
      <el-button
        :loading="submitting"
        class="btn-submit"
        type="primary"
        @click="save"
        :icon="IconSquareRoundedCheck"
      >
        Save
      </el-button>
    </el-form>
  </div>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
}

.btn-close {
  float: right;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 50px;
}

.name-container {
  position: relative;
  display: flex;
  left: -5px;
}

.name {
  padding: 5px 10px;
  outline: none;
}

.icon__edit-name {
  cursor: pointer;
  position: absolute;
  left: calc(100% - 5px);
  top: 12px;
}

.btn-submit {
  width: 100%;
}

.inp {
  width: 300px;
}

.avatar__container {
  --el-mask-color: rgba(255, 255, 255, 0.2);
  position: relative;
  height: 100px;
  width: 100px;
  border-radius: 50%;
  overflow: hidden;
  user-select: none;
}

.avatar__container:hover .avatar__overlay {
  opacity: 1;
}

.avatar__overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  color: white;
  opacity: 0;
  transition: 0.1s ease-in;
}

.avatar {
  height: 100%;
  width: 100%;
}

.avatar img.placeholder {
  width: 50%;
  height: 50%;
}

.name {
  font-size: 1.25rem;
  font-weight: 500;
}

@media screen and (max-width: 768px) {
  .profile-form {
    width: 100%;
    padding: 10px;
  }

  .inp {
    width: 100%;
  }
}
</style>

<script lang="ts" setup>
import { MOBILE_BREAKPOINT } from '@/configs/layout-config'
import { type DetailProfile } from '@/models/user'
import { getDetailProfile, updateDetailProfile, uploadAvatar } from '@/services/user-service'
import useAuthStore from '@/stores/auth'
import { IconCamera, IconPencil, IconSquareRoundedCheck, IconX } from '@tabler/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const profile = ref<DetailProfile>({
  displayName: '-',
  configs: {
    generalReportUrl: '',
    generalReportSheet: '',
    detailReportUrl: '',
    detailReportSheet: ''
  }
})
const submitting = ref(false)
const router = useRouter()
const labelPosition = ref('left')
const fetching = ref(false)
const uploading = ref(false)
const nameElement = ref<HTMLElement | null>(null)
const authStore = useAuthStore()

const save = async () => {
  try {
    submitting.value = true
    await updateDetailProfile({
      ...profile.value,
      displayName: nameElement.value!.innerText!.trim()
    })
    ElMessage({
      message: 'Saved successfully',
      type: 'success'
    })
  } finally {
    submitting.value = false
    authStore.fetchUserInfo()
  }
}

const closeView = () => {
  router.back()
}

const changeAvatar = () => {
  const uploader = document.createElement('input')
  uploader.type = 'file'
  uploader.accept = 'image/jpeg,image/png,image/webp,image/gif'
  uploader.onchange = async (e) => {
    try {
      uploading.value = true
      const file = (e.target as HTMLInputElement).files?.[0]
      const { url: newAvatar } = await uploadAvatar(file!)
      profile.value.avatar = newAvatar
    } finally {
      uploading.value = false
      authStore.fetchUserInfo()
    }
  }
  uploader.click()
}

onMounted(async () => {
  labelPosition.value = window.innerWidth < MOBILE_BREAKPOINT ? 'top' : 'left'
  try {
    fetching.value = true
    profile.value = await getDetailProfile()
  } finally {
    fetching.value = false
  }
})

window.addEventListener('resize', () => {
  labelPosition.value = window.innerWidth < MOBILE_BREAKPOINT ? 'top' : 'left'
})
</script>
