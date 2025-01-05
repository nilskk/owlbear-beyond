<script setup>
import { ref, toRefs } from 'vue'
import { useRollButtonListeners } from '../composables/useRollButtonListeners';

const props = defineProps({
    monster: Object
})

const { monster } = toRefs(props)

const attributeModifier = (attribute) => Math.floor((attribute - 10) / 2);

const emit = defineEmits(['rollDice'])
useRollButtonListeners(emit)

</script>

<template>
    <div class="join w-full justify-evenly">
        <table class="table table-xs table-zebra font-bold">
            <thead>
                <th></th>
                <th></th>
                <th>MOD</th>
                <th>SAVE</th>
            </thead>
            <tbody>
                <tr>
                    <td>STR</td>
                    <td>
                        <div class="text-primary ">{{ monster.str }}</div>
                    </td>
                    <td>
                        <button class="btn btn-xs btn-outline btn-secondary font-bold rollButton" >
                            {{attributeModifier(monster.str) >= 0 ? '+' : '' }}{{attributeModifier(monster.str) }}
                        </button>
                    </td>
                    <td>
                        <p v-if=monster.save?.str>
                            <button class="btn btn-xs btn-outline btn-accent font-bold rollButton" >
                                {{monster.save.str}}
                            </button>
                        </p>
                        <p v-else>
                            <button class="btn btn-xs btn-outline btn-accent font-bold rollButton" >
                                {{attributeModifier(monster.str) >= 0 ? '+' : '' }}{{attributeModifier(monster.str) }}
                            </button>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>INT</td>
                    <td>
                        <div class="text-primary">{{ monster.int }}</div>
                    </td>
                    <td>
                        <button class="btn btn-xs btn-outline btn-secondary font-bold rollButton" >
                            {{attributeModifier(monster.int) >= 0 ? '+' : '' }}{{attributeModifier(monster.int) }}
                        </button>
                    </td>
                    <td>
                        <p v-if=monster.save?.int>
                            <button class="btn btn-xs btn-outline btn-accent font-bold rollButton" >
                                {{monster.save.int}}
                            </button>
                        </p>
                        <p v-else>
                            <button class="btn btn-xs btn-outline btn-accent font-bold rollButton" >
                                {{attributeModifier(monster.int) >= 0 ? '+' : '' }}{{attributeModifier(monster.int) }}
                            </button>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="divider divider-horizontal m-0"></div>
        <table class="table table-xs table-zebra font-bold">
            <thead>
                <th></th>
                <th></th>
                <th>MOD</th>
                <th>SAVE</th>
            </thead>
            <tbody>
                <tr>
                    <td>DEX</td>
                    <td>
                        <div class="text-primary ">{{ monster.dex }}</div>
                    </td>
                    <td>
                        <button class="btn btn-xs btn-outline btn-secondary font-bold rollButton" >
                            {{attributeModifier(monster.dex) >= 0 ? '+' : '' }}{{attributeModifier(monster.dex) }}
                        </button>
                    </td>
                    <td>
                        <p v-if=monster.save?.dex>
                            <button class="btn btn-xs btn-outline btn-accent font-bold rollButton" >
                                {{monster.save.dex}}
                            </button>
                        </p>
                        <p v-else>
                            <button class="btn btn-xs btn-outline btn-accent font-bold rollButton" >
                                {{attributeModifier(monster.dex) >= 0 ? '+' : '' }}{{attributeModifier(monster.dex) }}
                            </button>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>WIS</td>
                    <td>
                        <div class="text-primary">{{ monster.wis }}</div>
                    </td>
                    <td>
                        <button class="btn btn-xs btn-outline btn-secondary font-bold rollButton" >
                            {{attributeModifier(monster.wis) >= 0 ? '+' : '' }}{{attributeModifier(monster.wis) }}
                        </button>
                    </td>
                    <td>
                        <p v-if=monster.save?.wis>
                            <button class="btn btn-xs btn-outline btn-accent font-bold rollButton" >
                                {{monster.save.wis}}
                            </button>
                        </p>
                        <p v-else>
                            <button class="btn btn-xs btn-outline btn-accent font-bold rollButton" >
                                {{attributeModifier(monster.wis) >= 0 ? '+' : '' }}{{attributeModifier(monster.wis) }}
                            </button>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="divider divider-horizontal m-0"></div>
        <table class="table table-xs table-zebra font-bold">
            <thead>
                <th></th>
                <th></th>
                <th>MOD</th>
                <th>SAVE</th>
            </thead>
            <tbody>
                <tr>
                    <td>CON</td>
                    <td>
                        <div class="text-primary ">{{ monster.con }}</div>
                    </td>
                    <td>
                        <button class="btn btn-xs btn-outline btn-secondary font-bold rollButton" >
                            {{attributeModifier(monster.con) >= 0 ? '+' : '' }}{{attributeModifier(monster.con) }}
                        </button>
                    </td>
                    <td>
                        <p v-if=monster.save?.con>
                            <button class="btn btn-xs btn-outline btn-accent font-bold rollButton" >
                                {{monster.save.con}}
                            </button>
                        </p>
                        <p v-else>
                            <button class="btn btn-xs btn-outline btn-accent font-bold rollButton" >
                                {{attributeModifier(monster.con) >= 0 ? '+' : '' }}{{attributeModifier(monster.con) }}
                            </button>
                        </p>
                    </td>
                </tr>
                <tr>
                    <td>CHA</td>
                    <td>
                        <div class="text-primary">{{ monster.cha }}</div>
                    </td>
                    <td>
                        <button class="btn btn-xs btn-outline btn-secondary font-bold rollButton" >
                            {{attributeModifier(monster.cha) >= 0 ? '+' : '' }}{{attributeModifier(monster.cha) }}
                        </button>
                    </td>
                    <td>
                        <p v-if=monster.save?.cha>
                            <button class="btn btn-xs btn-outline btn-accent font-bold rollButton" >
                                {{monster.save.cha}}
                            </button>
                        </p>
                        <p v-else>
                            <button class="btn btn-xs btn-outline btn-accent font-bold rollButton" >
                                {{attributeModifier(monster.cha) >= 0 ? '+' : '' }}{{attributeModifier(monster.cha) }}
                            </button>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped></style>