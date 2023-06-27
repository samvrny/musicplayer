<template>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
        <div class="md:grid md:grid-cols-3 md:gap-4">
            <div class="col-span-1">
                <app-upload ref="upload"></app-upload>
            </div>
            <div class="col-span-2">
                <div class="bg-white rounded border border-gray-200 relative flex flex-col">
                    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                        <span class="card-title">My Songs</span>
                        <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
                    </div>
                    <div class="p-6">
                        <!-- Composition Items -->
                        <composition-item 
                            v-for="(song, i) in songs" 
                            :key="song.documentId" 
                            :song="song"
                            :updateSong="updateSong"
                            :index="i"
                            :removeSong="removeSong">
                        </composition-item>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import AppUpload from '@/components/Upload.vue'
import CompositionItem from '@/components/CompositionItem.vue'
import { songsCollection, auth } from '@/includes/firebase'

export default {
    name: 'Manage',
    data() {
        return {
            songs: []
        }
    },
    components: {
        AppUpload,
        CompositionItem
    },
    async created() {
        const snapshot =await songsCollection.where('userId', '==', auth.currentUser.uid).get();
        
        snapshot.forEach((document) => {
            const song = {
                ...document.data(),
                documentId: document.id,
            }

            this.songs.push(song);
        })
    },
    methods: {
        updateSong(i, values) {
            this.songs[i].modifiedName = values.modifiedName;
            this.songs[i].genre = values.genre
        },
        removeSong(i) {
            this.songs.splice(i, 1);
        }
    }

}
</script>

<!-- // beforeRouteLeave(to, from, next) { TODO: This is an example of using references. 
    //     this.$refs.upload.cancelUploads();
    //     next();
    // } -->

<!-- //TODO: remove the below code. For anyone looking at this: The below code is left in as an example to myself on guarding routes within a component. This code was in and would be put back into the script block if I wished to use it again. 
// beforeRouteEnter(to, from, next) {
//     const store = useUserStore();

//     //check if the user is logged in before rendering the manage page 
//     if (store.userLoggedIn) {
//         next();
//     } else {
//         // if the user is not logged in, send them to the home page
//         next({
//             name: 'home'
//         });
//     }
// } -->