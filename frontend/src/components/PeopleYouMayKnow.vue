<template>
  <div class="p-4 bg-white border border-gray-200 rounded-lg">
    <h3 class="mb-6 text-xl font-semibold">People You May Know</h3>
    <button @click="getRecommendations" class="mb-6 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Get Recommendations</button>
    
    <div v-if="users.length" class="space-y-4">
      <div v-for="user in users" :key="user.id" class="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm">
        <div class="flex items-center space-x-3">
          <img :src="user.avatar || '/头像.jpeg'" class="w-10 h-10 rounded-full object-cover" :alt="`${user.name}'s avatar`">
          <p class="text-sm font-medium">{{ user.name }}</p>
        </div>
        <RouterLink :to="{ name: 'profile', params: { id: user.id } }" class="py-1 px-3 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors">View Profile</RouterLink>
      </div>
    </div>

    <div v-if="songs.length" class="mt-8">
      <h4 class="text-lg font-semibold mb-3">Top Tracks</h4>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="(song, index) in songs" :key="index" class="song-item">
        <img :src="song.album.images[0].url" :alt="song.name" />
        <p>{{ song.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTopSongs } from '../spotify/getTopTrack.js';
import axios from 'axios';
import { useUserStore } from "../stores/user";

export default {
    data() {
        const userStore = useUserStore();
        return {
            userStore,
            users: [],
            songs: []
        }
    },

    mounted() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
            this.getTopSongs(code);
        } else {
          this.songs = this.userStore.user.songs;
          console.log("those are songs");
          console.log(this.songs);
        }
    },



    methods: {
      async getTopSongs(code) {
        this.songs = await getTopSongs(code);

        this.userStore.setSongs(this.songs);
      },
    async getRecommendations() {
      const currentUserId = this.userStore.user.id;
      if (!currentUserId) {
        console.error("User ID is undefined");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:1000/api/recommendations/${currentUserId}`);
        this.users = response.data.map(user => ({
          id: user.user_id, 
          name: user.username,
          avatar: user.avatar
        }));
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }
  }
};
</script>