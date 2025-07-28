import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import Renderer from "@scratch/scratch-render";
import VM from "@scratch/scratch-vm";
import { connect } from "react-redux";

import { STAGE_DISPLAY_SIZES } from "../lib/layout-constants";
import { getEventXY } from "../lib/touch-utils";
import VideoProvider from "../lib/video/video-provider";
import { BitmapAdapter as V2BitmapAdapter } from "@scratch/scratch-svg-renderer";

import StageComponent from "../components/stage/stage.jsx";

import {
    activateColorPicker,
    deactivateColorPicker,
} from "../reducers/color-picker";

const colorPickerRadius = 20;
const dragThreshold = 3; // Same as the block drag threshold

// Animal facts array for sleep time fun facts
const ANIMAL_FACTS = [
    "A group of flamingos is called a **flamboyance**! 🦩",
    "Koalas have **fingerprints** that are nearly identical to humans! 🐨",
    "Dolphins **call each other by name** with signature whistles! 🐬",
    'Elephants can **"hear" with their feet**—they pick up vibrations through the ground! 🐘',
    "A group of hedgehogs is called a **prickle**! 🦔",
    "Cows have **best friends** and get stressed when separated! 🐮",
    "Otters hold hands while sleeping to **keep from drifting apart**! 🦦",
    "A newborn kangaroo is the size of a **jellybean**! 🦘",
    "Sloths only poop once a week—and it's a dangerous trip! 🦥",
    "Bats always turn **left** when exiting a cave! 🦇",
    "Owls can rotate their heads up to **270 degrees**! 🦉",
    "The heart of a hummingbird beats up to **1,200 times per minute**! 🐦",
    "Penguins propose with **pebbles**! 🐧",
    "The wandering albatross has a wingspan of up to **12 feet**! 🦅",
    "Parrots can live over **60 years** and mimic human speech! 🦜",
    "The male lyrebird can imitate **chainsaws, car alarms, and other birds**! 🎵",
    "Chickens have over **100 distinct vocalizations**! 🐔",
    "Crows are incredibly smart and can **hold grudges**! 🐦",
    "The bee hummingbird is the **smallest bird in the world**—about the size of a bee! 🐝",
    "Pigeons can recognize themselves in a **mirror**! 🕊️",
    "Chameleons change color mostly to **communicate**, not to camouflage! 🦎",
    "Some lizards can **squirt blood from their eyes** as a defense mechanism! 🦎",
    "A group of frogs is called an **army**! 🐸",
    "Frogs can **breathe through their skin**! 🐸",
    "Sea turtles can hold their breath for **hours** underwater! 🐢",
    "The axolotl can **regrow its heart, brain, and limbs**! 🦎",
    "Alligators can live up to **100 years** in the wild! 🐊",
    "Some snakes can **fly** by gliding from tree to tree! 🐍",
    "Crocodiles can't stick their **tongues out**! 🐊",
    "Toads don't drink water—they **absorb it through their skin**! 🐸",
    "Octopuses have **three hearts**! 🐙",
    "Starfish have no **brain or blood**! ⭐",
    "Clownfish can **change gender**! 🐠",
    "Jellyfish existed before **dinosaurs**! 🦑",
    "Seahorses are the only species where the **males get pregnant**! 🐎",
    "Sharks have been around for over **400 million years**! 🦈",
    "Some deep-sea fish have **transparent heads**! 🐟",
    "A shrimp's heart is in its **head**! 🦐",
    "Lobsters taste with their **legs**! 🦞",
    "Some fish can **glow in the dark** (bioluminescence)! ✨",
    "Honey never spoils—**archaeologists found 3,000-year-old edible honey**! 🍯",
    "Ants can lift **50 times their body weight**! 🐜",
    "Dragonflies can fly **backwards**! 🦗",
    "A butterfly tastes with its **feet**! 🦋",
    "Some beetles shoot **boiling chemicals** as a defense! 🪲",
    "Bees can recognize **human faces**! 🐝",
    "Termites never sleep and can build **massive towers**! 🏗️",
    "There are over **1 million** known species of insects! 🐛",
    "Fireflies aren't flies—they're actually **beetles**! ✨",
    "Ladybugs eat up to **5,000 aphids** in their lifetime! 🐞",
    "Platypuses **glow under UV light**! 🦆",
    "Wombat poop is **cube-shaped**! 🦘",
    "Tardigrades can survive in **space, boiling water, and freezing**! 🦠",
    "Some jellyfish are biologically **immortal**! 🦑",
    "Naked mole rats don't feel **pain** from acid or capsaicin! 🐀",
    "A snail can sleep for **3 years**! 🐌",
    "Manatees use their **farts to swim**! 🐋",
    "A blue whale's heart is the size of a **small car**! 🐋",
    "Camels have **three eyelids** to protect against sand! 🐪",
    "Giraffes only sleep **about 30 minutes a day**! 🦒",
    "A group of crows is called a **murder**! 🐦",
    "A group of owls is a **parliament**! 🦉",
    "A group of frogs is an **army**! 🐸",
    "A group of zebras is a **dazzle**! 🦓",
    "A group of cats is a **clowder**! 🐱",
    "A group of rhinos is a **crash**! 🦏",
    "A group of jellyfish is a **smack**! 🦑",
    "A group of porcupines is a **prickle**! 🦔",
    "A group of apes is a **shrewdness**! 🦍",
    "A group of flamingos is a **flamboyance**! 🦩",
    "Crows make and use **tools**! 🐦",
    "Elephants **mourn** their dead! 🐘",
    "Rats can **laugh** when tickled! 🐀",
    "Dogs can learn over **1,000 words**! 🐕",
    "Orcas are the **smartest apex predators**! 🐋",
    "Pigs are smarter than **dogs**! 🐷",
    "Parrots can do basic **math**! 🦜",
    "Dolphins can recognize themselves in a **mirror**! 🐬",
    "Octopuses can solve **mazes and puzzles**! 🐙",
    "Horses can read **human emotions**! 🐎",
    "The fastest land animal is the **cheetah**—up to 70 mph! 🐆",
    "The slowest is the **sloth**, moving ~0.15 mph! 🦥",
    "The loudest animal is the **sperm whale**—over 230 decibels! 🐋",
    "The tiniest mammal is the **bumblebee bat**! 🦇",
    "The tallest animal is the **giraffe**! 🦒",
    "The biggest animal ever is the **blue whale**! 🐋",
    "The strongest bite belongs to the **saltwater crocodile**! 🐊",
    "The most venomous animal is the **box jellyfish**! 🦑",
    "The longest-living mammal is the **bowhead whale** (~200 years)! 🐋",
    "The hottest blooded fish is the **opah**, which regulates heat! 🐟",
    "Horses can't **vomit**! 🐎",
    "A cat can make over **100 different sounds**! 🐱",
    "Male seahorses **give birth**! 🐎",
    "Armadillos can **hold their breath for 6 minutes**! 🦔",
    "Penguins can **drink salt water**! 🐧",
    "Zebras' stripes confuse **biting flies**! 🦓",
    "Some birds can **sleep while flying**! 🐦",
    "Frogs can freeze in winter and **thaw alive**! 🐸",
    "Dogs can smell **disease and emotions**! 🐕",
    "Some ants **farm** fungus and livestock (aphids)! 🐜",
];

