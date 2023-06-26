<template>
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Upload</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
            <!-- Upload Dropbox -->
            <div
                class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500"
                :class="{ 'bg-green-400 border-green-400 border-solid' : is_dragover }"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragover = false"
                @dragover.prevent.stop="is_dragover = true"
                @dragenter.prevent.stop="is_dragover = true"
                @dragleave.prevent.stop="is_dragover = false"
                @drop.prevent.stop="upload($event)"
                >
                <h5>Drop your files here</h5>
            </div>
            <hr class="my-6" />
            <!-- Progess Bars -->
            <div class="mb-4" v-for="upload in uploads" :key="upload.name">
                <!-- File Name -->
                <div class="font-bold text-sm">{{ upload.name }}</div>
                <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                    <!-- Inner Progress Bar -->
                    <div 
                        class="transition-all progress-bar bg-cyan-400" 
                        :class="'bg-cyan-400'"
                        :style="{ width: upload.current_progress + '%' }"
                    >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { storage } from '@/includes/firebase'

export default {
    name: 'Upload',
    data() {
        return {
            is_dragover: false,
            uploads: [],
        }
    },
    methods: {
        upload($event) {
            //set the background color back to white once the file has been dropped into the uploader
            this.is_dragover = false;

            const files = [...$event.dataTransfer.files];

            files.forEach((file) => {
                //validate that the file is an audio file
                if(file.type !== 'audio/mpeg') {
                    return;
                }

                const storageReference = storage.ref('songs'); //mega-music-46b8c.appspot.com
                const songsReference = storageReference.child(`songs/${file.name}`)
                const task = songsReference.put(file);

                this.uploads.push({
                    task, 
                    current_progress: 0,
                    name: file.name,
                });

                task.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    
                })
            
            })

            console.log(files)
        }
    }
}
</script>