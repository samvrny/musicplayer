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
            <input type="file" multiple @change="upload($event)">
            <hr class="my-6" />
            <!-- Progess Bars -->
            <div class="mb-4" v-for="upload in uploads" :key="upload.name">
                <!-- File Name -->
                <div class="font-bold text-sm" :class="upload.text_class">
                    <i :class="upload.icon"></i>{{ ' ' + upload.name }}
                </div>
                <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                    <!-- Inner Progress Bar -->
                    <div 
                        class="transition-all progress-bar" 
                        :class="upload.variant"
                        :style="{ width: upload.current_progress + '%' }"
                    >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase'

export default {
    name: 'Upload',
    props: ['addSong'],
    data() {
        return {
            is_dragover: false,
            uploads: [],
        }
    },
    beforeUnmount() {
        this.uploads.forEach((upload) => {
            upload.task.cancel();
        })
    },
    methods: {
        upload($event) {
            //set the background color back to white once the file has been dropped into the uploader
            this.is_dragover = false;

            const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files];

            files.forEach((file) => {
                //validate that the file is an audio file
                if(file.type !== 'audio/mpeg') {
                    return;
                }

                //check to see if the internet connection is online
                if(!navigator.onLine) {
                    this.uploads.push({
                        task: {},
                        current_progress: 100,
                        name: file.name,
                        variant: 'bg-red-400',
                        icon: 'fas fa-times',
                        text_class: 'text-red-400'
                    })
                    return;
                }

                const storageReference = storage.ref('songs'); //mega-music-46b8c.appspot.com
                const songsReference = storageReference.child(`songs/${file.name}`)
                const task = songsReference.put(file);

                const uploadIndex = this.uploads.push({
                    task, 
                    current_progress: 0,
                    name: file.name,
                    variant: 'bg-cyan-400',
                    icon: 'fas fa-spinner fa-spin',
                    text_class: ''
                }) - 1;

                task.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    this.uploads[uploadIndex].current_progress = progress;  
                }, (error) => {
                    this.uploads[uploadIndex].variant = 'bg-red-400';
                    this.uploads[uploadIndex].icon = 'fas fa-times';
                    this.uploads[uploadIndex].text_class = 'text-red-400';
                    console.log(error);
                }, async () => {
                    const song = {
                        userId: auth.currentUser.uid,
                        displayName: auth.currentUser.displayName,
                        originalName: task.snapshot.ref.name,
                        modifiedName: task.snapshot.ref.name,
                        genre: '',
                        commentCount: 0,
                    }

                    song.url = await task.snapshot.ref.getDownloadURL();
                    const songReference = await songsCollection.add(song);
                    const songSnapshot = await songReference.get();

                    this.addSong(songSnapshot);

                    this.uploads[uploadIndex].variant = 'bg-green-400';
                    this.uploads[uploadIndex].icon = 'fas fa-check';
                    this.uploads[uploadIndex].text_class = 'text-green-400';
                })
            })
        },
        cancelUploads() {
            this.uploads.forEach((upload) => {
                upload.task.cancel();
            })
        }
    }
}
</script>