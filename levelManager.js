// levels/levelManager.js

export const levels = [
    { id: 1, mickeyStart: { x: 100, y: 300 }, goal: { x: 300, y: 300 } },
    { id: 2, mickeyStart: { x: 50, y: 150 }, goal: { x: 310, y: 150 } },
    { id: 3, mickeyStart: { x: 200, y: 400 }, goal: { x: 200, y: 100 } }
];

export let currentLevelIndex = 0;

export function getCurrentLevel() {
    return levels[currentLevelIndex];
}

export function goToNextLevel() {
    currentLevelIndex++;
    if (currentLevelIndex >= levels.length) {
        return false;
    }
    return true;
}

export function resetLevels() {
    currentLevelIndex = 0;
}
