import React, { useState } from 'react';


export default function useExpand() {

    const [expanded, setExpanded] = useState(false);

    function expandButton() {
        setExpanded(true);
    };
    
    return { expanded, expandButton };

};