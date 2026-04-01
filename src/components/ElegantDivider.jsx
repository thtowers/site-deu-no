import React from 'react';
import { motion } from 'framer-motion';

const ElegantDivider = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            {/* Top Line */}
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                whileInView={{ height: 40, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-px bg-linear-to-b from-transparent via-[#78877a] to-[#78877a]"
            ></motion.div>

            {/* Central Diamond */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-3 h-3 border border-[#78877a] rotate-45 my-2 bg-[#faf9f7]"
            ></motion.div>

            {/* Bottom Line */}
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                whileInView={{ height: 40, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-px bg-linear-to-t from-transparent via-[#78877a] to-[#78877a]"
            ></motion.div>
        </div>
    );
};

export default ElegantDivider;
