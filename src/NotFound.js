import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="not-found">
            <div className="not-found-content">
                <span className="not-found-emoji" role="img">
                    🍿
                </span>
                <h1>404</h1>
                <p className="not-found-title">Page not found</p>
                <p className="not-found-message">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="not-found-link">
                    ← Back to PopCorn
                </Link>
            </div>
        </div>
    );
}
