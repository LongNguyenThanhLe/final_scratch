import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";
import styles from "./fun-fact.css";

const FunFact = ({ fact, visible, className }) => {
    if (!visible || !fact) return null;

    return (
        <div className={classNames(styles.funFactContainer, className)}>
            <div className={styles.funFactContent}>
                <div className={styles.funFactIcon}>🐾</div>
                <div className={styles.funFactText}>
                    <span className={styles.funFactLabel}>Fun Fact:</span>
                    <span
                        className={styles.funFactMessage}
                        dangerouslySetInnerHTML={{ __html: fact }}
                    />
                </div>
            </div>
        </div>
    );
};

FunFact.propTypes = {
    fact: PropTypes.string,
    visible: PropTypes.bool,
    className: PropTypes.string,
};

export default FunFact;
