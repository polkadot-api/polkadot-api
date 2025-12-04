export class StopError extends Error {
  static errorName = "StopError"

  constructor() {
    super("ChainHead stopped")
    this.name = StopError.errorName
  }
}

export class DisjointError extends Error {
  static errorName = "DisjointError"

  constructor() {
    super("ChainHead disjointed")
    this.name = DisjointError.errorName
  }
}

export class OperationLimitError extends Error {
  static errorName = "OperationLimitError"

  constructor() {
    super("ChainHead operations limit reached")
    this.name = OperationLimitError.errorName
  }
}

export class OperationError extends Error {
  static errorName = "OperationError"

  constructor(error: string) {
    super(error)
    this.name = OperationError.errorName
  }
}

export class OperationInaccessibleError extends Error {
  static errorName = "OperationInaccessibleError"

  constructor() {
    super("ChainHead operation inaccessible")
    this.name = OperationInaccessibleError.errorName
  }
}
