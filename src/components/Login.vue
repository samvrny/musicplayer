<template>
    <!-- Login Form -->
    <vee-form :validation-schema="loginSchema" @submit="login">
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <vee-field type="email" name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
            <ErrorMessage class="text-red-600" name="email" />
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Password</label>
            <vee-field type="password" name="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password" />
            <ErrorMessage class="text-red-600" name="password" />
        </div>
        <button type="submit" :disabled="login_in_submission"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700">
            Submit
        </button>
        <div class="text-white text-center font-bold p-4 mb-4 mt-4 rounded" v-if="login_show_alert"
            :class="login_alert_variant">
            {{ login_alert_message }}
        </div>
    </vee-form>
</template>

<script>
import { mapActions } from 'pinia';
//importing the user store
import useUserStore from '@/stores/user';

export default {
    name: 'Login',
    data() {
        return {
            loginSchema: {
                email: 'required|email',
                password: 'required'
            },
            login_in_submission: false,
            login_show_alert: false,
            login_alert_variant: 'bg-blue-500',
            login_alert_message: 'Logging in.'
        }
    },
    methods: {
        //grabbing the authenticate funtion from the actions in the user store. 
        ...mapActions(useUserStore, ['authenticate']),
        async login(values) {
            this.login_in_submission = true;
            this.login_show_alert = true;
            this.login_alert_variant = 'bg-blue-500';
            this.login_alert_message = 'Logging in.';

            try {
                await this.authenticate(values)
            } catch (error) {
                this.login_in_submission = false;
                this.login_alert_variant = 'bg-red-500';
                this.login_alert_message = 'Invalid login credentials. Please try again.';
                return;
            }

            this.login_alert_variant = 'bg-green-500';
            this.login_alert_message = 'Success! You are logged in.';
            window.location.reload();
        }
    }
}
</script>