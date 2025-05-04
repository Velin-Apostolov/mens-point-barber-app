import { motion } from "framer-motion";

const images = [
    "/images/barber-1.avif",
    "/images/barber-2.avif",
    "/images/barber-3.avif",
];

export default function Gallery() {
    return (
        <div className="min-h-screen px-6 py-12 bg-white">
            <h1 className="text-4xl font-bold text-center mb-8">Gallery</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {images.map((src, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden rounded-2xl shadow-lg group"
                    >
                        <img
                            src={src}
                            alt={`Style ${i + 1}`}
                            className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300 ease-in-out"
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}