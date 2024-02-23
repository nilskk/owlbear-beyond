<script setup>
import { ref } from 'vue'
import monster from '../assets/werebear.json'
</script>

<template>
    <!-- <div class="stats shadow-xl flex">
        <div class="stat" v-for="ac_elem in monster.ac">
            <div class="stat-title">Armor Class</div>
            <div class="stat-desc">
                <div v-if="ac_elem.from">{{ac_elem.from[0]}}</div>
                <div v-else>-</div>
            </div>
            <div class="stat-value text-primary text-2xl">{{ac_elem.ac}}</div>
            <div class="stat-desc">
                <div v-if="ac_elem.condition">{{ac_elem.condition}}</div>
                <div v-else>-</div>
            </div>    
        </div>
        <div class="stat" v-for="(item, key ) in monster.speed">
            <div class="stat-title">Speed</div>
            <div class="stat-desc">{{key}}</div>
            <div class="stat-value text-primary text-2xl">
                <div v-if="item.number">{{item.number}} ft.</div>
                <div v-else>{{item}} ft.</div>
            </div>
            <div class="stat-desc">
                <div v-if="item.number">{{item.condition}}</div>
                <div v-else>-</div>
            </div>
        </div>
    </div> -->
    <div class="flex w-full">
        <p class="font-bold">Armor Class:&nbsp;</p>
        <div v-for="ac_elem in monster.ac">
            <span class="text-primary font-bold">{{ac_elem.ac}}&nbsp;</span>

            <span v-if="ac_elem.from">({{ac_elem.from[0]}})&nbsp;</span>

            <span v-if="ac_elem.condition">{{ac_elem.condition}};&nbsp;</span>
        </div>
    </div>

    <div class="flex w-full">
        <p class="font-bold">Speed:&nbsp;</p>
        <div v-for="(item, key) in monster.speed">
            <span class="">{{key}}&nbsp;</span>

            <span class="text-primary font-bold" v-if="item.number">{{item.number}} ft.&nbsp;</span>
            <span class="text-primary font-bold" v-else>{{item}} ft.&nbsp;</span>

            <span v-if="item.number">{{item.condition}};&nbsp;</span>
        </div>
    </div>
</template>

<style scoped></style>