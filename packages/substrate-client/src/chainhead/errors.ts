export class StopError extends Error {
  constructor() {
    super("ChainHead stopped")
    this.name = "StopError"
  }
}

export class DisjointError extends Error {
  constructor() {
    super("ChainHead disjointed")
    this.name = "DisjointError"
  }
}

export class OperationLimitError extends Error {
  constructor() {
    super("ChainHead operations limit reached")
    this.name = "OperationLimitError"
  }
}

export class OperationError extends Error {
  constructor(error: string) {
    super(error)
    this.name = "OperationError"
  }
}

export class OperationInaccessibleError extends Error {
  constructor() {
    super("ChainHead operation inaccessible")
    this.name = "OperationInaccessibleError"
  }
}
