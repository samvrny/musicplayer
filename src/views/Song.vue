<template>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
        <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
            style="background-image: url(/assets/img/song-header.png)"></div>
        <div class="container mx-auto flex items-center">
            <!-- Play/Pause Button -->
            <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none">
                <i class="fas fa-play"></i>
            </button>
            <div class="z-50 text-left ml-8">
                <!-- Song Info -->
                <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
                <div>{{ song.genre }}</div>
            </div>
        </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
                <!-- Comment Count -->
                <span class="card-title">Comments (15)</span>
                <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
            </div>
            <div class="p-6">
                <div 
                    class="text-white text-center font-bold p-4 mb-4 rounded" 
                    v-if="commentShowAlert" 
                    :class="commentAlertVariant"
                >
                    {{ commentAlertMessage }}
                </div>
                <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
                    <vee-field
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4 resize-none h-24"
                        placeholder="Your comment here..."
                        as="textarea"
                        name="comment"
                        ></vee-field>
                        <ErrorMessage class="text-red-600" name="comment" />
                    <button :disabled="commentInSubmission" type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block mt-4">
                        Submit
                    </button>
                </vee-form>
                <!-- Sort Comments -->
                <select v-model="sort" class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
                    <option value="1">Latest</option>
                    <option value="2">Oldest</option>
                </select>
            </div>
        </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
        <li class="p-6 bg-gray-50 border border-gray-200" v-for="comment in sortedComments" :key="comment.documentId">
            <!-- Comment Author -->
            <div class="mb-5">
                <div class="font-bold">{{ comment.name }}</div>
                <time>{{ comment.datePosted }}</time>
            </div>

            <p>
                {{ comment.content }}
            </p>
        </li>
    </ul>
</template>

<script>
import { songsCollection, auth, commentsCollection } from '@/includes/firebase';
import { mapState } from 'pinia';
import useUserStore from '@/stores/user';

export default {
    name: "Song",
    data() {
        return {
            song: {},
            comments: [],
            sort: '1',
            schema: {
                comment: "required|min:3",
            },
            commentInSubmission: false,
            commentShowAlert: false,
            commentAlertVariant: 'bg-blue-500',
            commentAlertMessage: 'Please wait while we submit your comment.'
        };
    },
    async created() {
        const documentSnapshot = await songsCollection.doc(this.$route.params.id).get();
        //checks if the snapshot exists
        if (!documentSnapshot.exists) {
            this.$router.push({ name: "home" });
            return;
        }
        this.song = documentSnapshot.data();

        this.getComments();
    },
    methods: {
        async addComment(values, { resetForm }) {
            this.commentInSubmission = true;
            this.commentShowAlert = true;
            this.commentAlertVariant = 'bg-blue-500';
            this.commentAlertMessage = 'Please wait while we submit your comment.';

            const comment = {
                content: values.comment,
                datePosted: new Date().toString(),
                sid: this.$route.params.id,
                name: auth.currentUser.displayName,
                uid: auth.currentUser.uid
            };

            await commentsCollection.add(comment);

            this.getComments();

            this.commentInSubmission = false;
            this.commentAlertVariant = 'bg-green-500';
            this.commentAlertMessage = 'Comment added!';

            resetForm();
        },
        async getComments() {
            const snapshots = await commentsCollection.where(
                'sid', '==', this.$route.params.id
            ).get();

            this.comments = [];

            snapshots.forEach((document) => {
                this.comments.push({
                    documentId: document.id,
                    ...document.data()
                })
            })
        }
    },
    computed: {
        ...mapState(useUserStore, ['userLoggedIn']),
        sortedComments() {
            //1 is for latest to oldest, 2 is for oldest to latest
            return this.comments.slice().sort((a, b) => {
                if(this.sort === '1') {
                    return new Date(b.datePosted) - new Date(a.datePosted)
                } 

                return new Date(a.datePosted) - new Date(b.datePosted)
            });
        }
    }
}
</script>