export function Avatar({ children }) {
    return <div className="avatar-container">{children}</div>;
  }
  
  export function AvatarFallback({ children }) {
    return <span className="avatar-fallback">{children}</span>;
  }