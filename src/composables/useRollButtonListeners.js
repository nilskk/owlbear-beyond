import { nextTick, onMounted, onUpdated } from 'vue';
import { useGlobalContextMenu } from './useGlobalContextMenu.js';

export function useRollButtonListeners(emit, eventName = 'rollDice') {
    const { open } = useGlobalContextMenu();
    
    const attachListeners = async () => {
        await nextTick();
        
        const buttons = document.getElementsByClassName('rollButton');
        
        Array.from(buttons).forEach(button => {
            // Check if listeners are already attached using a data attribute
            if (button.dataset.listenersAttached === 'true') {
                return;
            }
            
            // Mark that listeners are attached
            button.dataset.listenersAttached = 'true';
            
            // Left click - normal roll
            button.addEventListener('click', (event) => {
                event.preventDefault();
                emit(eventName, event.target.innerText, "normal");
            });
            
            // Right click - open context menu
            button.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                const emitFn = (diceText, rollMode) => {
                    emit(eventName, diceText, rollMode);
                };
                open(event, event.target.innerText, emitFn);
            });
        });
    };
    
    onMounted(attachListeners);
    onUpdated(attachListeners);
}