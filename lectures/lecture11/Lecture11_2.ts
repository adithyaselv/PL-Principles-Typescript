import {Exp, Atom, Lambda, App, Symbol, Value} from "../../utils/LambdaCalculus";
import { Parser } from "../../utils/Parser";

type Cont<A> = (x: A) => A;

type ClosureK = (x: ValueK, k: Cont<ValueK>) => ValueK;

type ValueK = Atom | ClosureK;

type EnvK = (x: Symbol, ek:Cont<ValueK>) => ValueK;

let applyEnv = (env: EnvK, x: Symbol, k: Cont<ValueK>) => {
    return env(x, k);
}

let initEnv = (x: Symbol, k: Cont<ValueK>) => {
    throw new Error("Unbound variable");
}

let extendEnv = (env: EnvK, arg: Symbol, v: ValueK) => {
    return (y: Symbol, ek:Cont<ValueK>) => {
        return y.val === arg.val ? ek(v) : applyEnv(env, y, ek);
    }
}


let randK = (rator: ValueK, k: Cont<ValueK>) => {
    return (rand: ValueK) => {
        if(rator instanceof Function) {
            return rator(rand, k);
        }
        else {
            throw new Error("rator is not a lambda");
        }
    }
}

let ratorK = (exp: App, env: EnvK, k: Cont<ValueK>) => {
    return (rator: ValueK) => {
        return valofcps(exp.rand, env, randK(rator, k));
    }
}

let makeClosure = (exp: Lambda, env: EnvK) => {
    return (x: ValueK, lk: Cont<ValueK>) => {
        return valofcps(exp.body, extendEnv(env, exp.arg, x), lk);
    }
}

let applyK: (k: Cont<ValueK>, v: ValueK) => ValueK
applyK = (k, v) => {
    return k(v);
}

// CPS interpreter

let valofcps: (exp: Exp, env: EnvK, k: Cont<ValueK>) => ValueK
valofcps = (exp, env, k) => {
    if(exp instanceof Atom) {
        return applyK(k, exp);
    }
    else if(exp instanceof Symbol) {
        return applyEnv(env, exp, k);
    }
    else if(exp instanceof Lambda) {
        return applyK(k, makeClosure(exp, env));
    }
    else if(exp instanceof App) {
        return valofcps(exp.rator, env, ratorK(exp, env, k));
    }
    else {
        throw new Error("Invalid input");
    }
}


console.log("Testing function valof");
// let exp1 = new App(new Lambda(new Symbol("x"), new Symbol("x")), new Atom(5));
// let exp2 = new Lambda(new Symbol("x"), new Symbol("x"));
let exp1 = new Parser("((λ(x)x) 5)").parse();
let exp2 = new Parser("(λ(x)x)").parse(); 

console.log("Testing function valofcps");
console.log(valofcps(exp1, initEnv, (v: ValueK) => v).toString());
let val2 = valofcps(exp2, initEnv, (v: ValueK) => v);
val2 instanceof Function ? console.log(val2(new Atom(25), (v: ValueK) => v).toString()) : console.log(val2.toString());


// Todo: generate a data structure version of the above code

class MakeRatorK {
    constructor(public exp: App, public env: EnvKDS, public k: ContDs) {}
}

class MakeRandK {
    constructor(public rator: ValueKDS, public k: ContDs) {}
}

class InitK {
    constructor() {}
}

type ContDs = MakeRatorK | MakeRandK | InitK;

type EnvKDS = (x: Symbol, ek:ContDs) => ValueKDS;

type ClosureKDS = (x: ValueKDS, k: ContDs) => ValueKDS;

type ValueKDS = Atom | ClosureKDS;

let makeClosureDS = (exp: Lambda, env: EnvKDS) => {
    return (x: ValueKDS, lk: ContDs) => {
        return valofcpsDS(exp.body, extendEnvDS(env, exp.arg, x), lk);
    }
}

let extendEnvDS = (env: EnvKDS, arg: Symbol, v: ValueKDS) => {
    return (y: Symbol, ek:ContDs) => {
        return y.val === arg.val ? v : applyEnvDS(env, y, ek);
    }
}

let applyEnvDS = (env: EnvKDS, x: Symbol, k: ContDs) => {
    return env(x, k);
}

let initEnvDS = (x: Symbol, k: ContDs) => {
    throw new Error("Unbound variable");
}

let applyKds: (c: ContDs, v: ValueKDS) => ValueKDS
applyKds = (c, v) => {
    if(c instanceof MakeRatorK) {
        return valofcpsDS(c.exp.rand, c.env, new MakeRandK(v, c.k));
    }
    else if(c instanceof MakeRandK) {
        if(c.rator instanceof Function) {
            return c.rator(v, c.k);
        }
        else {
            throw new Error("rator is not a lambda");
        }
    }
    else if(c instanceof InitK) {
        return v;
    }
    else {
        throw new Error("Invalid input");
    }
}

let valofcpsDS: (exp: Exp, env: EnvKDS, k: ContDs) => ValueKDS
valofcpsDS = (exp, env, k) => {
    if(exp instanceof Atom) {
        return applyKds(k, exp);
    }
    else if(exp instanceof Symbol) {
        return applyEnvDS(env, exp, k);
    }
    else if(exp instanceof Lambda) {
        return applyKds(k, makeClosureDS(exp, env));
    }
    else if(exp instanceof App) {
        return valofcpsDS(exp.rator, env, new MakeRatorK(exp, env, k));
    }
    else {
        throw new Error("Invalid input");
    }
}

console.log("Testing function valofcpsDS");
console.log(valofcpsDS(exp1, initEnvDS, new InitK()).toString());
let val2ds = valofcpsDS(exp2, initEnvDS, new InitK());
val2ds instanceof Function ? console.log(val2ds(new Atom(25), new InitK()).toString()) : console.log(val2ds.toString());