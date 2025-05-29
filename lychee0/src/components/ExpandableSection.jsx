import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const ExpandableSection = ({ title, children }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="admin-card">
            <div className="admin-card-header" onClick={() => setExpanded(!expanded)}>
                <h3>{title}</h3>
                {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        className="admin-card-body"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExpandableSection;
