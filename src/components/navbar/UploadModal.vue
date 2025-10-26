<script setup>
import { ref } from 'vue'
import { writeBulkToTable, clearTable } from '../../dbFunctions'

const fileInput = ref(null);
const myModal = ref(null);

const openModal = () => {
    myModal.value.showModal();
};

const saveJson = () => {
  const files = fileInput.value.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = JSON.parse(e.target.result);
      const monster_list = json.monster;
      writeBulkToTable(monster_list);
    };
    reader.readAsText(file);
  }
  myModal.value.close();
};

const deleteData = () => {
    clearTable();
};
</script>

<template>
    <button @click="openModal" class="btn btn-primary btn-square btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M450-313v-371L330-564l-43-43 193-193 193 193-43 43-120-120v371h-60ZM220-160q-24 0-42-18t-18-42v-143h60v143h520v-143h60v143q0 24-18 42t-42 18H220Z"/>
        </svg>
    </button>

    <dialog id="upload_modal" class="modal" ref="myModal">
        <div class="modal-box">
            <h3 class="font-bold text-lg">Upload JSON Monster File</h3>
            <div class="py-4 space-y-4">
                <input type="file" multiple ref="fileInput" class="file-input file-input-bordered w-full" />
                <button @click="saveJson" class="btn btn-primary w-full">Save</button>
                <button @click="deleteData" class="btn btn-error w-full">Delete all data</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>

<style scoped>

</style>