// PetSoundManager class for handling sound effects
class PetSoundManager {
    constructor(vm) {
        this.vm = vm;
        this.soundMap = {
            eat: "0b1e3033140d094563248e61de4039e5", // Chomp
            collect: "83a9787d4cb6f3b7632b4ddfebf74367", // Pop (proven to work)
            sleep: "a634fcb87894520edbd7a534d1479ec4", // Clock Ticking (perfect for sleep!)
            wake: "28c76b6bebd04be1383fe9ba4933d263", // Computer Beep
            clean: "83a9787d4cb6f3b7632b4ddfebf74367", // Pop (proven to work)
            sparkle: "78b0be9c9c2f664158b886bc7e794095", // Bubbles (bubbly sound for sparkle)
            water: "e133e625fd367d269e76964d4b722fc2", // Water Drop
            play: "0039635b1d6853face36581784558454", // Bite (proven to work)
            fun: "684ffae7bc3a65e35e9f0aaf7a579dd5", // Clapping
            pop: "83a9787d4cb6f3b7632b4ddfebf74367", // Pop
            alert: "8468b9b3f11a665ee4d215afd8463b97", // Referee Whistle (perfect for alert!)
            snap: "d55b3954d72c6275917f375e49b502f3", // Tap Snare
            tap: "de5b41c7080396986873d97e9e47acf6", // Wood Tap
        };
    }

    async playSound(soundName, volume = 100) {
        const soundId = this.soundMap[soundName];
        if (!soundId) {
            return;
        }

        // Try Scratch's native audio engine first
        try {
            const stage = this.vm.runtime.getTargetForStage();
            if (stage && stage.audioEngine) {
                stage.audioEngine.playSound(soundId, { volume: volume / 100 });
                return;
            }
        } catch (error) {
            // Silent fallback
        }

        // Fallback: Try to load and play the sound directly
        try {
            // For known ADPCM sounds, try ADPCM format first
            const adpcmSounds = {
                sleep: "a634fcb87894520edbd7a534d1479ec4", // Clock Ticking
                play: "0039635b1d6853face36581784558454", // Bite
                // fun: "1e8e7fb94103282d02a4bb597248c788", // Laugh1 (WAV format, not ADPCM)
                alert: "8468b9b3f11a665ee4d215afd8463b97", // Referee Whistle
                sparkle: "78b0be9c9c2f664158b886bc7e794095", // Bubbles
                water: "e133e625fd367d269e76964d4b722fc2", // Water Drop
            };

            let asset = null;

            // Try ADPCM first for known ADPCM sounds
            if (adpcmSounds[soundName]) {
                try {
                    asset = await this.vm.runtime.storage.load(
                        this.vm.runtime.storage.AssetType.Sound,
                        soundId,
                        this.vm.runtime.storage.DataFormat.ADPCM
                    );
                } catch (adpcmError) {
                    // Silent fallback
                }
            }

            // If ADPCM failed or not an ADPCM sound, try WAV format
            if (!asset || !asset.data) {
                try {
                    asset = await this.vm.runtime.storage.load(
                        this.vm.runtime.storage.AssetType.Sound,
                        soundId,
                        this.vm.runtime.storage.DataFormat.WAV
                    );
                } catch (wavError) {
                    // Silent fallback
                }
            }

            // If WAV failed and we haven't tried ADPCM yet, try ADPCM as fallback
            if (!asset || !asset.data) {
                try {
                    asset = await this.vm.runtime.storage.load(
                        this.vm.runtime.storage.AssetType.Sound,
                        soundId,
                        this.vm.runtime.storage.DataFormat.ADPCM
                    );
                } catch (finalError) {
                    // Silent fallback
                }
            }

            if (asset && asset.data) {
                const blob = new Blob([asset.data], { type: "audio/wav" });
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                audio.volume = volume / 100;
                await audio.play();
                URL.revokeObjectURL(url);
                return;
            }
        } catch (error) {
            // Silent fallback
        }

        // Final fallback: Simple beep
        try {
            if (!window.petAudioContext) {
                window.petAudioContext = new (window.AudioContext ||
                    window.webkitAudioContext)();
            }

            const context = window.petAudioContext;

            // Special handling for sleep sound - create custom clock ticking
            if (soundName === "sleep") {
                this.createClockTickingSound(context, volume);
                return;
            }

            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            // Create a simple beep based on the sound type
            const frequencies = {
                eat: [200, 400],
                collect: [800, 1200],
                sleep: [150, 300],
                wake: [600, 800],
                clean: [400, 600],
                sparkle: [1000, 1500],
                play: [300, 500],
                fun: [250, 500],
                pop: [100, 200],
                snap: [400, 600],
                alert: [300, 600],
            };

            const freq = frequencies[soundName]
                ? frequencies[soundName][0]
                : 440;

            oscillator.frequency.setValueAtTime(freq, context.currentTime);
            oscillator.type = "sine";

            gainNode.gain.setValueAtTime(0, context.currentTime);
            gainNode.gain.linearRampToValueAtTime(
                volume / 100,
                context.currentTime + 0.01
            );
            gainNode.gain.exponentialRampToValueAtTime(
                0.001,
                context.currentTime + 0.3
            );

            oscillator.start(context.currentTime);
            oscillator.stop(context.currentTime + 0.3);
        } catch (fallbackError) {
            // Silent fallback
        }
    }

