import { Player } from "./models/player.js";
export const barHeight = 65;
// Game starts the first time that the user logs in to the computer
export let isGameStarted = false;
export let isInteracted = false;
// Game ticks
export const ticks = 20;
export const tps = 1000 / ticks;
export let currentTick = 0;
export let globalTick = 0;
export let insidePCTick = 0;
export let anonymousUserMessageTick = 0;
// Viruses
export let trojanMultiplier = 1;
// Player
export const player = new Player();
