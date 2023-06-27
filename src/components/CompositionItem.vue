<template>
    <div class="border border-gray-200 p-3 mb-4 rounded">
        <div v-show="!showForm">
            <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
            <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
                <i class="fa fa-times"></i>
            </button>
            <button 
                class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
                @click.prevent="showForm = !showForm"
            >
                <i class="fa fa-pencil-alt"></i>
            </button>
        </div>
        <div v-show="showForm">
            <div 
                class="text-white text-center font-bold p-4 mb-4 rounded" 
                v-if="showAlert"
                :class="alertVariant"
            >
                {{ alertMessage }}
            </div>
            <vee-form :validation-schema="schema" :initial-values="song" @submit="edit">
                <div class="mb-3">
                    <label class="inline-block mb-2">Song Title</label>
                    <vee-field type="text"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Song Title" 
                        name="modifiedName"/>
                    <ErrorMessage class="text-red-600" name="modifiedName" />
                </div>
                <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <vee-field type="text"
                        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                        placeholder="Enter Genre" 
                        name="genre"/>
                    <ErrorMessage class="text-red-600" name="genre" />
                </div>
                <button 
                    type="submit" 
                    class="py-1.5 px-3 rounded text-white bg-green-600 mr-2"
                    :disabled="inSubmission"
                >
                    Submit
                </button>
                <button 
                    type="button" 
                    class="py-1.5 px-3 rounded text-white bg-gray-600"
                    @click.prevent="showForm = false"
                    :disabled="inSubmission"
                >
                    Go Back
                </button>
            </vee-form>
        </div>
    </div>
</template>

<script>
import { songsCollection } from '@/includes/firebase'

export default {
    name: "CompositionItem",
    props: {
        song: {
            type: Object,
            required: true,
        },
        updateSong: {
            type: Function,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            showForm: false,
            schema: {
                modifiedName: "required|min:3|max:100",
                genre: "min:3|max:100|alpha_spaces"
            },
            inSubmission: false,
            showAlert: false,
            alertVariant: 'bg-blue-500',
            alertMessage: 'Please wait! Updating song info.'
        };
    },
    methods: {
        async edit(values) {
            this.inSubmission = true;
            this.showAlert = true;
            this.alertVariant = 'bg-blue-500';
            this.alertMessage = 'Please wait! Updating song info.';

            try {
                await songsCollection.doc(this.song.documentId).update(values)
            } catch (error) {
                this.inSubmission = false;
                this.alertVariant = 'bg-red-500';
                this.alertMessage = 'Something went wrong. Please try again later.';
                return;
            }

            this.updateSong(this.index, values)

            this.inSubmission = false;
            this.alertVariant = 'bg-green-500';
            this.alertMessage = 'Success';
        }
    }
}
</script>