    createClockTickingSound(context, volume) {
        const sleepDuration = 30; // 30 seconds of sleep
        const tickInterval = 1.0; // Time between ticks in seconds (slower tempo)
        const tickDuration = 0.15; // Duration of each tick (slightly longer)
        const totalTicks = Math.floor(sleepDuration / tickInterval); // Calculate total ticks needed

        for (let i = 0; i < totalTicks; i++) {
            const startTime = context.currentTime + i * tickInterval;

            // Create oscillator for tick
            const oscillator = context.createOscillator();
            const gainNode = context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(context.destination);

            // Tick sound - slightly lower frequency for gentler sound
            oscillator.frequency.setValueAtTime(600, startTime);
            oscillator.type = "sine";

            // Volume envelope for tick - gentler volume
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(
                (volume / 100) * 0.2,
                startTime + 0.02
            );
            gainNode.gain.exponentialRampToValueAtTime(
                0.001,
                startTime + tickDuration
            );

            oscillator.start(startTime);
            oscillator.stop(startTime + tickDuration);

            // Add a subtle echo effect - gentler echo
            const echoGain = context.createGain();
            echoGain.connect(context.destination);
            echoGain.gain.setValueAtTime(
                (volume / 100) * 0.05,
                startTime + 0.08
            );
            echoGain.gain.exponentialRampToValueAtTime(
                0.001,
                startTime + tickDuration + 0.08
            );

            const echoOsc = context.createOscillator();
            echoOsc.connect(echoGain);
            echoOsc.frequency.setValueAtTime(450, startTime + 0.08);
            echoOsc.type = "sine";
            echoOsc.start(startTime + 0.08);
            echoOsc.stop(startTime + tickDuration + 0.08);
        }
    }

    async playLayeredSounds(sounds) {
        const promises = sounds.map(async (sound) => {
            if (sound.delay) {
                await new Promise((resolve) =>
                    setTimeout(resolve, sound.delay)
                );
            }
            return this.playSound(sound.name, sound.volume);
        });
        await Promise.all(promises);
    }

    testSounds() {
        console.log("🧪 Testing pet sounds...");
        setTimeout(() => this.playSound("pop", 80), 100);
        setTimeout(() => this.playSound("snap", 80), 500);
        setTimeout(() => this.playSound("alert", 80), 1000);
        setTimeout(() => this.playSound("collect", 70), 1500);
        setTimeout(() => this.playSound("eat", 80), 2000);
        setTimeout(() => this.playSound("play", 80), 2500);
        setTimeout(() => this.playSound("fun", 60), 3000);
        setTimeout(() => this.playSound("clean", 80), 3500);
        setTimeout(() => this.playSound("sparkle", 60), 4000);
        setTimeout(() => this.playSound("sleep", 60), 4500);
        setTimeout(() => this.playSound("wake", 70), 5000);
    }
}

class Stage extends React.Component {
    constructor(props) {
        super(props);
        bindAll(this, [
            "attachMouseEvents",
            "cancelMouseDownTimeout",
            "detachMouseEvents",
            "handleDoubleClick",
            "handleQuestionAnswered",
            "onMouseUp",
            "onMouseMove",
            "onMouseDown",
            "onStartDrag",
            "onStopDrag",
            "onWheel",
            "updateRect",
            "questionListener",
            "setDragCanvas",
            "clearDragCanvas",
            "drawDragCanvas",
            "positionDragCanvas",
            "handleFeedPet",
            "handlePlayWithPet",
            "handleCleanPet",
            "handleSleepPet",
            "clearPetReactionMessage",
            "checkPetNeeds",
            "clearPetSpeech",
            "decayPetStats",
            "handleTargetsUpdate",
            "spawnFood",
            "collectFood",
            "handleFoodClick",
            "spawnWaste",
            "handleWasteClick",
            "handleTogglePet",
            "startPetIntervals",
            "clearPetIntervals",
        ]);
        this.state = {
            mouseDownTimeoutId: null,
            mouseDownPosition: null,
            isDragging: false,
            dragOffset: null,
            dragId: null,
            colorInfo: null,
            question: null,
            hunger: 50, // 0 = full, 100 = starving
            cleanliness: 100, // 0 = dirty, 100 = clean
            happiness: 50, // 0 = sad, 100 = very happy
            energy: 100, // 0 = tired, 100 = fully rested
            petReactionMessage: null,
            petSpeechMessage: null,
            petSpeechVisible: false,
            petX: 0,
            petY: 0,
            foodItems: [],
            collectedFood: 0,
            wasteItems: [],
            isSleeping: false,
            sleepCountdown: 0,
            currentFunFact: "",
            funFactVisible: false,
            petEnabled: false,
            petSpriteName: this.getPetSpriteName(props),
        };
        if (this.props.vm.renderer) {
            this.renderer = this.props.vm.renderer;
            this.canvas = this.renderer.canvas;
        } else {
            this.canvas = document.createElement("canvas");
            this.renderer = new Renderer(this.canvas);
            this.props.vm.attachRenderer(this.renderer);

            // Only attach a video provider once because it is stateful
            this.props.vm.setVideoProvider(new VideoProvider());

            // Calling draw a single time before any project is loaded just makes
            // the canvas white instead of solid black–needed because it is not
            // possible to use CSS to style the canvas to have a different
            // default color
            this.props.vm.renderer.draw();
        }
        this.props.vm.attachV2BitmapAdapter(new V2BitmapAdapter());

        // Initialize sound manager for pet actions
        this.soundManager = new PetSoundManager(this.props.vm);
    }

    // Helper to get the sprite name for the current editingTarget
    getPetSpriteName(props) {
        const { editingTarget, sprites } = props;
        if (editingTarget && sprites && sprites[editingTarget]) {
            return sprites[editingTarget].name;
        }
        return "Sprite1";
    }

