import { Component } from "react";

/** Renders `fallback` (or nothing) when a child throws, e.g. a lazy chunk fails to load. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    this.props.onError?.(error);
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
