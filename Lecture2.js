"use strict";
// Lecture 2: Natural Recursion extension
// Ackermann function, currying
let plus;
plus = (n, m) => {
    if (m == 0) {
        return n;
    }
    else {
        return 1 + plus(n, m - 1);
    }
};
console.log("Testing function plus");
console.log(plus(3, 5));
let mult;
mult = (n, m) => {
    if (m == 0) {
        return 0;
    }
    else {
        return m + mult(n, m - 1);
    }
};
console.log("Testing function mult");
console.log(mult(3, 5));
let exp;
exp = (n, m) => {
    if (m == 0) {
        return 1;
    }
    else {
        return n * exp(n, m - 1);
    }
};
console.log("Testing function exp");
console.log(exp(3, 5));
let exp2;
exp2 = (n, m) => {
    if (m == 0) {
        return 1;
    }
    else {
        return exp(n, exp2(n, m - 1));
    }
};
console.log("Testing function exp2");
console.log(exp2(2, 3));
let G;
G = (i) => {
    return (n, m) => {
        if (i == 0) {
            if (m == 0) {
                return n;
            }
            else {
                return 1 + G(i)(n, m - 1);
            }
        }
        else if (i == 1) {
            if (m == 0) {
                return 0;
            }
            else {
                return G(i - 1)(n, G(i)(n, m - 1));
            }
        }
        else {
            if (m == 0) {
                return 1;
            }
            else {
                return G(i - 1)(n, G(i)(n, m - 1));
            }
        }
    };
};
// Testing G
console.log("Testing function G");
console.log(G(0)(3, 5));
console.log(G(1)(3, 5));
console.log(G(2)(3, 5));
console.log(G(3)(2, 3));
let GG;
GG = (i) => {
    return (n, m) => {
        if (i == 0) {
            return m == 0 ? n : 1 + GG(i)(n, m - 1);
        }
        else if (i == 1) {
            return m == 0 ? 0 : GG(i - 1)(n, GG(i)(n, m - 1));
        }
        else {
            return m == 0 ? 1 : GG(i - 1)(n, GG(i)(n, m - 1));
        }
    };
};
// Testing GG
console.log("Testing function GG");
console.log(G(0)(3, 5));
console.log(G(1)(3, 5));
console.log(G(2)(3, 5));
console.log(G(3)(2, 3));
let map;
map = (f, li) => {
    if (li.length == 0) {
        return [];
    }
    else {
        return [f(li[0])].concat(map(f, li.slice(1)));
    }
};
let add1;
add1 = (n) => {
    return n + 1;
};
console.log("Testing function map");
console.log(map(add1, [1, 2, 3, 4, 5]));
let curryiedPlus;
curryiedPlus = (n) => {
    return (m) => {
        return n + m;
    };
};
console.log("Testing function curryiedPlus");
console.log(curryiedPlus(3)(5));
