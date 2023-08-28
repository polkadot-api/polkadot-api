export class ErrorStop extends Error {
  constructor() {
    super("ChainHead stopped")
  }
}

export class ErrorDisjoint extends Error {
  constructor() {
    super("ChainHead disjointed")
  }
}

export class ErrorOperationLimit extends Error {
  constructor() {
    super("ChainHead operations limit reached")
  }
}

export class ErrorOperation extends Error {
  constructor(error: string) {
    super(error)
  }
}

export class ErrorOperationInaccessible extends Error {
  constructor() {
    super("ChainHead operation inaccessible")
  }
}
