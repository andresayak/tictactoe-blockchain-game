import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
    return <footer className="footer mt-auto">
        <div className="container p-3">
            <div className="text-end text-muted">
                <div className="footer-links">
                    <a href="/api/" className="mx-2">API</a> | <Link to="/terms" className="mx-2">Terms</Link>
                </div>
            </div>
        </div>
    </footer>
}

export const SmallFooter = () => {
  return <div className="text-center text-muted small">
    <a href="/api/">API</a> | <a href="/terms">Terms</a>
  </div>;
}
