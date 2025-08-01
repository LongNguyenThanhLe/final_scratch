import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import Box from "../box/box.jsx";
import DOMElementRenderer from "../../containers/dom-element-renderer.jsx";
import Loupe from "../loupe/loupe.jsx";
import MonitorList from "../../containers/monitor-list.jsx";
import TargetHighlight from "../../containers/target-highlight.jsx";
import GreenFlagOverlay from "../../containers/green-flag-overlay.jsx";
import Question from "../../containers/question.jsx";
import MicIndicator from "../mic-indicator/mic-indicator.jsx";
import { STAGE_DISPLAY_SIZES } from "../../lib/layout-constants.js";
import { getStageDimensions } from "../../lib/screen-utils.js";
import styles from "./stage.css";
import ButtonComponent from "../button/button.jsx";
import Switch from "../button/switch.jsx";
import FunFact from "../fun-fact/fun-fact.jsx";
import feedIcon from "./icon--feed.svg";
import playIcon from "./icon--play.svg";
import cleanIcon from "./icon--clean.svg";
import sleepIcon from "./icon--sleep.svg";
import medicineIcon from "./icon--medicine.svg";

const StageComponent = (props) => {
    const {
        canvas,
        dragRef,
        isColorPicking,
        isFullScreen,
        isStarted,
        colorInfo,
        micIndicator,
        question,
        stageSize,
        useEditorDragStyle,
        onDeactivateColorPicker,
        onDoubleClick,
        onQuestionAnswered,
        onFeedPet,
        onPlayWithPet,
        onCleanPet,
        onSleepPet,
        hunger,
        cleanliness,
        happiness,
        energy,
        petReactionMessage,
        petSpeechMessage,
        petSpeechVisible,
        petX,
        petY,
        foodItems,
        collectedFood,
        onFoodClick,
        wasteItems,
        onWasteClick,
        isSleeping,
        sleepCountdown,
        currentFunFact,
        funFactVisible,
        isSick,
        medicineCount,
        disableFeed,
        disablePlay,
        disableClean,
        disableFood,
        disableWaste,
        disableSleep,
        petEnabled,
        onTogglePet,
        anyModalVisible,
        ...boxProps
    } = props;

    const stageDimensions = getStageDimensions(stageSize, isFullScreen);
    const foodEmojis = ["\ud83c\udf4e", "\ud83e\uddb4", "\ud83d\udc1f"];

    return (
        <React.Fragment>
            <Box
                className={classNames(styles.stageWrapper, {
                    [styles.withColorPicker]: !isFullScreen && isColorPicking,
                })}
                onDoubleClick={onDoubleClick}
                onClick={props.onStageClick}
            >
                {/* Only show the Virtual Pet switch if the project has started and no modal is visible */}
                {isStarted && !anyModalVisible && (
                    <div
                        style={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            zIndex: 2000,
                        }}
                        title={
                            petEnabled ? "Virtual Pet: ON" : "Virtual Pet: OFF"
                        }
                    >
                        <Switch
                            checked={petEnabled}
                            onChange={onTogglePet}
                            label="Virtual Pet"
                        />
                    </div>
                )}
                <Box
                    className={classNames(styles.stage, {
                        [styles.fullScreen]: isFullScreen,
                    })}
                    style={{
                        height: stageDimensions.height,
                        width: stageDimensions.width,
                    }}
                >
                    <DOMElementRenderer
                        domElement={canvas}
                        style={{
                            height: stageDimensions.height,
                            width: stageDimensions.width,
                        }}
                        {...boxProps}
                    />
                    {/* Only render pet UI if enabled */}
                    {petEnabled && (
                        <>
                            {/* Food Items */}
                            {foodItems &&
                                foodItems.map((food) => (
                                    <div
                                        key={food.id}
                                        className={styles.foodItem}
                                        style={{
                                            position: "absolute",
                                            left: `${food.x}px`,
                                            top: `${food.y}px`,
                                            transform: "translate(-50%, -50%)",
                                            cursor:
                                                isSleeping || disableFood
                                                    ? "not-allowed"
                                                    : "pointer",
                                            zIndex: 100,
                                            pointerEvents:
                                                isSleeping || disableFood
                                                    ? "none"
                                                    : "auto",
                                        }}
                                        onClick={
                                            isSleeping || disableFood
                                                ? undefined
                                                : () => onFoodClick(food.id)
                                        }
                                    >
                                        <span className={styles.foodEmoji}>
                                            {foodEmojis[food.type || 0]}
                                        </span>
                                    </div>
                                ))}
                            {/* Waste Items */}
                            {wasteItems &&
                                wasteItems.map((waste) => (
                                    <div
                                        key={waste.id}
                                        className={styles.wasteItem}
                                        style={{
                                            position: "absolute",
                                            left: `${waste.x}px`,
                                            top: `${waste.y}px`,
                                            transform: "translate(-50%, -50%)",
                                            cursor:
                                                isSleeping || disableWaste
                                                    ? "not-allowed"
                                                    : "pointer",
                                            zIndex: 101,
                                            fontSize: "2.2rem",
                                            pointerEvents:
                                                isSleeping || disableWaste
                                                    ? "none"
                                                    : "auto",
                                        }}
                                        onClick={
                                            isSleeping || disableWaste
                                                ? undefined
                                                : () => onWasteClick(waste.id)
                                        }
                                        title="Click to clean!"
                                    >
                                        <span role="img" aria-label="waste">
                                            💩
                                        </span>
                                    </div>
                                ))}
                            {/* Pet Status Display */}
                            <div className={styles.petStatusRow}>
                                <div className={styles.petMetric}>
                                    <span className={styles.metricLabel}>
                                        Hunger
                                    </span>
                                    <div className={styles.metricBarWrapper}>
                                        <div
                                            className={styles.metricBar}
                                            style={{
                                                width: `${100 - hunger}%`, // 0 = full, 100 = starving
                                                backgroundColor:
                                                    hunger > 70
                                                        ? "#ff6b6b"
                                                        : hunger > 40
                                                        ? "#ffa726"
                                                        : "#4caf50",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.petMetric}>
                                    <span className={styles.metricLabel}>
                                        Clean
                                    </span>
                                    <div className={styles.metricBarWrapper}>
                                        <div
                                            className={styles.metricBar}
                                            style={{
                                                width: `${cleanliness}%`,
                                                backgroundColor:
                                                    cleanliness > 70
                                                        ? "#4caf50"
                                                        : cleanliness > 40
                                                        ? "#ffa726"
                                                        : "#ff6b6b",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.petMetric}>
                                    <span className={styles.metricLabel}>
                                        Happy
                                    </span>
                                    <div className={styles.metricBarWrapper}>
                                        <div
                                            className={styles.metricBar}
                                            style={{
                                                width: `${happiness}%`,
                                                backgroundColor:
                                                    happiness > 70
                                                        ? "#4caf50"
                                                        : happiness > 40
                                                        ? "#ffa726"
                                                        : "#ff6b6b",
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className={styles.petMetric}>
                                    <span className={styles.metricLabel}>
                                        Energy
                                    </span>
                                    <div className={styles.metricBarWrapper}>
                                        <div
                                            className={styles.metricBar}
                                            style={{
                                                width: `${energy}%`,
                                                backgroundColor:
                                                    energy > 70
                                                        ? "#4caf50"
                                                        : energy > 40
                                                        ? "#ffa726"
                                                        : "#ff6b6b",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Pet Speech Bubble */}
                            {petSpeechVisible && !anyModalVisible && (
                                <div
                                    className={styles.petSpeechBubble}
                                    style={{
                                        position: "absolute",
                                        left: "50%",
                                        bottom: "2.5rem", // Even closer to the button bar
                                        transform: "translateX(-50%)",
                                        zIndex: 1000,
                                    }}
                                >
                                    {petSpeechMessage}
                                </div>
                            )}
                            {/* Pet Reaction Message */}
                            {petReactionMessage && (
                                <div className={styles.petReactionMessage}>
                                    {petReactionMessage}
                                </div>
                            )}
                            {/* Pet Interaction Buttons */}
                            <div className={styles.petButtonRow}>
                                <ButtonComponent
                                    iconSrc={
                                        isSick && collectedFood >= 2
                                            ? medicineIcon
                                            : feedIcon
                                    }
                                    onClick={onFeedPet}
                                    disabled={
                                        (isSick && collectedFood < 2) ||
                                        (!isSick && collectedFood <= 0) ||
                                        isSleeping ||
                                        disableFeed
                                    }
                                >
                                    {isSick && collectedFood >= 2
                                        ? "Medicine"
                                        : `Feed (${collectedFood})`}
                                </ButtonComponent>
                                <ButtonComponent
                                    iconSrc={playIcon}
                                    onClick={onPlayWithPet}
                                    disabled={isSleeping || disablePlay}
                                >
                                    Play
                                </ButtonComponent>
                                <ButtonComponent
                                    iconSrc={cleanIcon}
                                    onClick={onCleanPet}
                                    disabled={isSleeping || disableClean}
                                >
                                    Clean
                                </ButtonComponent>
                                <ButtonComponent
                                    iconSrc={sleepIcon}
                                    onClick={onSleepPet}
                                    disabled={isSleeping || disableSleep}
                                >
                                    Sleep
                                </ButtonComponent>
                            </div>
                            {isSleeping && !anyModalVisible && (
                                <div className={styles.sleepOverlay}>
                                    <span role="img" aria-label="sleeping">
                                        😴
                                    </span>{" "}
                                    Sleeping... Please wait
                                    <div className={styles.sleepCountdown}>
                                        ({sleepCountdown})
                                    </div>
                                    <FunFact
                                        fact={currentFunFact}
                                        visible={funFactVisible}
                                        className={styles.sleepFunFact}
                                    />
                                </div>
                            )}
                            {isSick && !anyModalVisible && (
                                <div className={styles.sickOverlay}>
                                    <span role="img" aria-label="sick">
                                        🤒
                                    </span>{" "}
                                    Pet is sick! Need medicine!
                                    <div className={styles.sickMessage}>
                                        Collect 2 food items to make medicine
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    <Box className={styles.monitorWrapper}>
                        <MonitorList
                            draggable={useEditorDragStyle}
                            stageSize={stageDimensions}
                        />
                    </Box>
                    <Box className={styles.frameWrapper}>
                        <TargetHighlight
                            className={styles.frame}
                            stageHeight={stageDimensions.height}
                            stageWidth={stageDimensions.width}
                        />
                    </Box>
                    {isColorPicking && colorInfo ? (
                        <Loupe colorInfo={colorInfo} />
                    ) : null}
                </Box>
                {/* `stageOverlays` is for items that should *not* have their overflow contained within the stage */}
                <Box
                    className={classNames(styles.stageOverlays, {
                        [styles.fullScreen]: isFullScreen,
                    })}
                >
                    <div
                        className={styles.stageBottomWrapper}
                        style={{
                            width: stageDimensions.width,
                            height: stageDimensions.height,
                        }}
                    >
                        {micIndicator ? (
                            <MicIndicator
                                className={styles.micIndicator}
                                stageSize={stageDimensions}
                            />
                        ) : null}
                        {question === null ? null : (
                            <div
                                className={styles.questionWrapper}
                                style={{ width: stageDimensions.width }}
                            >
                                <Question
                                    question={question}
                                    onQuestionAnswered={onQuestionAnswered}
                                />
                            </div>
                        )}
                    </div>
                    <canvas
                        className={styles.draggingSprite}
                        height={0}
                        ref={dragRef}
                        width={0}
                    />
                </Box>
                {isStarted ? null : (
                    <GreenFlagOverlay
                        className={styles.greenFlagOverlay}
                        wrapperClass={styles.greenFlagOverlayWrapper}
                    />
                )}
            </Box>
            {isColorPicking ? (
                <Box
                    className={styles.colorPickerBackground}
                    onClick={onDeactivateColorPicker}
                />
            ) : null}
        </React.Fragment>
    );
};
StageComponent.propTypes = {
    canvas: PropTypes.instanceOf(Element).isRequired,
    colorInfo: Loupe.propTypes.colorInfo,
    dragRef: PropTypes.func,
    isColorPicking: PropTypes.bool,
    isFullScreen: PropTypes.bool.isRequired,
    isStarted: PropTypes.bool,
    micIndicator: PropTypes.bool,
    onDeactivateColorPicker: PropTypes.func,
    onDoubleClick: PropTypes.func,
    onQuestionAnswered: PropTypes.func,
    question: PropTypes.string,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    useEditorDragStyle: PropTypes.bool,
    onFeedPet: PropTypes.func,
    onPlayWithPet: PropTypes.func,
    onCleanPet: PropTypes.func,
    onSleepPet: PropTypes.func,
    hunger: PropTypes.number,
    cleanliness: PropTypes.number,
    happiness: PropTypes.number,
    energy: PropTypes.number,
    petReactionMessage: PropTypes.string,
    petSpeechMessage: PropTypes.string,
    petSpeechVisible: PropTypes.bool,
    petX: PropTypes.number,
    petY: PropTypes.number,
    foodItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            type: PropTypes.number, // 0: food, 1: waste, 2: collected food
        })
    ),
    collectedFood: PropTypes.number,
    onFoodClick: PropTypes.func,
    wasteItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
        })
    ),
    onWasteClick: PropTypes.func,
    isSleeping: PropTypes.bool,
    sleepCountdown: PropTypes.number,
    currentFunFact: PropTypes.string,
    funFactVisible: PropTypes.bool,
    isSick: PropTypes.bool,
    medicineCount: PropTypes.number,
    disableFeed: PropTypes.bool,
    disablePlay: PropTypes.bool,
    disableClean: PropTypes.bool,
    disableFood: PropTypes.bool,
    disableWaste: PropTypes.bool,
    disableSleep: PropTypes.bool,
    petEnabled: PropTypes.bool,
    onTogglePet: PropTypes.func,
    anyModalVisible: PropTypes.bool,
};
StageComponent.defaultProps = {
    dragRef: () => {},
};
export default StageComponent;
