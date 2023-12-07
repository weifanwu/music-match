<template>
  <div class="chat-container">
    <button @click="sendQuery" class="send-button bg-purple-600">
      Create My Music Introduction
    </button>
    <div class="response-box">
      Response: <div v-if="chatResponse" class="response">{{ chatResponse }}</div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      songs: 'Fast Animals by the Strokes, Disco 2000 by Pulp, Sugar Girl by The Cure',
      chatResponse: ''
    };
  },
  methods: {
    async sendQuery() {
      const messagePrompt = `Give me a paragraph introduction of my music style. Include 10 emojis at the last whole line to represent my style. My top tracks are ${this.songs}.`;

      try {
        const url = process.env.VITE_API_URL
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: messagePrompt }),
        });

        if (response.ok) {
          const data = await response.json();
          this.chatResponse = data;
        } else {
          console.error('Error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
  },

  }
}
</script>

<style scoped>
.chat-container {
  max-width: 500px;
  height: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chat-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.send-button {
  width: 100%;
  padding: 10px;
  background-color: bg-purple-600;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:hover {
  background-color: rgb(113, 39, 183);;
}

.response {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.response-box {
  height: 300px;
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.response {
  white-space: pre-line;
}

</style>


