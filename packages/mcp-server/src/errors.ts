export class MCPToolError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "MCPToolError";
    this.code = code;
  }
}
