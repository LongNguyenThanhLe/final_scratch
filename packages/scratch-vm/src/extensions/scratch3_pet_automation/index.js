const ArgumentType = require("../../extension-support/argument-type");
const BlockType = require("../../extension-support/block-type");
const Cast = require("../../util/cast");
const formatMessage = require("format-message");

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
const blockIconURI =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+cGV0LWljb248L3RpdGxlPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTIwIDJjLTkuOTQgMC0xOCA4LjA2LTE4IDE4czguMDYgMTggMTggMTggMTgtOC4wNiAxOC0xOFMyOS45NCAyIDIwIDJ6bTAgMzJjLTcuNzMgMC0xNC02LjI3LTE0LTE0czYuMjctMTQgMTQtMTQgMTQgNi4yNyAxNCAxNC02LjI3IDE0LTE0IDE0eiIgZmlsbD0iIzQyQTVGNSIvPjxwYXRoIGQ9Ik0xNSAxOGMtMS4xIDAtMiAuOS0yIDJzLjkgMiAyIDIgMi0uOSAyLTItLjktMi0yLTJ6bTEwIDBjLTEuMSAwLTIgLjktMiAyczAuOSAyIDIgMiAyLS45IDItMi0uOS0yLTItMnoiIGZpbGw9IiM0MkE1RjUiLz48cGF0aCBkPSJNMjAgMjRjLTIuNzYgMC01LTIuMjQtNS01czIuMjQtNSA1LTUgNSAyLjI0IDUgNS0yLjI0IDUtNSA1eiIgZmlsbD0iIzQyQTVGNSIvPjwvZz48L3N2Zz4=";

/**
 * Host for the Pet Automation blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class Scratch3PetAutomationBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} Metadata about this extension and its blocks.
     */
    getInfo() {
        return {
            id: "petAutomation",
            name: formatMessage({
                id: "petAutomation.categoryName",
                default: "Pet Automation",
                description: "Name of the pet automation category",
            }),
            blockIconURI: blockIconURI,
            color1: "#42A5F5",
            color2: "#1976D2",
            color3: "#0D47A1",
            blocks: [
                {
                    opcode: "autoFeed",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "petAutomation.autoFeed",
                        default: "auto feed pet",
                        description: "Automatically feed the pet",
                    }),
                },
                {
                    opcode: "autoCollectFood",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "petAutomation.autoCollectFood",
                        default: "auto collect food",
                        description:
                            "Automatically collect food from the stage",
                    }),
                },
                {
                    opcode: "autoSleep",
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: "petAutomation.autoSleep",
                        default: "auto sleep pet",
                        description: "Automatically put the pet to sleep",
                    }),
                },
                {
                    opcode: "getFoodCount",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "petAutomation.getFoodCount",
                        default: "food count",
                        description: "Get the current food count",
                    }),
                },
                {
                    opcode: "getPetHunger",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "petAutomation.getPetHunger",
                        default: "pet hunger",
                        description: "Get the current pet hunger level",
                    }),
                },
                {
                    opcode: "getPetCleanliness",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "petAutomation.getPetCleanliness",
                        default: "pet cleanliness",
                        description: "Get the current pet cleanliness level",
                    }),
                },
                {
                    opcode: "getPetEnergy",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "petAutomation.getPetEnergy",
                        default: "pet energy",
                        description: "Get the current pet energy level",
                    }),
                },
                {
                    opcode: "getPetHappiness",
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        id: "petAutomation.getPetHappiness",
                        default: "pet happiness",
                        description: "Get the current pet happiness level",
                    }),
                },
                {
                    opcode: "isPetSick",
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: "petAutomation.isPetSick",
                        default: "pet is sick?",
                        description: "Check if the pet is sick",
                    }),
                },
                {
                    opcode: "isPetSleeping",
                    blockType: BlockType.BOOLEAN,
                    text: formatMessage({
                        id: "petAutomation.isPetSleeping",
                        default: "pet is sleeping?",
                        description: "Check if the pet is sleeping",
                    }),
                },
            ],
        };
    }

    /**
     * Auto feed the pet
     * @param {object} args - the arguments to this block
     * @param {object} util - utility object provided by the runtime
     */
    autoFeed(args, util) {
        // Emit a custom event that the GUI can listen to
        this.runtime.emit("PET_AUTO_FEED");
    }

    /**
     * Auto collect food from the stage
     * @param {object} args - the arguments to this block
     * @param {object} util - utility object provided by the runtime
     */
    autoCollectFood(args, util) {
        // Emit a custom event that the GUI can listen to
        this.runtime.emit("PET_AUTO_COLLECT_FOOD");
    }

    /**
     * Auto sleep the pet
     * @param {object} args - the arguments to this block
     * @param {object} util - utility object provided by the runtime
     */
    autoSleep(args, util) {
        // Emit a custom event that the GUI can listen to
        this.runtime.emit("PET_AUTO_SLEEP");
    }

    /**
     * Get the current food count
     * @param {object} args - the arguments to this block
     * @param {object} util - utility object provided by the runtime
     * @returns {number} the food count
     */
    getFoodCount(args, util) {
        // This will be updated by the GUI when pet state changes
        return util.target.petFoodCount || 0;
    }

    /**
     * Get the current pet hunger level
     * @param {object} args - the arguments to this block
     * @param {object} util - utility object provided by the runtime
     * @returns {number} the hunger level (0-100)
     */
    getPetHunger(args, util) {
        return util.target.petHunger || 0;
    }

    /**
     * Get the current pet cleanliness level
     * @param {object} args - the arguments to this block
     * @param {object} util - utility object provided by the runtime
     * @returns {number} the cleanliness level (0-100)
     */
    getPetCleanliness(args, util) {
        return util.target.petCleanliness || 0;
    }

    /**
     * Get the current pet energy level
     * @param {object} args - the arguments to this block
     * @param {object} util - utility object provided by the runtime
     * @returns {number} the energy level (0-100)
     */
    getPetEnergy(args, util) {
        return util.target.petEnergy || 0;
    }

    /**
     * Get the current pet happiness level
     * @param {object} args - the arguments to this block
     * @param {object} util - utility object provided by the runtime
     * @returns {number} the happiness level (0-100)
     */
    getPetHappiness(args, util) {
        return util.target.petHappiness || 0;
    }

    /**
     * Check if the pet is sick
     * @param {object} args - the arguments to this block
     * @param {object} util - utility object provided by the runtime
     * @returns {boolean} true if the pet is sick
     */
    isPetSick(args, util) {
        return util.target.petIsSick || false;
    }

    /**
     * Check if the pet is sleeping
     * @param {object} args - the arguments to this block
     * @param {object} util - utility object provided by the runtime
     * @returns {boolean} true if the pet is sleeping
     */
    isPetSleeping(args, util) {
        return util.target.petIsSleeping || false;
    }
}

module.exports = Scratch3PetAutomationBlocks;
