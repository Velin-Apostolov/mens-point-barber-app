import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const closeMenu = () => setIsOpen(false);

    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const sidebarVariants = {
        hidden: { x: '100%', opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
                duration: 0.3
            }
        },
        exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const desktopNavVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const desktopItemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    };


    return (
        <nav className="bg-white shadow-md fixed w-full top-0 left-0 z-50 h-auto">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative">
                {/* Left: Logo */}
                <Link to="/" className="text-2xl font-bold text-gray-800">Mens Point</Link>

                {/* Center: Navigation links */}
                <motion.div
                    className="hidden md:block absolute left-1/2 transform -translate-x-1/2"
                    variants={desktopNavVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex space-x-6">
                        <motion.div variants={desktopItemVariants}>
                            <Link to="/gallery" className="text-gray-600 hover:text-blue-500">{t('gallery')}</Link>
                        </motion.div>
                        <motion.div variants={desktopItemVariants}>
                            <Link to="/about" className="text-gray-600 hover:text-blue-500">{t('about')}</Link>
                        </motion.div>
                    </div>
                </motion.div>


                {/* Right: Language Switcher (Desktop Only) */}
                <motion.div
                    className="hidden md:flex items-center space-x-2"
                    variants={desktopNavVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={desktopItemVariants}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 text-gray-600"
                            onClick={() => changeLanguage("bg")}
                        >
                            BG
                        </Button>
                    </motion.div>
                    <motion.div variants={desktopItemVariants}>
                        <span className="text-gray-400">/</span>
                    </motion.div>
                    <motion.div variants={desktopItemVariants}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="px-2 text-gray-600"
                            onClick={() => changeLanguage("en")}
                        >
                            EN
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Mobile menu toggle */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>


            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeMenu}></div>

                        <motion.div
                            variants={sidebarVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="fixed top-0 right-0 h-[50%] w-[60%] bg-white shadow-lg z-50"
                        >
                            <button className="absolute top-4 right-4" onClick={closeMenu}>
                                <X size={24} />
                            </button>

                            <div className="flex flex-col items-center mt-16 space-y-6">
                                <motion.div variants={itemVariants}>
                                    <Link to="/gallery" className="text-gray-600 hover:text-blue-500" onClick={closeMenu}>
                                        {t('gallery')}
                                    </Link>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <Link to="/about" className="text-gray-600 hover:text-blue-500" onClick={closeMenu}>
                                        {t('about')}
                                    </Link>
                                </motion.div>

                                <motion.div variants={itemVariants}>
                                    <div className="flex space-x-2 mt-4">
                                        <Button variant="ghost" size="sm" className="px-3 text-gray-600" onClick={() => changeLanguage('bg')}>BG</Button>
                                        <span className="text-gray-400">/</span>
                                        <Button variant="ghost" size="sm" className="px-3 text-gray-600" onClick={() => changeLanguage('en')}>EN</Button>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>


        </nav>
    );
}