const API_URL = import.meta.env.VITE_API_URL;
export default function SwaggerDocs() {
  return (
    <iframe
      src={`${API_URL}/docs`}
      style={{ width: "100%", height: "100vh", border: "none" }}
      title="Swagger Documentation"
    />
  );
}
