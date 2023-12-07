<template>
    <div class="main-left col-span-1">
            <div class="p-4 bg-white border border-gray-200 rounded-lg">
                <div class="space-y-4">
                        <div class="flex items-center space-x-2">
                            <template
                                v-for="user in users"
                                v-bind:key="user.id"
                            >
                                <div @click="getMessages(user.conversation_id)">
                                    <img src='头像.jpeg' class="w-[40px] rounded-full">
                                    <p 
                                        class="text-xs font-bold"
                                        v-if="user.id !== userStore.user.id"
                                    >{{ user.name }}</p>
                                </div>
                                
                            </template>
                        </div>
                </div>
            </div>
        </div>

        <div class="main-center col-span-3 space-y-4">
            <div class="bg-white border border-gray-200 rounded-lg">
                <div class="flex flex-col flex-grow p-4">
                    <template v-if="this.conversation === -1">
                        <p>Please click on one of your friends.</p>
                    </template>
                    <template
                        v-else
                        v-for="message in messages"
                        v-bind:key="message.user_id"
                    >
                        <div 
                            class="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end"
                            v-if="message.user_id == userStore.user.id"
                        >
                            <div>
                                <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                                    <p class="text-sm">{{ message.content }}</p>
                                </div>
                                <span class="text-xs text-gray-500 leading-none">{{ Math.floor((new Date() - new Date(message.time)) / (1000 * 60)) }} mins ago</span>
                            </div>
                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                                <img src='头像.jpeg' class="w-[40px] rounded-full">
                            </div>
                        </div>

                        <div 
                            class="flex w-full mt-2 space-x-3 max-w-md"
                            v-else
                        >
                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                                <img src='头像.jpeg' class="w-[40px] rounded-full">
                            </div>
                            <div>
                                <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                                    <p class="text-sm">{{ message.content }}</p>
                                </div>
                                <span class="text-xs text-gray-500 leading-none">{{ Math.floor((new Date() - new Date(message.time)) / (1000 * 60)) }} mins ago</span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg">
                <form v-on:submit.prevent="submitForm">
                    <div class="p-4">  
                        <textarea v-model="body" class="p-4 w-full bg-gray-100 rounded-lg" placeholder="What do you want to say?"></textarea>
                    </div>

                    <div class="p-4 border-t border-gray-100 flex justify-between">
                        <button class="inline-block py-4 px-6 bg-purple-600 text-white rounded-lg">Send</button>
                    </div>
                </form>
            </div>
        </div>
</template>

<script>
import { useUserStore } from '@/stores/user'
import { io } from "socket.io-client";

export default {
    name: 'chat',
    setup() {
        const URL ="http://localhost:1000";
        const socket = io(URL);

        const userStore = useUserStore();
        return {
            socket,
            userStore
        }
    },
    data() {
        return {
            users: [],
            messages: [],
            conversation: -1,
            activeConversation: {},
            body: ''
        }
    },

    mounted() {
        this.socket.on("connect", () => {
            console.log("socket connected");
        });

        this.socket.on("disconnect", (message) => {
            console.log("disconnected: ", message);
        });

        this.socket.on("getMessage", (message) => {
            this.messages.push(message);
        });
        this.getContacts();
    },
    
    methods: {
        getContacts() {
            const currentUserId = this.userStore.user.id;
            fetch(`http://localhost:1000/api/getConversation?id=${currentUserId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(friends => {
                // users: [{name: "Weifan Wu", url: "头像.jpeg", id: "41", conversation_id: "1"}],

                this.users = friends.map((friend) => {
                    return {name: friend.other_user, url: "头像.jpeg", id: friend.other_id, conversation_id: friend.conversation_id};
                });
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors
            });
            
        },
        getMessages(conversation_id) {
            this.conversation = conversation_id
            fetch(`http://localhost:1000/api/getMessages?conversation_id=${conversation_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(messages => {
                this.messages = messages;
            })
            .catch(error => {
                console.error('Error:', error);
            });
        },
        submitForm() {
            const conversation_id = this.conversation;
            if (this.conversation_id != -1) {
                const user_id = this.userStore.user.id;
                const now = new Date();
                const year = now.getFullYear();
                const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
                const day = now.getDate().toString().padStart(2, '0');
                const hours = now.getHours().toString().padStart(2, '0');
                const minutes = now.getMinutes().toString().padStart(2, '0');
                const seconds = now.getSeconds().toString().padStart(2, '0');
                const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                const message = {content: this.body, time: formattedTime, user_id: user_id};
                this.socket.emit("message", message);
                const data = {
                    message: message,
                    conversation_id: conversation_id,
                };
                fetch('http://localhost:1000/api/addMessage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then(response => response.json())
                .then(data => console.log('Success'))
                .catch(error => console.error('Error:', error));
            }
        }}
}
</script>