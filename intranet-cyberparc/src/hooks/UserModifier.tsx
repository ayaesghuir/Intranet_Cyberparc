import toast from "react-hot-toast";

export function useModifier() {
  return (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
    toast(
  (t) => (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "center",
        whiteSpace: "nowrap",
        textAlign: "center"
      }}
    >
      <span>{message}</span>

      <button
        onClick={() => {
          toast.dismiss(t.id);
          resolve(true);
        }}
        style={{
          background: "#989226",
          color: "#fff",
          border: "none",
          padding: "4px 10px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Modifier
      </button>

      <button
        onClick={() => {
          toast.dismiss(t.id);
          resolve(false);
        }}
        style={{
          background: "#e5e7eb",
          border: "none",
          padding: "4px 10px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Annuler
      </button>
    </div>
  ),
  {
    duration: Infinity,
    position: "top-center"
  }
);

    });
  };
}
export default useModifier;