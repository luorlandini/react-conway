import React, {useCallback, useEffect, useState} from "react";

export function useBrushContextMenu(wrapperRef, contextMenuRef) {
    const [isOpen, setIsOpen] = useState(false);
    const [clickPosition, setClickPosition] = useState({x: 0, y: 0});
    const [openUp, setOpenUp] = useState(false);
    const [openRight, setOpenRight] = useState(false);
    const [usesTouch, setUsesTouch] = useState(false);

    const contextHandler = useCallback((event) => {
        if (usesTouch) {
            return;
        }
        event.preventDefault();

        const menu = contextMenuRef.current;
        const dimensions = menu.getBoundingClientRect();

        let x = event.clientX;
        let y = event.clientY;

        if (x + dimensions.width > window.innerWidth) {
            setOpenRight(true);
        } else {
            setOpenRight(false);
        }
        if (y + dimensions.height > window.innerHeight) {
            setOpenUp(true);
        } else {
            setOpenUp(false);
        }

        setClickPosition({x, y});
        setIsOpen(true)


    }, [setIsOpen, setClickPosition, setOpenUp, setOpenRight, contextMenuRef, usesTouch]);

    const touchHandler = useCallback((event) => {
        setUsesTouch(true);
    }, [setUsesTouch]);


    useEffect(() => {
        const ref = wrapperRef.current;

        ref.addEventListener("contextmenu", contextHandler, false);
        ref.addEventListener("touchstart", touchHandler, false);
        return () => {
            ref.removeEventListener("contextmenu", contextHandler, false);
            ref.removeEventListener("touchstart", touchHandler, false);
        };
    }, [wrapperRef, contextHandler, touchHandler]);

    return [clickPosition, isOpen, setIsOpen, openUp, openRight]
}


export function ContextMenu({contextMenuRef, children, isOpen, clickPosition, onBodyClick, openUp, openRight}) {
    const transformY = openUp ? "-100%" : "0";
    const transformX = openRight ? "-100%" : "0";

    return (
        <div className={`context-menu-wrapper ${isOpen}`}
             onClick={onBodyClick}>
            <div ref={contextMenuRef}
                 style={{
                     left: clickPosition.x,
                     top: clickPosition.y,
                     transform: `translate(${transformX}, ${transformY})`
                 }}
                 className={`context-menu `}>
                {children}
            </div>
        </div>
    )
}
