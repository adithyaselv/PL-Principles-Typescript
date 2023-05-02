import {Exp, Atom, Lambda, App, Symbol, Plus} from "./LambdaCalculus";

export class Parser {
  private input: string;
  private pos: number;
  private tokens: string[];

  constructor(input: string) {
    this.input = input;
    this.pos = 0;
    this.tokens = [];
    this.tokenise();
    // console.log(this.tokens);
  }

  parse(): Exp {
    this.skipWhitespace();

    let exp = this.parseExp();

    this.skipWhitespace();

    if (this.pos < this.input.length) {
      throw new Error("Unexpected input");
    }

    return exp;
  }

  private parseExp(): Exp {
    this.skipWhitespace();

    let ch = this.peek();

    if (ch === "(") {
      this.consume("(");
      let exp = this.parseAppOrLambda();
      this.consume(")");
      return exp;
    } else if (/[a-zA-Z]/.test(ch)) {
      return this.parseSymbol();
    } else if (/[0-9]/.test(ch)) {
      return this.parseAtom();
    } else {
      throw new Error("Invalid input");
    }
  }

  private parseAppOrLambda(): Exp {
    this.skipWhitespace();

    let ch = this.peek();

    if (ch === "λ") {
      this.consume("λ");
      this.consume("(");
      let symbol = this.parseSymbol();
      this.consume(")");
      let body = this.parseExp();
      return new Lambda(symbol, body);
    } 
    else if (ch === "+") {
      this.consume("+");
      let left = this.parseExp();
      let right = this.parseExp();
      return new Plus(left, right);
    } 
    else {
      let rator = this.parseExp();
      let rand = this.parseExp();
      return new App(rator, rand);
    }
  }

  private parseSymbol(): Symbol {
    let name = "";

    while (/[a-zA-Z0-9]/.test(this.peek())) {
      name += this.consume();
    }

    return new Symbol(name);
  }

  private parseAtom(): Atom {
    let numStr = "";

    while (/[0-9]/.test(this.peek())) {
      numStr += this.consume();
    }

    let num = parseInt(numStr);

    return new Atom(num);
  }

  private skipWhitespace() {
    while (/\s/.test(this.peek())) {
      this.consume();
    }
  }

  private peek(): string {
    return this.input.charAt(this.pos);
  }

  private consume(expected?: string): string {
    let ch = this.input.charAt(this.pos);

    if (expected && ch !== expected) {
      throw new Error(`Expected ${expected} but found ${ch}`);
    }

    this.pos++;

    return ch;
  }

  private tokenise(){
    // Remove leading and trailing whitespace
    let trimmedInput = this.input.trim();
    
    // Split the S-expression into tokens
    const regex = /([()'"]|\s+)/g;
    this.tokens = trimmedInput.split(regex).filter((token) => !token.match(/^\s*$/));
  }
}