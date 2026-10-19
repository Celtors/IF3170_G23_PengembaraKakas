import React, { useState } from "react";
import "./App.css";

const AppLayout: React.FC = () => {
    const [collapseLeft, setCollapseLeft] = useState<boolean>(false);
    const [collapseBottom, setCollapseBottom] = useState<boolean>(false);

    return (
        <div
            className={`grid-container 
            ${collapseLeft ? "no-left" : ""} 
            ${collapseBottom ? "no-bottom" : ""}`}
        >
            {!collapseLeft && (
            <div className="left">
                <p>Left Section Content</p>
                <button onClick={() => setCollapseLeft(true)}>Collapse</button>
            </div>
            )}
            <div className="top-right">
            <p>Top Right Content</p>
            {collapseLeft && (
                <button onClick={() => setCollapseLeft(false)}>Expand Left</button>
            )}
            {collapseBottom && (
                <button onClick={() => setCollapseBottom(false)}>Expand Bottom</button>
            )}
            </div>
            {!collapseBottom && (
            <div className="bottom">
                <p>Bottom Section Content</p>
                <button onClick={() => setCollapseBottom(true)}>Collapse</button>
            </div>
            )}
        </div>
    );
};

export default AppLayout;
