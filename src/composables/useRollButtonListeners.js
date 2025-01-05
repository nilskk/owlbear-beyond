import { onMounted } from 'vue';

export function useRollButtonListeners(emit) {
    const handleButtonClick = (event) => {
        console.log(event.target.innerText);
        emit('rollDice', event.target.innerText, "normal");
    };

    const handleButtonRightClick = (event) => {
        console.log(event.target.innerText);
        emit('rollDice', event.target.innerText, "advantage");
    };

    const handleButtonMiddleClick = (event) => {
        console.log(event.target.innerText);
        emit('rollDice', event.target.innerText, "disadvantage");
    };

    onMounted(() => {
        const buttons = document.getElementsByClassName('rollButton');
        Array.from(buttons).forEach(button => {
            button.addEventListener('click', handleButtonClick);
            button.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                handleButtonRightClick(event);
            });
            button.addEventListener('mousedown', (event) => {
                if (event.button === 1) {
                    event.preventDefault();
                    handleButtonMiddleClick(event);
                }
            });
        });
    });
}