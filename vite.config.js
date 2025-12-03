import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, "index.html"),
                indexloggedin: resolve(__dirname, "indexloggedin.html"),
                login: resolve(__dirname, "login.html"),
                main: resolve(__dirname, "main.html"),
                profile: resolve(__dirname, "profile.html"),
                signup: resolve(__dirname, "signup.html"),
                myGroup: resolve(__dirname, "myGroup.html"),
                groupChat: resolve(__dirname, "groupChat.html")
            }
        }
    }
});
