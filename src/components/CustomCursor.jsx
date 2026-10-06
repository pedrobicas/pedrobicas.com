export default function CustomCursor() {
  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor-dot"></div>
      <div className="cursor-ring"><i><span className="cursor-label"></span></i></div>
    </div>
  );
}
