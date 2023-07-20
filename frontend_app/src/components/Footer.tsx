import React from "react";

export const Footer = () => {
    return <footer className="footer mt-auto">
        <div className="container p-3">
            <div className="text-end text-muted">
                <div className="footer-links">
                    <a href="/api/">API</a>
                </div>
            </div>
        </div>
    </footer>
}

export const SmallFooter = () => {
  return <div className="text-center text-muted small">
    <a href="/api/">API</a>
  </div>;
}
