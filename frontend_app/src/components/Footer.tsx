import React from "react";

export const Footer = () => {
    return <footer className="footer mt-auto">
        <div className="container p-3">
            <div className="text-end text-muted">
                <div className="footer-links">
                    <a href="/api/" className="mx-2">API</a> | <a href="/terms" className="mx-2">Terms</a>
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
