export default function SidebarProfile({ auth }) {
  return (
    <div className="profile-card">
      <div className="avatar-badge">{auth.username.slice(0, 1).toUpperCase()}</div>
      <strong>{auth.username}</strong>
    </div>
  );
}
