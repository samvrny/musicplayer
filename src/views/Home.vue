<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">Listen to Great Music!</h1>
          <!-- <p class="w-full md:w-8/12 mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus et dolor mollis, congue
            augue non, venenatis elit. Nunc justo eros, suscipit ac aliquet imperdiet, venenatis et
            sapien. Duis sed magna pulvinar, fringilla lorem eget, ullamcorper urna.
          </p> -->
        </div>
      </div>

      <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full" src="/assets/img/introduction-music.png" />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon.right="'headphones-alt'">
          <span class="card-title">Songs</span>
          <!-- Icon -->

        </div>
        <!-- Playlist -->
        <ol id="playlist">
          <song-item v-for="song in songs" :key="song.documentId" :song="song">
          </song-item>
        </ol>
        <!-- .. end Playlist -->
      </div>
    </section>
  </main>
</template>

<script>
import { songsCollection } from '@/includes/firebase';
import SongItem from '@/components/SongItem.vue';

export default {
  name: 'Home',
  components: {
    SongItem
  },
  data() {
    return {
      songs: [],
      maxPerPage: 15,
      pendingRequest: false,
    }
  },
  async created() {
    this.getSongs();

    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    //this function is written to grab the songs and also enable the infinite scrolling look
    async getSongs() {
      let snapshots

      if(this.pendingRequest) {
        return;
      }

      this.pendingRequest = true;

      if(this.songs.length) {
        const lastDocument = await songsCollection.doc(this.songs[this.songs.length -1].documentId).get();

        snapshots = await songsCollection
        .orderBy('modifiedName')
        .startAfter(lastDocument)
        .limit(this.maxPerPage)
        .get();
      } else {
        snapshots = await songsCollection
        .orderBy('modifiedName')
        .limit(this.maxPerPage)
        .get();
      };

      snapshots.forEach((document) => {
        this.songs.push({
          documentId: document.id,
          ...document.data(),
        });
      });

      this.pendingRequest = false;
    },
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;

      const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if(bottomOfWindow) {
        this.getSongs();
      }
    }
  },
}
</script>