<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div class="text-center">
        <h1 class="text-5xl font-bold mb-6">Welcome to Music Match</h1>
        <p class="text-xl mb-6">Sign in to find music buddies!</p>
        <button 
          @click="getSongs"
          class="flex items-center justify-center bg-black text-white px-6 py-3 rounded-full"
        >
          <img src="/spotify-icon.png" alt="Spotify logo" class="w-6 h-6 mr-2">
        </button>
      </div>
    </div>
  </template>


<script>
import { getTopSongs } from '../spotify/getTopTrack.js';

import { useUserStore } from '@/stores/user'

export default {
    setup() {
        const userStore = useUserStore()

        return {
            userStore
        }
    },

    data() {
        return {
            spotifyUser: null,
            topTrack: [],
            genres: [],
        }
    },
    methods: {
       
        async getSongs() {
            try {
            const { user, songs, genres} = await getTopSongs();
                this.spotifyUser = user;
                this.topTrack = songs;
                this.genres = genres;

                this.$router.push({ name: 'Profile' });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        },
    }
}
</script>