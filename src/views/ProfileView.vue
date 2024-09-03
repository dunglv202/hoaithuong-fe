<template>
  <div class="nav">
    <el-button class="btn-close" :icon="IconX" circle @click="closeView" />
  </div>
  <div class="container">
    <el-avatar :size="80" :src="profile.avatar">
      <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
    </el-avatar>
    <div>
      <span class="name">{{ profile.displayName }}</span>
    </div>
    <el-form label-position="left">
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
      <el-button :loading="submitting" class="btn-submit" type="primary" @click="save">
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

.btn-submit {
  width: 100%;
}

.inp {
  width: 300px;
}

.name {
  font-size: 1.25rem;
  font-weight: 500;
}
</style>

<script lang="ts" setup>
import { type DetailProfile } from '@/models/user'
import { getDetailProfile, updateDetailProfile } from '@/services/user-service'
import { IconX } from '@tabler/icons-vue'
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

const save = async () => {
  try {
    submitting.value = true
    await updateDetailProfile(profile.value)
    ElMessage({
      message: 'Saved successfully',
      type: 'success'
    })
  } finally {
    submitting.value = false
  }
}

const closeView = () => {
  router.back()
}

onMounted(async () => {
  profile.value = await getDetailProfile()
})
</script>