    componentDidMount() {
        this.attachRectEvents();
        this.attachMouseEvents(this.canvas);
        this.updateRect();
        this.props.vm.runtime.addListener("QUESTION", this.questionListener);
        // Listen for pet play event from VM
        this.props.vm.runtime.addListener(
            "PET_PLAYED_WITH",
            this.handlePetPlayedWith
        );
        // Start food spawn interval every 20s
        this.foodSpawnInterval = setInterval(() => this.spawnFood(), 20000);
        // Start stat decay interval every 1s for smooth animation
        this.statDecayInterval = setInterval(() => this.decayPetStats(), 1000);
        // Start waste spawn interval every 3 minutes
        this.wasteSpawnInterval = setInterval(() => this.spawnWaste(), 180000);
        // Start pet intervals
        this.startPetIntervals();
        this.petNeedsInterval = setInterval(this.checkPetNeeds, 2000);

        // Expose debugging functions globally
        window.testPetSounds = () => this.soundManager.testSounds();
        window.playPetSound = (soundName, volume) =>
            this.soundManager.playSound(soundName, volume);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (
            this.props.stageSize !== nextProps.stageSize ||
            this.props.isColorPicking !== nextProps.isColorPicking ||
            this.state.colorInfo !== nextState.colorInfo ||
            this.props.isFullScreen !== nextProps.isFullScreen ||
            this.state.question !== nextState.question ||
            this.props.micIndicator !== nextProps.micIndicator ||
            this.props.isStarted !== nextProps.isStarted ||
            this.state.hunger !== nextState.hunger ||
            this.state.cleanliness !== nextState.cleanliness ||
            this.state.happiness !== nextState.happiness ||
            this.state.energy !== nextState.energy ||
            this.state.petReactionMessage !== nextState.petReactionMessage ||
            this.state.petSpeechMessage !== nextState.petSpeechMessage ||
            this.state.petSpeechVisible !== nextState.petSpeechVisible ||
            this.state.petX !== nextState.petX ||
            this.state.petY !== nextState.petY ||
            this.state.foodItems !== nextState.foodItems ||
            this.state.collectedFood !== nextState.collectedFood ||
            this.state.wasteItems !== nextState.wasteItems ||
            this.state.isSleeping !== nextState.isSleeping ||
            this.state.sleepCountdown !== nextState.sleepCountdown ||
            this.state.currentFunFact !== nextState.currentFunFact ||
            this.state.funFactVisible !== nextState.funFactVisible ||
            this.state.petEnabled !== nextState.petEnabled
        );
    }
    componentDidUpdate(prevProps) {
        if (this.props.isColorPicking && !prevProps.isColorPicking) {
            this.startColorPickingLoop();
        } else if (!this.props.isColorPicking && prevProps.isColorPicking) {
            this.stopColorPickingLoop();
        }
        this.updateRect();
        this.renderer.resize(this.rect.width, this.rect.height);
        // Removed to prevent infinite update loop:
        // this.checkPetNeeds();
        // this.decayPetStats();
        this.handleTargetsUpdate();
        // Update petSpriteName if editingTarget changes
        if (this.props.editingTarget !== prevProps.editingTarget) {
            this.setState({ petSpriteName: this.getPetSpriteName(this.props) });
        }
    }
    componentWillUnmount() {
        this.detachMouseEvents(this.canvas);
        this.detachRectEvents();
        this.stopColorPickingLoop();
        this.clearPetIntervals();
        clearInterval(this.foodSpawnInterval);
        clearInterval(this.statDecayInterval);
        clearInterval(this.petNeedsInterval);
        clearInterval(this.wasteSpawnInterval);
        clearInterval(this.sleepInterval);
        clearInterval(this.funFactInterval);
        clearTimeout(this.speechTimeout);
        clearTimeout(this.reactionTimeout);
        this.props.vm.runtime.removeListener("QUESTION", this.questionListener);
        this.props.vm.runtime.removeListener(
            "PET_PLAYED_WITH",
            this.handlePetPlayedWith
        );
    }
    questionListener(question) {
        this.setState({ question: question });
    }
    handleQuestionAnswered(answer) {
        this.setState({ question: null }, () => {
            this.props.vm.runtime.emit("ANSWER", answer);
        });
    }
    startColorPickingLoop() {
        this.intervalId = setInterval(() => {
            if (typeof this.pickX === "number") {
                this.setState({
                    colorInfo: this.getColorInfo(this.pickX, this.pickY),
                });
            }
        }, 30);
    }
    stopColorPickingLoop() {
        clearInterval(this.intervalId);
    }
    attachMouseEvents(canvas) {
        document.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("touchmove", this.onMouseMove);
        document.addEventListener("touchend", this.onMouseUp);
        canvas.addEventListener("mousedown", this.onMouseDown);
        canvas.addEventListener("touchstart", this.onMouseDown);
        canvas.addEventListener("wheel", this.onWheel);
    }
    detachMouseEvents(canvas) {
        document.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("mouseup", this.onMouseUp);
        document.removeEventListener("touchmove", this.onMouseMove);
        document.removeEventListener("touchend", this.onMouseUp);
        canvas.removeEventListener("mousedown", this.onMouseDown);
        canvas.removeEventListener("touchstart", this.onMouseDown);
        canvas.removeEventListener("wheel", this.onWheel);
    }
    attachRectEvents() {
        window.addEventListener("resize", this.updateRect);
        window.addEventListener("scroll", this.updateRect);
    }
    detachRectEvents() {
        window.removeEventListener("resize", this.updateRect);
        window.removeEventListener("scroll", this.updateRect);
    }
    updateRect() {
        this.rect = this.canvas.getBoundingClientRect();
    }
    getScratchCoords(x, y) {
        const nativeSize = this.renderer.getNativeSize();
        return [
            (nativeSize[0] / this.rect.width) * (x - this.rect.width / 2),
            (nativeSize[1] / this.rect.height) * (y - this.rect.height / 2),
        ];
    }
    getColorInfo(x, y) {
        return {
            x: x,
            y: y,
            ...this.renderer.extractColor(x, y, colorPickerRadius),
        };
    }
    handleDoubleClick(e) {
        const { x, y } = getEventXY(e);
        // Set editing target from cursor position, if clicking on a sprite.
        const mousePosition = [x - this.rect.left, y - this.rect.top];
        const drawableId = this.renderer.pick(
            mousePosition[0],
            mousePosition[1]
        );
        if (drawableId === null) return;
        const targetId = this.props.vm.getTargetIdForDrawableId(drawableId);
        if (targetId === null) return;
        this.props.vm.setEditingTarget(targetId);
    }
    onMouseMove(e) {
        const { x, y } = getEventXY(e);
        const mousePosition = [x - this.rect.left, y - this.rect.top];

        if (this.props.isColorPicking) {
            // Set the pickX/Y for the color picker loop to pick up
            this.pickX = mousePosition[0];
            this.pickY = mousePosition[1];
        }

        if (this.state.mouseDown && !this.state.isDragging) {
            const distanceFromMouseDown = Math.sqrt(
                Math.pow(
                    mousePosition[0] - this.state.mouseDownPosition[0],
                    2
                ) +
                    Math.pow(
                        mousePosition[1] - this.state.mouseDownPosition[1],
                        2
                    )
            );
            if (distanceFromMouseDown > dragThreshold) {
                this.cancelMouseDownTimeout();
                this.onStartDrag(...this.state.mouseDownPosition);
            }
        }
        if (this.state.mouseDown && this.state.isDragging) {
            // Editor drag style only updates the drag canvas, does full update at the end of drag
            // Non-editor drag style just updates the sprite continuously.
            if (this.props.useEditorDragStyle) {
                this.positionDragCanvas(mousePosition[0], mousePosition[1]);
            } else {
                const spritePosition = this.getScratchCoords(
                    mousePosition[0],
                    mousePosition[1]
                );
                this.props.vm.postSpriteInfo({
                    x: spritePosition[0] + this.state.dragOffset[0],
                    y: -(spritePosition[1] + this.state.dragOffset[1]),
                    force: true,
                });
            }
        }
        const coordinates = {
            x: mousePosition[0],
            y: mousePosition[1],
            canvasWidth: this.rect.width,
            canvasHeight: this.rect.height,
        };
        this.props.vm.postIOData("mouse", coordinates);
    }
    onMouseUp(e) {
        const { x, y } = getEventXY(e);
        const mousePosition = [x - this.rect.left, y - this.rect.top];
        this.cancelMouseDownTimeout();
        this.setState({
            mouseDown: false,
            mouseDownPosition: null,
        });
        const data = {
            isDown: false,
            x: x - this.rect.left,
            y: y - this.rect.top,
            canvasWidth: this.rect.width,
            canvasHeight: this.rect.height,
            wasDragged: this.state.isDragging,
        };
        if (this.state.isDragging) {
            this.onStopDrag(mousePosition[0], mousePosition[1]);
        }
        this.props.vm.postIOData("mouse", data);

        if (
            this.props.isColorPicking &&
            mousePosition[0] > 0 &&
            mousePosition[0] < this.rect.width &&
            mousePosition[1] > 0 &&
            mousePosition[1] < this.rect.height
        ) {
            const { r, g, b } = this.state.colorInfo.color;
            const componentToString = (c) => {
                const hex = c.toString(16);
                return hex.length === 1 ? `0${hex}` : hex;
            };
            const colorString = `#${componentToString(r)}${componentToString(
                g
            )}${componentToString(b)}`;
            this.props.onDeactivateColorPicker(colorString);
            this.setState({ colorInfo: null });
            this.pickX = null;
            this.pickY = null;
        }
    }
    onMouseDown(e) {
        this.updateRect();
        const { x, y } = getEventXY(e);
        const mousePosition = [x - this.rect.left, y - this.rect.top];
        if (this.props.isColorPicking) {
            // Set the pickX/Y for the color picker loop to pick up
            this.pickX = mousePosition[0];
            this.pickY = mousePosition[1];
            // Immediately update the color picker info
            this.setState({
                colorInfo: this.getColorInfo(this.pickX, this.pickY),
            });
        } else {
            if (
                e.button === 0 ||
                (window.TouchEvent && e instanceof TouchEvent)
            ) {
                this.setState({
                    mouseDown: true,
                    mouseDownPosition: mousePosition,
                    mouseDownTimeoutId: setTimeout(
                        this.onStartDrag.bind(
                            this,
                            mousePosition[0],
                            mousePosition[1]
                        ),
                        400
                    ),
                });
            }
            const data = {
                isDown: true,
                x: mousePosition[0],
                y: mousePosition[1],
                canvasWidth: this.rect.width,
                canvasHeight: this.rect.height,
            };
            this.props.vm.postIOData("mouse", data);
            if (e.preventDefault) {
                // Prevent default to prevent touch from dragging page
                e.preventDefault();
                // But we do want any active input to be blurred
                if (document.activeElement && document.activeElement.blur) {
                    document.activeElement.blur();
                }
            }
        }
    }
    onWheel(e) {
        const data = {
            deltaX: e.deltaX,
            deltaY: e.deltaY,
        };
        this.props.vm.postIOData("mouseWheel", data);
    }
    cancelMouseDownTimeout() {
        if (this.state.mouseDownTimeoutId !== null) {
            clearTimeout(this.state.mouseDownTimeoutId);
        }
        this.setState({ mouseDownTimeoutId: null });
    }
    /**
     * Initialize the position of the "dragged sprite" canvas
     * @param {DrawableExtraction} drawableData The data returned from renderer.extractDrawableScreenSpace
     * @param {number} x The x position of the initial drag event
     * @param {number} y The y position of the initial drag event
     */
    drawDragCanvas(drawableData, x, y) {
        const {
            imageData,
            x: boundsX,
            y: boundsY,
            width: boundsWidth,
            height: boundsHeight,
        } = drawableData;
        this.dragCanvas.width = imageData.width;
        this.dragCanvas.height = imageData.height;
        // On high-DPI devices, the canvas size in layout-pixels is not equal to the size of the extracted data.
        this.dragCanvas.style.width = `${boundsWidth}px`;
        this.dragCanvas.style.height = `${boundsHeight}px`;

        this.dragCanvas.getContext("2d").putImageData(imageData, 0, 0);
        // Position so that pick location is at (0, 0) so that  positionDragCanvas()
        // can use translation to move to mouse position smoothly.
        this.dragCanvas.style.left = `${boundsX - x}px`;
        this.dragCanvas.style.top = `${boundsY - y}px`;
        this.dragCanvas.style.display = "block";
    }
    clearDragCanvas() {
        this.dragCanvas.width = this.dragCanvas.height = 0;
        this.dragCanvas.style.display = "none";
    }
    positionDragCanvas(mouseX, mouseY) {
        // mouseX/Y are relative to stage top/left, and dragCanvas is already
        // positioned so that the pick location is at (0,0).
        this.dragCanvas.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }
    onStartDrag(x, y) {
        if (this.state.dragId) return;
        const drawableId = this.renderer.pick(x, y);
        if (drawableId === null) return;
        const targetId = this.props.vm.getTargetIdForDrawableId(drawableId);
        if (targetId === null) return;

        const target = this.props.vm.runtime.getTargetById(targetId);

        // Do not start drag unless in editor drag mode or target is draggable
        if (!(this.props.useEditorDragStyle || target.draggable)) return;

        // Dragging always brings the target to the front
        target.goToFront();

        const [scratchMouseX, scratchMouseY] = this.getScratchCoords(x, y);
        const offsetX = target.x - scratchMouseX;
        const offsetY = -(target.y + scratchMouseY);

        this.props.vm.startDrag(targetId);
        this.setState({
            isDragging: true,
            dragId: targetId,
            dragOffset: [offsetX, offsetY],
        });
        if (this.props.useEditorDragStyle) {
            // Extract the drawable art
            const drawableData =
                this.renderer.extractDrawableScreenSpace(drawableId);
            this.drawDragCanvas(drawableData, x, y);
            this.positionDragCanvas(x, y);
            this.props.vm.postSpriteInfo({ visible: false });
            this.props.vm.renderer.draw();
        }
    }
    onStopDrag(mouseX, mouseY) {
        const dragId = this.state.dragId;
        const commonStopDragActions = () => {
            this.props.vm.stopDrag(dragId);
            this.setState({
                isDragging: false,
                dragOffset: null,
                dragId: null,
            });
        };
        if (this.props.useEditorDragStyle) {
            // Need to sequence these actions to prevent flickering.
            const spriteInfo = { visible: true };
            // First update the sprite position if dropped in the stage.
            if (
                mouseX > 0 &&
                mouseX < this.rect.width &&
                mouseY > 0 &&
                mouseY < this.rect.height
            ) {
                const spritePosition = this.getScratchCoords(mouseX, mouseY);
                spriteInfo.x = spritePosition[0] + this.state.dragOffset[0];
                spriteInfo.y = -(spritePosition[1] + this.state.dragOffset[1]);
                spriteInfo.force = true;
            }
            this.props.vm.postSpriteInfo(spriteInfo);
            // Then clear the dragging canvas and stop drag (potentially slow if selecting sprite)
            this.clearDragCanvas();
            commonStopDragActions();
            this.props.vm.renderer.draw();
        } else {
            commonStopDragActions();
        }
    }
    setDragCanvas(canvas) {
        this.dragCanvas = canvas;
    }
    // REPLACE ALL PET LOGIC BELOW WITH THE LOGIC FROM scratch-gui/src/containers/stage.jsx
    // This includes:
    // - state initialization (hunger, cleanliness, happiness, energy, etc.)
    // - all pet action handlers (handleFeedPet, handlePlayWithPet, handleCleanPet, handleSleepPet, etc.)
    // - stat decay and intervals (startPetIntervals, clearPetIntervals, decayPetStats, etc.)
    // - food/waste logic (spawnFood, collectFood, handleFoodClick, spawnWaste, handleWasteClick, etc.)
    // - prop passing to StageComponent
    async handleFeedPet() {
        if (this.state.isSleeping) return;
        if (this.state.energy < 2) {
            this.setState({
                petSpeechMessage: "I'm too tired to eat!",
                petSpeechVisible: true,
            });
            clearTimeout(this.speechTimeout);
            this.speechTimeout = setTimeout(this.clearPetSpeech, 2000);
            return;
        }

        const hasFood = this.state.collectedFood > 0;

        if (this.state.collectedFood <= 0) {
            this.setState({
                petReactionMessage:
                    "No food collected! Find food in the field first! 🍽️",
            });
            clearTimeout(this.reactionTimeout);
            this.reactionTimeout = setTimeout(
                this.clearPetReactionMessage,
                1500
            );

            // Play alert sound for no food
            await this.soundManager.playSound("alert", 70);
            return;
        }

        this.setState(
            (prevState) => ({
                hunger: Math.max(0, prevState.hunger - 20),
                cleanliness: Math.max(0, prevState.cleanliness - 5),
                collectedFood: prevState.collectedFood - 1,
                energy: Math.max(0, prevState.energy - 2),
                petReactionMessage: "Yum! Thank you! 😋",
            }),
            async () => {
                clearTimeout(this.reactionTimeout);
                this.reactionTimeout = setTimeout(
                    this.clearPetReactionMessage,
                    1500
                );

                // Play eat sound after state update
                await this.soundManager.playSound("eat", 80);
            }
        );
    }
    async handlePlayWithPet() {
        if (this.state.isSleeping) return;
        if (this.state.hunger > 80) {
            this.setState({
                petSpeechMessage:
                    "I'm too hungry to play! Please feed me first! 😫",
                petSpeechVisible: true,
            });
            clearTimeout(this.speechTimeout);
            this.speechTimeout = setTimeout(this.clearPetSpeech, 2000);
            return;
        }
        if (this.state.energy < 10) {
            this.setState({
                petSpeechMessage:
                    "I'm too tired! Let me sleep to get my energy back! 😴",
                petSpeechVisible: true,
            });
            clearTimeout(this.speechTimeout);
            this.speechTimeout = setTimeout(this.clearPetSpeech, 2000);
            return;
        }

        this.setState(
            (prevState) => ({
                happiness: Math.min(100, prevState.happiness + 20),
                hunger: Math.min(100, prevState.hunger + 5),
                energy: Math.max(0, prevState.energy - 10),
                cleanliness: Math.max(0, prevState.cleanliness - 10),
                petReactionMessage: "Yay! That was fun! 😺🎉",
            }),
            async () => {
                clearTimeout(this.reactionTimeout);
                this.reactionTimeout = setTimeout(
                    this.clearPetReactionMessage,
                    1500
                );

                // Play layered sounds for playing with pet
                await this.soundManager.playLayeredSounds([
                    { name: "pop", volume: 80, delay: 0 },
                    { name: "fun", volume: 60, delay: 200 },
                ]);
            }
        );
    }
    async handleCleanPet() {
        if (this.state.isSleeping) return;
        if (this.state.energy < 10) {
            this.setState({
                petSpeechMessage:
                    "I'm too tired! Let me sleep to get my energy back! 😴",
                petSpeechVisible: true,
            });
            clearTimeout(this.speechTimeout);
            this.speechTimeout = setTimeout(this.clearPetSpeech, 2000);
            return;
        }

        this.setState(
            (prevState) => ({
                cleanliness: Math.min(100, prevState.cleanliness + 10),
                energy: Math.max(0, prevState.energy - 10),
                petReactionMessage: "So fresh! 🛁✨",
            }),
            async () => {
                clearTimeout(this.reactionTimeout);
                this.reactionTimeout = setTimeout(
                    this.clearPetReactionMessage,
                    1500
                );

                // Play layered sounds for cleaning (cheer + sparkle)
                await this.soundManager.playLayeredSounds([
                    { name: "clean", volume: 80, delay: 0 },
                    { name: "sparkle", volume: 60, delay: 300 },
                ]);
            }
        );
    }
    async handleSleepPet() {
        if (this.state.isSleeping) return;

        // Get a random fun fact to start with
        const randomFact =
            ANIMAL_FACTS[Math.floor(Math.random() * ANIMAL_FACTS.length)];

        this.setState(
            (prevState) => ({
                isSleeping: true,
                sleepCountdown: 30,
                currentFunFact: randomFact,
                funFactVisible: true,
                hunger: Math.max(0, prevState.hunger - 5),
                petReactionMessage: "Zzz... 😴",
            }),
            async () => {
                clearTimeout(this.reactionTimeout);
                this.reactionTimeout = setTimeout(
                    this.clearPetReactionMessage,
                    1500
                );

                // Play sleep sound
                await this.soundManager.playSound("sleep", 60);

                // Start fun fact rotation every 5 seconds
                this.funFactInterval = setInterval(() => {
                    const newFact =
                        ANIMAL_FACTS[
                            Math.floor(Math.random() * ANIMAL_FACTS.length)
                        ];
                    this.setState({
                        currentFunFact: newFact,
                        funFactVisible: false,
                    });
                    // Show the new fact after a brief fade
                    setTimeout(() => {
                        this.setState({ funFactVisible: true });
                    }, 300);
                }, 5000);

                clearInterval(this.sleepInterval);
                this.sleepInterval = setInterval(() => {
                    this.setState((prevState) => {
                        if (prevState.sleepCountdown <= 1) {
                            clearInterval(this.sleepInterval);
                            clearInterval(this.funFactInterval);

                            // Play wake sound when sleep ends
                            this.soundManager.playSound("wake", 70);

                            return {
                                isSleeping: false,
                                sleepCountdown: 0,
                                currentFunFact: "",
                                funFactVisible: false,
                                energy: 100,
                            };
                        }
                        return {
                            sleepCountdown: prevState.sleepCountdown - 1,
                            energy: Math.min(100, prevState.energy + 4),
                        };
                    });
                }, 1000);
            }
        );
    }
    clearPetReactionMessage() {
        clearTimeout(this.reactionTimeout);
        this.setState({ petReactionMessage: null });
    }
    checkPetNeeds() {
        const { hunger, cleanliness, happiness, energy } = this.state;
        let message = "";
        let shouldShow = false;

        if (hunger > 70) {
            message = "I'm starving! 🍽️";
            shouldShow = true;
        } else if (cleanliness < 30) {
            message = "I feel so dirty! 🛁";
            shouldShow = true;
        } else if (happiness < 40) {
            message = "I'm so sad... 😢";
            shouldShow = true;
        } else if (energy < 20) {
            message = "I'm so tired... 😴";
            shouldShow = true;
        }

        if (shouldShow && !this.state.petSpeechVisible) {
            this.setState({
                petSpeechMessage: message,
                petSpeechVisible: true,
            });
            // Clear speech after 3 seconds
            clearTimeout(this.speechTimeout);
            this.speechTimeout = setTimeout(this.clearPetSpeech, 3000);
        }
    }
    clearPetSpeech() {
        this.setState({
            petSpeechVisible: false,
            petSpeechMessage: "",
        });
    }
    decayPetStats() {
        this.setState((prevState) => {
            const wastePresent = prevState.wasteItems.length > 0;
            const cleanlinessDecay = wastePresent ? 2 : 0.1; // Much slower in normal, still fast with waste
            const newHunger = Math.min(100, prevState.hunger + 0.15); // Smooth hunger
            const newCleanliness = Math.max(
                0,
                prevState.cleanliness - cleanlinessDecay
            );
            const newHappiness = Math.max(0, prevState.happiness - 0.1);
            const newEnergy = Math.max(0, prevState.energy - 0.1);
            return {
                hunger: newHunger,
                cleanliness: newCleanliness,
                happiness: newHappiness,
                energy: newEnergy,
            };
        });
    }
    handleTargetsUpdate() {
        // This is a placeholder for the pet's position update.
        // In a real VM, this would involve extracting the pet's position
        // from the VM's state and updating this.state.petX/Y.
        // For now, we'll just update the pet's position on the canvas.
        // This requires the pet sprite to be a drawable and its position
        // to be managed by the VM's state.
        // Example: const petDrawableId = this.props.vm.runtime.getTargetById('pet').drawableId;
        // const petPosition = this.props.vm.runtime.getTargetById('pet').x;
        // this.setState({ petX: petPosition, petY: 0 }); // Assuming petY is 0 for now
    }
    spawnFood() {
        this.setState((prevState) => {
            if (prevState.foodItems.length >= 5) return prevState;
            const stageWidth = this.rect ? this.rect.width : 480;
            const stageHeight = this.rect ? this.rect.height : 360;
            const newFood = {
                id: (Date.now() + Math.random()).toString(), // ensure string id
                x: Math.random() * (stageWidth - 40) + 20,
                y: Math.random() * (stageHeight - 40) + 20,
                type: Math.floor(Math.random() * 3), // 0: apple, 1: bone, 2: fish
                collected: false,
                fading: false,
            };
            // Remove food after 5 seconds if not collected
            setTimeout(() => {
                this.setState((prevState2) => {
                    const food = prevState2.foodItems.find(
                        (f) => f.id === newFood.id
                    );
                    if (food && !food.collected) {
                        const updatedFoodItems = prevState2.foodItems.map((f) =>
                            f.id === newFood.id ? { ...f, fading: true } : f
                        );
                        // Remove after fade animation (0.5s)
                        setTimeout(() => {
                            this.setState((prevState3) => ({
                                foodItems: prevState3.foodItems.filter(
                                    (f) => f.id !== newFood.id
                                ),
                            }));
                        }, 500);
                        return { foodItems: updatedFoodItems };
                    }
                    return null;
                });
            }, 5000);
            return {
                foodItems: [...prevState.foodItems, newFood],
            };
        });
    }
    async collectFood(foodId) {
        this.setState((prevState) => {
            const updatedFoodItems = prevState.foodItems.map((food) =>
                food.id === foodId ? { ...food, collected: true } : food
            );
            // Remove collected food after a short delay
            setTimeout(async () => {
                this.setState((prevState2) => ({
                    foodItems: prevState2.foodItems.filter(
                        (food) => food.id !== foodId
                    ),
                    collectedFood: prevState2.collectedFood + 1,
                }));

                // Play collect sound
                await this.soundManager.playSound("collect", 70);
            }, 300);
            return {
                foodItems: updatedFoodItems,
            };
        });
    }
    handleFoodClick(foodId) {
        if (this.state.isSleeping) return;
        this.collectFood(foodId);
    }
    spawnWaste() {
        // Always spawn waste regardless of energy level
        this.setState((prevState) => {
            if (!prevState.petEnabled) return null;
            const waste = {
                id: (Date.now() + Math.random()).toString(),
                x: Math.random() * (this.rect ? this.rect.width : 480),
                y: Math.random() * (this.rect ? this.rect.height : 360),
            };
            return { wasteItems: [...prevState.wasteItems, waste] };
        });
    }
    async handleWasteClick(id) {
        // Only allow cleaning if energy >= 8
        if (this.state.energy < 8) {
            this.setState({
                petSpeechMessage:
                    "I'm exhausted! Cleaning is hard with low energy!",
                petSpeechVisible: true,
            });
            clearTimeout(this.speechTimeout);
            this.speechTimeout = setTimeout(this.clearPetSpeech, 2000);
            return;
        }

        this.setState((prevState) => ({
            wasteItems: prevState.wasteItems.filter((w) => w.id !== id),
            energy: Math.max(0, prevState.energy - 3),
        }));

        // Play clean sound for waste removal
        await this.soundManager.playSound("clean", 60);

        this.handleCleanPet();
    }
    handleTogglePet() {
        this.setState((prevState) => ({ petEnabled: !prevState.petEnabled }));
    }
    startPetIntervals() {
        this.petIntervalId = setInterval(() => {
            this.checkPetNeeds();
            this.handleTargetsUpdate();
        }, 1000);
    }
    clearPetIntervals() {
        clearInterval(this.petIntervalId);
    }
    // Handler for pet play event from VM
    handlePetPlayedWith = (target) => {
        if (!this.state.petEnabled) return;
        // Only increase happiness if the moved sprite matches the pet sprite name
        if (
            target &&
            target.sprite &&
            target.sprite.name === this.state.petSpriteName
        ) {
            this.setState((prevState) => ({
                happiness: Math.min(100, prevState.happiness + 2),
            }));
        }
    };
    // Add handler to set pet by clicking a sprite
    handleSpriteClick = (e) => {
        const { x, y } = getEventXY(e);
        this.updateRect();
        const mousePosition = [x - this.rect.left, y - this.rect.top];
        const drawableId = this.renderer.pick(
            mousePosition[0],
            mousePosition[1]
        );
        if (drawableId === null) return;
        const targetId = this.props.vm.getTargetIdForDrawableId(drawableId);
        if (targetId === null) return;
        const target = this.props.vm.runtime.getTargetById(targetId);
        if (target && target.sprite) {
            console.log("Pet sprite set to:", target.sprite.name); // Debug log
            this.setState({ petSpriteName: target.sprite.name });
        }
    };
    render() {
        const {
            vm, // eslint-disable-line no-unused-vars
            onActivateColorPicker, // eslint-disable-line no-unused-vars
            anyModalVisible, // <-- new prop
            ...props
        } = this.props;
        return (
            <StageComponent
                canvas={this.canvas}
                colorInfo={this.state.colorInfo}
                dragRef={this.setDragCanvas}
                question={this.state.question}
                onDoubleClick={this.handleDoubleClick}
                onQuestionAnswered={this.handleQuestionAnswered}
                hunger={this.state.hunger}
                cleanliness={this.state.cleanliness}
                happiness={this.state.happiness}
                energy={this.state.energy}
                petReactionMessage={this.state.petReactionMessage}
                petSpeechMessage={this.state.petSpeechMessage}
                petSpeechVisible={this.state.petSpeechVisible}
                petX={this.state.petX}
                petY={this.state.petY}
                foodItems={this.state.foodItems}
                collectedFood={this.state.collectedFood}
                wasteItems={this.state.wasteItems}
                isSleeping={this.state.isSleeping}
                sleepCountdown={this.state.sleepCountdown}
                currentFunFact={this.state.currentFunFact}
                funFactVisible={this.state.funFactVisible}
                petEnabled={this.state.petEnabled}
                onFeedPet={this.handleFeedPet}
                onPlayWithPet={this.handlePlayWithPet}
                onCleanPet={this.handleCleanPet}
                onSleepPet={this.handleSleepPet}
                onClearPetReactionMessage={this.clearPetReactionMessage}
                onTogglePet={this.handleTogglePet}
                onCollectFood={this.collectFood}
                onFoodClick={this.handleFoodClick}
                onCollectWaste={this.collectFood}
                onWasteClick={this.handleWasteClick}
                anyModalVisible={anyModalVisible}
                isStarted={this.props.isStarted}
                // Attach sprite click handler to the stage wrapper
                onStageClick={this.handleSpriteClick}
                {...props}
            />
        );
    }
}

Stage.propTypes = {
    isColorPicking: PropTypes.bool,
    isFullScreen: PropTypes.bool.isRequired,
    isStarted: PropTypes.bool,
    micIndicator: PropTypes.bool,
    onActivateColorPicker: PropTypes.func,
    onDeactivateColorPicker: PropTypes.func,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    useEditorDragStyle: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired,
};

Stage.defaultProps = {
    useEditorDragStyle: true,
};

const mapStateToProps = (state) => ({
    anyModalVisible: Object.keys(state.scratchGui.modals).some(
        (key) => state.scratchGui.modals[key]
    ),
    isStarted: state.scratchGui.vmStatus.started,
    editingTarget: state.scratchGui.targets.editingTarget,
    sprites: state.scratchGui.targets.sprites,
});

const mapDispatchToProps = (dispatch) => ({
    onActivateColorPicker: () => dispatch(activateColorPicker()),
    onDeactivateColorPicker: (color) => dispatch(deactivateColorPicker(color)),
});

export default connect(mapStateToProps)(Stage);
