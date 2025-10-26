import { Link } from "react-router";

interface NavbarProps {
    onSignOut?: () => void; // optional callback
}

export default function Navbar({ onSignOut }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-8 py-4 bg-white shadow z-50">
            {/* Logo links back to home */}
            <Link to="/" className="logo text-3xl font-bold">
                Resumind
            </Link>

            <div className="nav-links flex items-center gap-4">
                <Link
                    to="/upload"
                    className="primary-button w-fit text-lg font-medium ml-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
                >
                    Upload Resume
                </Link>

                {onSignOut && (
                    <button
                        onClick={onSignOut}
                        className="secondary-button w-fit text-lg font-medium bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full shadow"
                    >
                        Sign Out
                    </button>
                )}
            </div>
        </nav>
    );
}