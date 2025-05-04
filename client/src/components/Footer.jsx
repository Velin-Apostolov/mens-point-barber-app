export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-4">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <p className="text-sm">© {new Date().getFullYear()} Lokkal OOD. All rights reserved.</p>
            </div>
        </footer>
    );
}