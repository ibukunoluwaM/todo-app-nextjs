export default function TestErrorPage() {
  throw new Error("Intentional crash to test ErrorBoundary");
}
