<template>
    <!-- Registration Form -->
    <vee-form :validation-schema="registrationSchema" @submit="register" :initial-values="userData">
        <!-- Name -->
        <div class="mb-3">
            <label class="inline-block mb-2">Name</label>
            <vee-field type="text" name="name"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Name" />
            <ErrorMessage class="text-red-600" name="name" />
        </div>
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <vee-field type="email" name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
            <ErrorMessage class="text-red-600" name="email" />
        </div>
        <!-- Age -->
        <div class="mb-3">
            <label class="inline-block mb-2">Age</label>
            <vee-field type="number" name="age"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded" />
            <ErrorMessage class="text-red-600" name="age" />
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Password</label>
            <vee-field name="password" :bails="false" v-slot="{ field, errors }">
                <input
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                    placeholder="Password" type="password" v-bind="field" />
                <div class="text-red-600" v-for="error in errors" :key="error">{{ error }}</div>
            </vee-field>
        </div>
        <!-- Confirm Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Confirm Password</label>
            <vee-field type="password" name="confirm_password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Confirm Password" />
            <ErrorMessage class="text-red-600" name="confirm_password" />
        </div>
        <!-- Country -->
        <div class="mb-3">
            <label class="inline-block mb-2">Country</label>
            <vee-field as="select" name="country"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Germany">Canada</option>
            </vee-field>
            <ErrorMessage class="text-red-600" name="country" />
        </div>
        <!-- TOS -->
        <div class="mb-3 pl-6">
            <vee-field type="checkbox" name="tos" value="1" class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
            <label class="inline-block">Accept terms of service</label>
            <br>
            <ErrorMessage class="text-red-600" name="tos" />
        </div>
        <button type="submit"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            :disabled="registration_in_submission">
            Submit
        </button>
        <div class="text-white text-center font-bold p-4 rounded mb-4 mt-4" v-if="registration_show_alert"
            :class="registration_alert_variant">
            {{ registration_alert_message }}
        </div>
    </vee-form>
</template>

<script>
import { mapActions } from 'pinia';
import useUserStore from '@/stores/user';

export default {
    name: 'Registration',
    data() {
        return {
            tab: 'login',
            registrationSchema: {
                name: 'required|min:3|max:100|alpha_spaces',
                email: 'required|email|min:3|max:100',
                age: 'required|min_value:12|max_value:125',
                password: 'required|min:6|max:100|excluded:password',
                confirm_password: 'passwords_mismatch:@password',
                country: 'required',
                tos: 'tos'
            },
            userData: {
                country: 'USA'
            },
            registration_in_submission: false,
            registration_show_alert: false,
            registration_alert_variant: 'bg-blue-500',
            registration_alert_message: 'Please wait a moment while we create your account.'
        }
    },
    methods: {
        ...mapActions(useUserStore, {
            //give an alias to the register action in user.js
            createUser: 'register'
        }),
        async register(values) {
            this.registration_show_alert = true;
            this.registration_in_submission = true;
            this.registration_alert_variant = 'bg-blue-500';
            this.registration_alert_message = 'Please wait a moment while we create your account.';

            //authentication for creating a user
            try {
                //calling the 'register' function in user.js under the alias created above, createUser. Passing in the values from the form as arguments
                await this.createUser(values)
            } catch (error) {
                this.registration_in_submission = false;
                this.registration_alert_variant = 'bg-red-500';
                this.registration_alert_message = 'An unexpected error occured. Please try again later';

                return;
            }

            this.registration_alert_variant = 'bg-green-500';
            this.registration_alert_message = 'Success! Your account has been created.'
            window.location.reload();
        }
    },
}
</script>